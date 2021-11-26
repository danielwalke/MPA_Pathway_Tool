import {getNLastChars} from "../../usefulFunctions/Strings";

const deleteReversibleLinks = (node, links) => {
    links = links.filter(link => !((link.source === node.id || link.target === node.id) && link.isReversibleLink))
    return links
}

const addReversibleLinks = (node, links) => {
    links.map(link => {
            if (link.source === node.id || link.target === node.id) {
                const reverseLink = {
                    source: link.target,
                    target: link.source,
                    opacity: link.opacity,
                    isReversibleLink: true
                }
                links.push(reverseLink)
            }
            return link
        }
    )
    return links
}

const setLinks = (links, node, changeReversibility, invertDirection) => {

    const newLinks = []
    let nonRev = 0
    let rev = 0

    for (const link of links) {

        let forwardLink

        console.log("Change Reversibility: " + changeReversibility)

        // reset link styles
        link.strokeWidth = undefined
        link.color = undefined

        // add or delete reverse links
        if (changeReversibility && node) {
            if (node.reversible && !((link.source === node.id || link.target === node.id) && link.isReversibleLink)) {
                // only add links in forward direction, if reversibility is set from true to false
                forwardLink = link
                nonRev++
            } else if (!node.reversible) {
                // push reverse links, if reversibility is set from false to true
                if (link.source === node.id || link.target === node.id) {
                    const reverseLink = {
                        source: link.target,
                        target: link.source,
                        opacity: link.opacity,
                        isReversibleLink: true
                    }
                    newLinks.push(reverseLink)
                    rev++
                }
                newLinks.push(link)
                nonRev++
            }
        } else {
            forwardLink = link
        }

        // invert link direction of irreversible links
        if (forwardLink) {
            if (invertDirection && !forwardLink.isReversibleLink && (forwardLink.source === node.id || forwardLink.target === node.id)) {
                // store original connection
                const target = forwardLink.target
                const source = forwardLink.source

                // invert connection
                forwardLink.source = target
                forwardLink.target = source
            }
            newLinks.push(forwardLink)
        }
    }

    console.log("non Rev: " + nonRev)
    console.log("Rev: " + rev)


    return newLinks
}

const setNodes = (nodeId, graphState) => {

    return graphState.data.nodes.map(
            node => {
                if (getNLastChars(node.id, 6) === nodeId) {
                    node.reversible = !node.reversible
                }
                return node
            })

}

const changeReversibilityInReactions = (generalState, node, changeReversibility, invertDirection) => {
    const reaction = generalState.reactionsInSelectArray.find(
        reaction => reaction.reactionId === getNLastChars(node.id, 6))

    if (changeReversibility) reaction.reversible = !reaction.reversible
    if (invertDirection) reaction.isForwardReaction = !reaction.isForwardReaction

    if (reaction.reversible) {
        if (!(reaction.lowerBound <= 0 && reaction.upperBound >= 0)) {
            reaction.lowerBound = -1000.0
            reaction.upperBound = 1000.0
        }
    } else {
        if (reaction.isForwardReaction) {
            if (!(reaction.lowerBound >= 0 && reaction.upperBound >= 0)) {
                reaction.lowerBound = 0.0
                reaction.upperBound = reaction.upperBound >= 0 ? reaction.upperBound : 1000.0
            }
        } else {
            if (!(reaction.upperBound <= 0 && reaction.upperBound <= 0)) {
                reaction.upperBound = 0.0
                reaction.lowerBound = reaction.lowerBound <= 0 ? reaction.lowerBound : -1000.0
            }
        }
    }
}

export function changeLinkOrientation(
    node, graphState, generalState, changeReversibility, invertDirection){
    /**
     * Handles resetting, addition/deletion of reverse links and inversion of link directions for a specified reaction node
     *
     * @param {object} node - node object of the clicked node
     * @param {object} graphState - graph State store
     * @param {object} generalState - general State store
     * @param {boolean} changeReversibility - if true, non reversible reactions will receive reverse links, reversible reactions are made irreversible
     * @param {boolean} invertDirection - if true, non reversible reactions will receive inverted links
     *
     * @return {{Object},{boolean}} data object for graph, boolean displaying reaction reversibility
     */

    console.log(node)
    // update links depending on node reversibility
    const links = setLinks(graphState.data.links, node, changeReversibility, invertDirection)

    // set reversible prop in node obj
    let nodes
    if (node && changeReversibility) {
        nodes = setNodes(getNLastChars(node.id, 6), graphState)
    } else {
        nodes = graphState.data.nodes
    }

    // set reversible prop in reaction obj
    if (invertDirection || changeReversibility) {
        changeReversibilityInReactions(generalState, node, changeReversibility, invertDirection)
    }

    console.log({nodes, links})

    return {data: {nodes: nodes, links: links}, reversibleState: node.reversible}
}

function createLink(source, target, opacity, reversible) {
    return {
        source: source,
        target: target,
        opacity: opacity,
        isReversibleLink: reversible
    }
}

function getOpacity(substrate, previousAdjacentLinks) {

    let originalLink = previousAdjacentLinks.find(
        link => link.source === substrate || link.target === substrate)

    console.log(originalLink)

    return originalLink ? originalLink.opacity : 1
}

function createReversibleLinks(substrateObjs, productObjs, node, previousAdjacentLinks) {

    const reactionLinks = []

    substrateObjs.forEach(substrate => {
        const opacity = getOpacity(substrate.name, previousAdjacentLinks)
        // forward link
        reactionLinks.push(createLink(substrate.name, node.id, opacity, false))
        // reverse link
        reactionLinks.push(createLink(node.id, substrate.name, opacity, true))
    })

    productObjs.forEach(product => {
        const opacity = getOpacity(product.name, previousAdjacentLinks)
        // forward link
        reactionLinks.push(createLink(node.id, product.name, opacity, false))
        // reverse link
        reactionLinks.push(createLink(product.name, node.id, opacity, true))
    })

    return reactionLinks
}

function createIrreversibleLinks(substrateObjs, productObjs, node, previousAdjacentLinks, isForwardLink) {

    let substrates = substrateObjs
    let products = productObjs
    const reactionLinks = []

    if (!isForwardLink) {
        substrates = productObjs
        products = substrateObjs
    }

    substrates.forEach(substrate => {
        const opacity = getOpacity(substrate.name, previousAdjacentLinks)
        // forward link
        reactionLinks.push(createLink(substrate.name, node.id, opacity, false))
    })

    products.forEach(product => {
        const opacity = getOpacity(product.name, previousAdjacentLinks)
        // forward link
        reactionLinks.push(createLink(node.id, product.name, opacity, false))
    })

    return reactionLinks
}

function setLinks2(links, node, reactionDataObj, nodeReversibility, linkDirection) {

    const substrateObjs = reactionDataObj.substrates
    const productObjs = reactionDataObj.products

    const previousAdjacentLinks = [] // previous Links adjacent to clicked node
    const changedLinks = [] // alternated links

    const newLinks = [] // new links for graph

    for (const link of links) {

        link.strokeWidth = undefined
        link.color = undefined

        if (link.source === node.id || link.target === node.id) {
            previousAdjacentLinks.push(link)
        } else {
            // add non-adjacent links only
            newLinks.push(link)
        }
    }

    // create node adjacent links
    switch (nodeReversibility) {
        case "reversible":
            changedLinks.push(...createReversibleLinks(substrateObjs, productObjs, node, previousAdjacentLinks))
            break;
        case "irreversible":
            let isForwardLink = linkDirection === "forward"
            changedLinks.push(...createIrreversibleLinks(substrateObjs, productObjs, node, previousAdjacentLinks, isForwardLink))
            break;
        default:
            changedLinks.push(...previousAdjacentLinks)
            break;
    }

    newLinks.push(...changedLinks)

    return newLinks
}

const setNodes2 = (nodeId, graphState, makeNodeReversible) => {

    return graphState.data.nodes.map(
        node => {

            if (node.id === nodeId) {
                node.reversible = makeNodeReversible === "reversible"
            }
            return node
        })
}

export function changeLinkOrientation2(node, graphState, generalState, nodeReversibility, linkDirection) {

    console.log( nodeReversibility, linkDirection)

    const reactionObj = generalState.reactionsInSelectArray.find(
        reaction => reaction.reactionId === getNLastChars(node.id, 6))

    const links = setLinks2(graphState.data.links, node, reactionObj , nodeReversibility, linkDirection)

    console.log(links)

    const nodes = setNodes2(node.id, graphState, nodeReversibility)

    reactionObj.reversible = nodeReversibility === "reversible"
    reactionObj.isForwardReaction = linkDirection === "forward"

    console.log(generalState)

    return {nodes: nodes, links: links}
}

import {getNLastChars} from "../../usefulFunctions/Strings";

export function createLink(source, target, opacity, strokeWidth, color, reversible) {
    return {
        source: source,
        target: target,
        opacity: opacity,
        strokeWidth: strokeWidth,
        color: color,
        isReversibleLink: reversible
    }
}

function getOpacity(substrate, previousAdjacentLinks) {

    let originalLink = previousAdjacentLinks.find(
        link => link.source === substrate || link.target === substrate)

    const defaultLinkProps = {opacity: 1, strokeWidth: undefined, color: undefined}

    return originalLink ?
        {opacity: originalLink.opacity, strokeWidth: originalLink.strokeWidth, color: originalLink.color} : defaultLinkProps
}

function createReversibleLinks(substrateObjs, productObjs, node, previousAdjacentLinks) {

    const reactionLinks = []

    substrateObjs.forEach(substrate => {
        const {opacity, strokeWidth, color} = getOpacity(substrate.name, previousAdjacentLinks)
        // forward link
        reactionLinks.push(createLink(substrate.name, node.id, opacity, strokeWidth, color, false))
        // reverse link
        reactionLinks.push(createLink(node.id, substrate.name, opacity, strokeWidth, color, true))
    })

    productObjs.forEach(product => {
        const {opacity, strokeWidth, color} = getOpacity(product.name, previousAdjacentLinks)
        // forward link
        reactionLinks.push(createLink(node.id, product.name, opacity, strokeWidth, color, false))
        // reverse link
        reactionLinks.push(createLink(product.name, node.id, opacity, strokeWidth, color, true))
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
        const {opacity, strokeWidth, color} = getOpacity(substrate.name, previousAdjacentLinks)
        // forward link
        reactionLinks.push(createLink(substrate.name, node.id, opacity, strokeWidth, color, false))
    })

    products.forEach(product => {
        const {opacity, strokeWidth, color} = getOpacity(product.name, previousAdjacentLinks)
        // forward link
        reactionLinks.push(createLink(node.id, product.name, opacity, strokeWidth, color, false))
    })

    return reactionLinks
}

function setLinks(links, node, reactionDataObj, nodeReversibility, linkDirection) {

    const substrateObjs = reactionDataObj.substrates
    const productObjs = reactionDataObj.products
    const resetLinkStyle = true

    const previousAdjacentLinks = [] // previous Links adjacent to clicked node
    const changedLinks = [] // alternated links

    const newLinks = [] // new links for graph

    for (const link of links) {

        if (resetLinkStyle) {
            // get opacity of fwd link, if link opacity is 0
            let opacity
            if (link.opacity == 0) {
                const forwardLink = links.find(
                    searchLink => searchLink.source === link.target && searchLink.target === link.source)
                opacity = forwardLink.opacity
            } else {
                opacity = link.opacity
            }

            link.opacity = opacity
            link.strokeWidth = undefined
            link.color = undefined
        }

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

const setNodes = (nodeId, graphState, makeNodeReversible) => {

    return graphState.data.nodes.map(
        node => {

            if (node.id === nodeId) {
                node.reversible = makeNodeReversible === "reversible"
            }
            return node
        })
}

export function changeLinkOrientation(node, graphState, generalState, nodeReversibility, linkDirection) {

    /**
     * Handles resetting, addition/deletion of reverse links and setting of link directions for a specified reaction node
     *
     * @param {object} node - node object of the clicked node
     * @param {object} graphState - graph State store
     * @param {object} generalState - general State store
     * @param {string} nodeReversibility - "reversible" or "irreversible", sets reversibility of a reaction node
     * @param {string} linkDirection - "forward" or "reverse, sets direction of a reaction nodes
     * @param {boolean} resetLinkStyle - if true, link width and color will be reset to undefined
     *
     * @return {{Object}} data object for graph
     */

    const reactionObj = generalState.reactionsInSelectArray.find(
        reaction => reaction.reactionId === getNLastChars(node.id, 6))

    const links = setLinks(graphState.data.links, node, reactionObj, nodeReversibility, linkDirection)

    let nodes
    if (nodeReversibility) {
        nodes = setNodes(node.id, graphState, nodeReversibility)
        reactionObj.reversible = nodeReversibility === "reversible"
    } else {
        nodes = graphState.data.nodes
    }

    if (linkDirection) {
        reactionObj.isForwardReaction = linkDirection === "forward"
    }

    return {nodes: nodes, links: links}
}
import {getNLastChars} from "../../usefulFunctions/Strings";

const setLinks = (links, node, changeReversibility, invertDirection) => {

    const newLinks = []

    for (const link of links) {

        let forwardLink

        // reset link styles
        link.strokeWidth = undefined
        link.color = undefined

        // add or delete reverse links
        if (changeReversibility) {
            if (node.reversible && !((link.source === node.id || link.target === node.id) && link.isReversibleLink)) {
                // only add links in forward direction, if reversibility is set from true to false
                forwardLink = link
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
                }
                newLinks.push(link)
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

    return newLinks
}

const setNodes = (nodeId, graphState, changeReversibility) => {
    let nodes
    let reversibility

    if (changeReversibility) {
        nodes = graphState.data.nodes.map(
            node => {
                if (getNLastChars(node.id, 6) === nodeId) {
                    node.reversible = !node.reversible
                }
                return node
            })
    } else {
        nodes = [...graphState.data.nodes]
    }

    return nodes
}

const changeReversibilityInReactions = (generalState, node, changeReversibility, invertDirection) => {
    const reaction = generalState.reactionsInSelectArray.find(
        reaction => reaction.reactionId === getNLastChars(node.id, 6))

    if (changeReversibility) reaction.reversible = !reaction.reversible
    if (invertDirection) reaction.isForwardReaction = !reaction.isForwardReaction

    if (reaction.reversible) {
        reaction.lowerBound = reaction.lowerBound < 0 ? reaction.lowerBound : -(reaction.upperBound)
    } else {
        reaction.lowerBound = reaction.lowerBound > 0 ? reaction.lowerBound : 0.0
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


    // update links depending on node reversibility
    const links = setLinks(graphState.data.links, node, changeReversibility, invertDirection)
    console.log(links)

    // set reversible prop in node obj
    console.log(node.id)
    const nodes = setNodes(getNLastChars(node.id, 6), graphState, changeReversibility)

    // set reversible prop in reaction obj
    changeReversibilityInReactions(generalState, node, changeReversibility, invertDirection)

    return {data: {nodes: nodes, links: links}, reversibleState: node.reversible}
}

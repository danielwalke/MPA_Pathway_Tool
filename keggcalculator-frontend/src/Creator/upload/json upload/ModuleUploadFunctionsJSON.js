import {
    COMPOUND_NODE_COLOR,
    COMPOUND_NODE_SYMBOL,
    REACTION_NODE_COLOR,
    REACTION_NODE_SYMBOL
} from "../../graph/Constants";


/**
 * functions for drawing everything in the graph
 * @param reactions
 * @param dispatch
 * @param graphState
 * @returns {{nodes: [], links: []}}
 */
export const handleJSONGraphUpload = (reactions, dispatch, graphState) => { //handle upload of JSON for graph visualisation
    const nodes = []
    const links = []
    dispatch({type:"SET_KEGG_REACTION", payload:[]})
    reactions.forEach(reaction => {
        dispatch({type: "ADD_KEGG_REACTION", payload: reaction})
        const reactionNode = createNode(reaction.reactionName, REACTION_NODE_COLOR, REACTION_NODE_SYMBOL, +reaction.x, +reaction.y, reaction.opacity, reaction.reversible)
        addNode(nodes, reactionNode)
        addReactionAbbreviations(graphState, reaction)
        reaction.substrates.forEach(substrate => addCompoundToData(substrate, reaction, reactionNode, links, nodes, graphState, true))
        reaction.products.forEach(product => addCompoundToData(product, reaction, reactionNode, links, nodes, graphState, false))
        dispatch({type: "SETABBREVIATIONOBJECT", payload: graphState.abbreviationsObject})
        dispatch({type: "SETREACTION", payload: ""})
        dispatch({type: "SETREACTIONS", payload: []})
    })
    return {nodes, links}
}

const nodeInData = (nodes, newNode) => {
    return nodes.some(node => node.id === newNode.id)
}

//checks whether a specific link "newLink" is in the existent links
const linkInData = (links, newLink) => {
    return links.some(link => link.source === newLink.source && link.target === newLink.target)
}

// return a node object
const createNode = (id, color, symbolType, x, y, opacity, reversible) => {
    if (symbolType === "circle") {
        return (
            {
                id: id,
                color: color,
                symbolType: "circle",
                x: x,
                y: y,
                opacity: opacity,
                reversible: reversible,
            }
        )
    } else {
        return (
            {
                id: id,
                color: color,
                x: x,
                y: y,
                opacity: opacity,
                reversible: reversible,
                symbolType: "diamond",
                size: 100,
            })
    }

}

//return a link object
const createLink = (source, target, opacity, isReversibleLink) => {
    return (
        {
            source: source,
            target: target,
            opacity: opacity,
            isReversibleLink: isReversibleLink
        }
    )
}

const addLinks = (reactionNode, links, compoundLink, compoundLinkReversible) => {
    if (reactionNode.reversible && !linkInData(links, compoundLinkReversible)) {
        links.push(compoundLinkReversible)
    }
    if (!linkInData(links, compoundLink)) {
        links.push(compoundLink)
    }
}

const addNode = (nodes, compoundNode) => {
    if (!nodeInData(nodes, compoundNode)) {
        nodes.push(compoundNode)
    }
}

const addCompoundAbbreviations = (graphState, compound) => {
    graphState.abbreviationsObject[`${compound.name}`] = compound.abbreviation
}

const addReactionAbbreviations = (graphState, reaction) => {
    graphState.abbreviationsObject[`${reaction.reactionName}`] = reaction.abbreviation
}

const addCompoundToData = (compound, reaction, reactionNode, links, nodes, graphState, isSubstrate) => {
    const compoundNode = createNode(compound.name, COMPOUND_NODE_COLOR, COMPOUND_NODE_SYMBOL, +compound.x, +compound.y, compound.opacity, reaction.reversible)
    console.log(compoundNode)
    const compoundLink = isSubstrate ? createLink(compound.name, reaction.reactionName, compound.opacity, false) :
        createLink(reaction.reactionName, compound.name, compound.opacity, false)
    const compoundLinkReversible = isSubstrate ? createLink(reaction.reactionName, compound.name, compound.opacity, true) :
        createLink(compound.name, reaction.reactionName, compound.opacity, true)
    addLinks(reactionNode, links, compoundLink, compoundLinkReversible)
    addNode(nodes, compoundNode)
    addCompoundAbbreviations(graphState, compound)
}

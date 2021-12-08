import {
    COMPOUND_NODE_COLOR,
    COMPOUND_NODE_SYMBOL,
    REACTION_NODE_COLOR,
    REACTION_NODE_SYMBOL
} from "../../../Creator/graph/Constants";
import {useSelector} from "react-redux";

/**
 * functions for drawing everything in the graph
 * @param reactions
 * @param dispatch
 * @param graphState
 * @returns {{nodes: [], links: []}}
 */


export const handleJSONGraphUpload = (reactions, dispatch, graphState, generalState) => { //handle upload of JSON for graph visualisation
    var flux = 0.0
    var minFlux = 0.0
    var maxFlux = 0.0
    const nodes = []
    const links = []
    dispatch({type:"SET_KEGG_REACTION", payload:[]})
    reactions.forEach(reaction => {
        //TODO embed this without bug
        for(var key in generalState.fbaSolution){
            if(generalState.fbaSolution.hasOwnProperty(key)){
                if(key == reaction.reactionId){
                    flux = generalState.fbaSolution[key].fbaSolution;
                    minFlux = generalState.fbaSolution[key].minFlux;
                    maxFlux = generalState.fbaSolution[key].maxFlux;

                }
            }
        }
        console.log("This is " + maxFlux)
        dispatch({type: "ADD_KEGG_REACTION", payload: reaction})
        const reactionNode = createNode(reaction.reactionName, REACTION_NODE_COLOR, REACTION_NODE_SYMBOL, +reaction.x, +reaction.y, reaction.opacity, reaction.reversible, flux)
        addNode(nodes, reactionNode)
        addReactionAbbreviations(graphState, reaction)
        reaction.substrates.forEach(substrate => addCompoundToData(substrate, reaction, reactionNode, links, nodes, graphState, true, flux))
        reaction.products.forEach(product => addCompoundToData(product, reaction, reactionNode, links, nodes, graphState, false, flux))
        dispatch({type: "SETABBREVIATIONOBJECT", payload: graphState.abbreviationsObject})
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
const createNode = (id, color, symbolType, x, y, opacity, reversible, flux) => {
    // if(flux<0){
    //     reversible = true;
    // }
    return (
        {
            id: id,
            color: color,
            symbolType: symbolType,
            x: x,
            y: y,
            opacity: 1.0,
            reversible: reversible
        }
    )
}

//return a link object
const createLink = (source, target, opacity, isReversibleLink, flux) => {
    var c = "";
    var d = 0.0;
    var sour = source;
    var tar = target;

    if(flux == 0){
        c = 'grey';
        d = 1;
    }
    else if(flux >=1 & flux <=100 ){
        c = 'red';
        d = 1.5;
    }
    else if(flux>100 & flux<=200){
        c = 'yellow';
        d = 2.0;
    }
    else if(flux>200 & flux<= 500){
        c = 'green';
        d = 2.5;
    }
    else if (flux>500 & flux <=1000){
        c = 'purple';
        d = 3.0;
    }
    else if(flux<0 & flux>=-100){
        c = 'orange';
        d = 3.5;
        sour = target;
        tar = source;

    }
    else if(flux<-100 & flux>=-200){
        c = 'black';
        d = 4.0;
        sour = target;
        tar = source;
    }
    else if(flux<-200 & flux>=-500){
        c = 'cyan';
        d = 4.5;
        sour = target;
        tar = source;
    }
    else if(flux<-500 & flux>=-1000){
        c = 'blue';
        d = 5.0;
        sour = target;
        tar = source;
        //isReversibleLink = true;
        //isReversibleLink = true;
    }

    return (
        {
            color: c,
            source: sour,
            target: tar,
            opacity: 7,
            strokeWidth: d,
            isReversibleLink: isReversibleLink,

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
    graphState.abbreviationsObject[`${reaction.reactionName}`] = reaction.abbreviation;
}

const addCompoundToData = (compound, reaction, reactionNode, links, nodes, graphState, isSubstrate, flux) => {
    const compoundNode = createNode(compound.name, COMPOUND_NODE_COLOR, COMPOUND_NODE_SYMBOL, +compound.x, +compound.y, compound.opacity, reaction.reversible, flux)
    const compoundLink = isSubstrate? createLink(compound.name, reaction.reactionName, compound.opacity, false, flux):
        createLink(reaction.reactionName, compound.name, compound.opacity, false, flux)
    const compoundLinkReversible = isSubstrate? createLink(reaction.reactionName, compound.name, compound.opacity, true, flux):
        createLink(compound.name, reaction.reactionName, compound.opacity, true, flux)
    addLinks(reactionNode, links, compoundLink, compoundLinkReversible)
    addNode(nodes, compoundNode)
    addCompoundAbbreviations(graphState, compound)
}

import {getNodePosition} from "../../../Creator/download/NodePosition";
import clonedeep from "lodash/cloneDeep"
import {getTaxaList} from "../../../Creator/graph/double click node/StuctureModalBody";
import {getNLastChars} from "../../../Creator/usefulFunctions/Strings";
import {reaction} from "mobx";

import {useSelector} from "react-redux";
import React from "react";

export const getReactions = (generalState, graphState) =>{
    const reactionObjects = {}
    const reactionNames = []
    const links = clonedeep(generalState.new_data_gen.links.filter(link => !link.isReversibleLink))
    links.map(link => {
        if (link.source.match(/\s[R,U][0-9][0-9][0-9][0-9][0-9]/) !== null) {
            const reactionName = link.source
            const productName = link.target
            if (!reactionNames.includes(reactionName)) {
                reactionNames.push(reactionName)
            }
            if (typeof reactionObjects[`${reactionName}`] === "undefined") {
                reactionObjects[`${reactionName}`] = {}
                reactionObjects[`${reactionName}`].products = []
                reactionObjects[`${reactionName}`].substrates = []
            }
            const product = {}
            product.x = getNodePosition(productName).x
            product.y = getNodePosition(productName).y
            product.name = productName
            product.opacity = typeof clonedeep(generalState.new_data_gen.nodes).filter(node => node.id === productName)[0].opacity === "undefined"? 1: clonedeep(generalState.new_data_gen.nodes).filter(node => node.id === productName)[0].opacity
            product.abbreviation = typeof clonedeep(graphState.abbreviationsObject[productName]) === "undefined" ? productName : clonedeep(graphState.abbreviationsObject[productName])
            reactionObjects[`${reactionName}`].products.push(product)

        } else {
            const reactionName = link.target
            const substrateName = link.source
            if (!reactionNames.includes(reactionName)) {
                reactionNames.push(reactionName)
            }
            if (typeof reactionObjects[`${reactionName}`] === "undefined") {
                reactionObjects[`${reactionName}`] = {}
                reactionObjects[`${reactionName}`].products = []
                reactionObjects[`${reactionName}`].substrates = []
            }
            const substrate = {}
            substrate.x = getNodePosition(substrateName).x
            substrate.y = getNodePosition(substrateName).y
            substrate.name = substrateName
            substrate.opacity = typeof clonedeep(generalState.new_data_gen.nodes.filter(node => node.id === substrateName)[0].opacity) === "undefined"? 1 : clonedeep(generalState.new_data_gen.nodes.filter(node => node.id === substrateName)[0].opacity)
            substrate.abbreviation = typeof clonedeep(graphState.abbreviationsObject[substrateName]) === "undefined" ? substrateName : clonedeep(graphState.abbreviationsObject[substrateName])
            reactionObjects[`${reactionName}`].substrates.push(substrate)
        }
        return null;
    })
    if(generalState.new_data_gen.links.length === 0){
        graphState.new_data_gen.nodes.map(specialProtein => reactionNames.push(specialProtein.id))
    }
    return {reactionObjects, reactionNames}
}




export const addOutput = (output, reaction, state, flux, minFlux, maxFlux) => {
    const genState = clonedeep(state)
    output = output.concat(reaction.reactionName.replaceAll(";", "\t"), ";") //reaction name
    //const generalState = useSelector(state => state.general)
    let taxonomyCounter = 0









    output = output.concat(minFlux + ';')
    output = output.concat(maxFlux + ';')
    output = output.concat(flux + ';')
    return output;
}

export const addLocationInformation = (output, generalState, reaction, substrate) => {
    const compoundLocation = generalState.cystolInformation.filter(compound =>{
        return  compound.compoundId && compound.compoundId === getNLastChars(substrate.name, 6)
    })
    const exchangeReaction = generalState.exchangeReaction.filter(r => {
        return r.reactionId && r.reactionId === getNLastChars(reaction.reactionName, 6)
    })





    const reactionExchange = `${exchangeReaction.length>0? exchangeReaction[0].exchangeInfo? "true": "false" : "truefalse"};`


    output = output.concat("\n") //next compound

    return output;
}

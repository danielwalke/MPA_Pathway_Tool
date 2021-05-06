import React from "react"
import {useDispatch, useSelector} from "react-redux"
import {getReactions} from "./DownloadFunctions"
import clonedeep from "lodash/cloneDeep";
import {getNodePosition} from "./NodePosition"

const MakeReactionList = (state) => {

    const generalState = state.general
    const graphState = state.graph
    const {reactionObjects, reactionNames} = getReactions(graphState)

    console.log(reactionObjects)
    console.log(reactionNames)
    console.log(graphState)

    const reactionsRaw = reactionNames.map(
        name => generalState.reactionsInSelectArray.filter(
            reaction => reaction.reactionName === name)[0])

    console.log(reactionsRaw)

    reactionsRaw.map(reaction => {
        reaction.abbreviation = typeof graphState.abbreviationsObject[`${reaction.reactionName}`] === "undefined" ? reaction.reactionName : graphState.abbreviationsObject[`${reaction.reactionName}`]
        reaction.opacity = clonedeep(graphState.data.nodes.filter(node => node.id = reaction.reactionName)[0].opacity)
        reaction.reversible = "reversible"
        reaction.x = getNodePosition(reaction.reactionName).x
        reaction.y = getNodePosition(reaction.reactionName).y
        if(graphState.data.links.length===0){
            reaction.substrates=[]
            reaction.products = []
        }else{
            if (reaction.isForwardReaction) {
                reaction.substrates = reactionObjects[`${reaction.reactionName}`].substrates.map(substrate =>{
                    const substrateId = substrate.name.substring(substrate.name.length-6, substrate.name.length)
                    substrate.stochiometry = reaction.stochiometrySubstratesString[`${substrateId}`]
                    return substrate
                })
                reaction.products = reactionObjects[`${reaction.reactionName}`].products.map(product =>{
                    const productId = product.name.substring(product.name.length-6, product.name.length)
                    product.stochiometry = reaction.stochiometryProductsString[`${productId}`]
                    return product
                })
            } else {
                reaction.substrates = reactionObjects[`${reaction.reactionName}`].substrates.map(substrate =>{
                    const substrateId = substrate.name.substring(substrate.name.length-6, substrate.name.length)
                    substrate.stochiometry = reaction.stochiometryProductsString[`${substrateId}`]
                    return substrate
                })
                reaction.products = reactionObjects[`${reaction.reactionName}`].products.map(product =>{
                    const productId = product.name.substring(product.name.length-6, product.name.length)
                    product.stochiometry = reaction.stochiometrySubstratesString[`${productId}`]
                    return product
                })
            }
        }
        // reaction["opacity"] = 1
        // let output = outputCsv.concat("stepId;ReactionNumberId;koNumberIds;ecNumberIds;stochCoeff;compoundId;typeOfCompound;reversibility;taxonomy;reactionX;reactionY;CompoundX;CompoundY;reactionAbbr;compoundAbbr;keyComp", "\n")
        return reaction})

    return reactionsRaw
}

export default MakeReactionList


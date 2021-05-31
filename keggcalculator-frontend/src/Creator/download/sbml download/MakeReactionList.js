import React, {useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {getReactions} from "../DownloadFunctions"
import clonedeep from "lodash/cloneDeep";
import {getNodePosition} from "../NodePosition"

const MakeReactionList = (generalState, graphState) => {

    const abbreviationList = {}
    const compoundList = {}

    const checkForUniqueSpeciesAbbreviations = (abbreviation) => {

        const keggCompound = abbreviation.substring(abbreviation.length - 6)

        if (abbreviationList[abbreviation] === undefined) {
            abbreviationList[abbreviation] = {}
            abbreviationList[abbreviation].count = 1
            if (compoundList[keggCompound] === undefined) {
                abbreviationList[abbreviation].id = keggCompound
                compoundList[keggCompound] = 1
            } else {
                abbreviationList[abbreviation].id = [keggCompound,"_",compoundList[keggCompound]].join("")
                compoundList[keggCompound] += 1
            }
        } else {
            abbreviationList[abbreviation].count += 1
            abbreviationList[abbreviation].id = keggCompound
        }

        return abbreviationList[abbreviation].id
    }

    const {reactionObjects, reactionNames} = getReactions(graphState)

    const reactionsRaw = reactionNames.map(
        name => generalState.reactionsInSelectArray.filter(
            reaction => reaction.reactionName === name)[0])

    const requestList = []

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

                    substrate.id = checkForUniqueSpeciesAbbreviations(substrate.abbreviation)
                    return substrate
                })
                reaction.products = reactionObjects[`${reaction.reactionName}`].products.map(product =>{
                    const productId = product.name.substring(product.name.length-6, product.name.length)
                    product.stochiometry = reaction.stochiometryProductsString[`${productId}`]

                    product.id = checkForUniqueSpeciesAbbreviations(product.abbreviation)
                    return product
                })
            } else {
                reaction.substrates = reactionObjects[`${reaction.reactionName}`].substrates.map(substrate =>{
                    const substrateId = substrate.name.substring(substrate.name.length-6, substrate.name.length)
                    substrate.stochiometry = reaction.stochiometryProductsString[`${substrateId}`]

                    substrate.id = checkForUniqueSpeciesAbbreviations(substrate.abbreviation)
                    return substrate
                })
                reaction.products = reactionObjects[`${reaction.reactionName}`].products.map(product =>{
                    const productId = product.name.substring(product.name.length-6, product.name.length)
                    product.stochiometry = reaction.stochiometrySubstratesString[`${productId}`]

                    product.id = checkForUniqueSpeciesAbbreviations(product.abbreviation)
                    return product
                })
            }
        }

        const requestListObj = {}
        const taxaProp = Object.getOwnPropertyNames(reaction.taxa)[0]

        requestListObj.name = taxaProp
        requestListObj.rank = reaction.taxa[taxaProp]

        requestList.push(requestListObj)

        // reaction["opacity"] = 1
        // let output = outputCsv.concat("stepId;ReactionNumberId;koNumberIds;ecNumberIds;stochCoeff;compoundId;typeOfCompound;reversibility;taxonomy;reactionX;reactionY;CompoundX;CompoundY;reactionAbbr;compoundAbbr;keyComp", "\n")
        return reaction})

    return [reactionsRaw, requestList]
}

export default MakeReactionList


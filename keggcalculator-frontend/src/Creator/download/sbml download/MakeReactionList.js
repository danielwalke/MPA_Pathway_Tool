import React from "react"
import {getReactions} from "../DownloadFunctions"
import clonedeep from "lodash/cloneDeep";
import {getNodePosition} from "../NodePosition"

const MakeReactionList = (generalState, graphState) => {

    const abbreviationList = {}
    const compoundList = {}

    const glyphCompoundList = {}

    const checkForUniqueSpeciesAbbreviations = (abbreviation, compoundId) => {

        const keggCompound = compoundId

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
            // abbreviationList[abbreviation].id = keggCompound
        }

        return abbreviationList[abbreviation].id
    }
    const makeUniqueGlyphId = (abbreviation) => {

        const keggCompound = abbreviation.substring(abbreviation.length - 6)
        let uniqueGlyphId

        if (glyphCompoundList[keggCompound] === undefined) {
            glyphCompoundList[keggCompound] = {}
            glyphCompoundList[keggCompound] = 1
        } else {
            glyphCompoundList[keggCompound] += 1
        }

        uniqueGlyphId = [keggCompound,"_",glyphCompoundList[keggCompound]].join("")

        return uniqueGlyphId
    }

    const {reactionObjects, reactionNames} = getReactions(graphState)
    console.log(generalState.reactionsInSelectArray)
    console.log(clonedeep(reactionObjects))
    const filteredReactions = reactionNames.map(
        name => generalState.reactionsInSelectArray.filter(
            reaction => reaction.reactionName === name)[0])
    console.log(filteredReactions)

    const requestList = []

    const reactionsRaw = filteredReactions.map(reaction => {
        reaction.abbreviation = typeof graphState.abbreviationsObject[`${reaction.reactionName}`] === "undefined" ? reaction.reactionName : graphState.abbreviationsObject[`${reaction.reactionName}`]
        reaction.opacity = clonedeep(graphState.data.nodes.filter(node => node.id = reaction.reactionName)[0].opacity)
        reaction.reversible = reaction.reversible
        reaction.x = getNodePosition(reaction.reactionName).x
        reaction.y = getNodePosition(reaction.reactionName).y

        if(graphState.data.links.length===0){
            reaction.substrates=[]
            reaction.products = []
        }else{
            if (reaction.isForwardReaction) {
                reaction.substrates = reactionObjects[`${reaction.reactionName}`].substrates.map(substrate =>{
                    const substrateId = substrate.name.substring(substrate.name.length-6, substrate.name.length)
                    console.warn(substrateId)
                    substrate.stochiometry = reaction.stochiometrySubstratesString[`${substrateId}`]

                    substrate.id = checkForUniqueSpeciesAbbreviations(substrate.abbreviation, substrateId)
                    substrate.glyphId = makeUniqueGlyphId(substrate.abbreviation)
                    return substrate
                })
                reaction.products = reactionObjects[`${reaction.reactionName}`].products.map(product =>{
                    const productId = product.name.substring(product.name.length-6, product.name.length)
                    product.stochiometry = reaction.stochiometryProductsString[`${productId}`]

                    product.id = checkForUniqueSpeciesAbbreviations(product.abbreviation, productId)
                    product.glyphId = makeUniqueGlyphId(product.abbreviation)
                    return product
                })
            } else {
                reaction.substrates = reactionObjects[`${reaction.reactionName}`].substrates.map(substrate =>{
                    const substrateId = substrate.name.substring(substrate.name.length-6, substrate.name.length)
                    substrate.stochiometry = reaction.stochiometryProductsString[`${substrateId}`]

                    substrate.id = checkForUniqueSpeciesAbbreviations(substrate.abbreviation, substrateId)
                    substrate.glyphId = makeUniqueGlyphId(substrate.abbreviation)
                    return substrate
                })
                reaction.products = reactionObjects[`${reaction.reactionName}`].products.map(product =>{
                    const productId = product.name.substring(product.name.length-6, product.name.length)
                    product.stochiometry = reaction.stochiometrySubstratesString[`${productId}`]

                    product.id = checkForUniqueSpeciesAbbreviations(product.abbreviation, productId)
                    product.glyphId = makeUniqueGlyphId(product.abbreviation)
                    return product
                })
            }
        }

        for(const taxon of Object.entries(reaction.taxa)) {

            const requestListObj = {
                reactionId: reaction.reactionId,
                name: taxon[0],
                rank: taxon[1]
            }
            requestList.push(requestListObj)
        }

        // const taxaProp = Object.getOwnPropertyNames(reaction.taxa)[0]

        // reaction["opacity"] = 1
        // let output = outputCsv.concat("stepId;ReactionNumberId;koNumberIds;ecNumberIds;stochCoeff;compoundId;typeOfCompound;reversibility;taxonomy;reactionX;reactionY;CompoundX;CompoundY;reactionAbbr;compoundAbbr;keyComp", "\n")
        return reaction})

    return [reactionsRaw, requestList]
}

export default MakeReactionList


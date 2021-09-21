import React from "react"
import {getReactions} from "../DownloadFunctions"
import clonedeep from "lodash/cloneDeep";
import {getNodePosition} from "../NodePosition"

const MakeReactionList = (generalState, graphState) => {

    const abbreviationList = {}
    const compoundList = {}

    const checkForUniqueSpeciesAbbreviations = (abbreviation, compoundId) => {

        const keggCompound = compoundId

        if (abbreviationList[abbreviation] === undefined) {
            abbreviationList[abbreviation] = {}
            abbreviationList[abbreviation].count = 1
            if (compoundList[keggCompound] === undefined) {
                abbreviationList[abbreviation].id = keggCompound
                compoundList[keggCompound] = 1
            } else {
                abbreviationList[abbreviation].id = [keggCompound, "_", compoundList[keggCompound]].join("")
                compoundList[keggCompound] += 1
            }
        } else {
            abbreviationList[abbreviation].count += 1
            // abbreviationList[abbreviation].id = keggCompound
        }

        return abbreviationList[abbreviation].id
    }

    const glyphCompoundList = {}

    const makeUniqueGlyphId = (compoundId, x, y, stoichiometry, index) => {

        let glyphId = [compoundId, "_", index].join("")
        let count = parseInt(glyphId.substring(glyphId.length - 1))

        if (glyphCompoundList[glyphId] === undefined
        ) {
            glyphCompoundList[glyphId] = {x: x, y: y, stoichiometry: stoichiometry}
            return glyphId
        } else if (glyphCompoundList[glyphId].x === x &&
            glyphCompoundList[glyphId].y === y &&
            glyphCompoundList[glyphId].stoichiometry === stoichiometry
        ) {
            return glyphId
        } else {
            // start next recursion
            let newGlyph = glyphId.substring(0, glyphId.length - 2)
            return makeUniqueGlyphId(newGlyph, x, y, stoichiometry, count + 1)
        }
    }

    const {reactionObjects, reactionNames} = getReactions(graphState)
    const filteredReactions = reactionNames.map(
        name => generalState.reactionsInSelectArray.filter(
            reaction => reaction.reactionName === name)[0])

    const requestList = []

    const reactionsRaw = filteredReactions.map(reaction => {
        reaction.abbreviation = typeof graphState.abbreviationsObject[`${reaction.reactionName}`] === "undefined" ? reaction.reactionName : graphState.abbreviationsObject[`${reaction.reactionName}`]
        reaction.opacity = clonedeep(graphState.data.nodes.filter(node => node.id = reaction.reactionName)[0].opacity)
        reaction.reversible = reaction.reversible
        reaction.x = getNodePosition(reaction.reactionName).x
        reaction.y = getNodePosition(reaction.reactionName).y

        if (graphState.data.links.length === 0) {
            reaction.substrates = []
            reaction.products = []
        } else {
            if (reaction.isForwardReaction) {
                reaction.substrates = reactionObjects[`${reaction.reactionName}`].substrates.map(substrate => {
                    const substrateId = substrate.name.substring(substrate.name.length - 6, substrate.name.length)
                    console.warn(substrateId)
                    substrate.stochiometry = reaction.stochiometrySubstratesString[`${substrateId}`]

                    substrate.id = checkForUniqueSpeciesAbbreviations(substrate.abbreviation, substrateId)
                    substrate.glyphId = makeUniqueGlyphId(substrateId, substrate.x, substrate.y, substrate.stochiometry, 0)
                    return substrate
                })
                reaction.products = reactionObjects[`${reaction.reactionName}`].products.map(product => {
                    const productId = product.name.substring(product.name.length - 6, product.name.length)
                    product.stochiometry = reaction.stochiometryProductsString[`${productId}`]

                    product.id = checkForUniqueSpeciesAbbreviations(product.abbreviation, productId)
                    product.glyphId = makeUniqueGlyphId(productId, product.x, product.y, product.stochiometry, 0)
                    return product
                })
            } else {
                reaction.substrates = reactionObjects[`${reaction.reactionName}`].substrates.map(substrate => {
                    const substrateId = substrate.name.substring(substrate.name.length - 6, substrate.name.length)
                    substrate.stochiometry = reaction.stochiometryProductsString[`${substrateId}`]

                    substrate.id = checkForUniqueSpeciesAbbreviations(substrate.abbreviation, substrateId)
                    substrate.glyphId = makeUniqueGlyphId(substrateId, substrate.x, substrate.y, substrate.stochiometry, 0)
                    return substrate
                })
                reaction.products = reactionObjects[`${reaction.reactionName}`].products.map(product => {
                    const productId = product.name.substring(product.name.length - 6, product.name.length)
                    product.stochiometry = reaction.stochiometrySubstratesString[`${productId}`]

                    product.id = checkForUniqueSpeciesAbbreviations(product.abbreviation, productId)
                    product.glyphId = makeUniqueGlyphId(productId, product.x, product.y, product.stochiometry, 0)
                    return product
                })
            }
        }

        for (const taxon of Object.entries(reaction.taxa)) {

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
        return reaction
    })

    return [reactionsRaw, requestList]
}

export default MakeReactionList


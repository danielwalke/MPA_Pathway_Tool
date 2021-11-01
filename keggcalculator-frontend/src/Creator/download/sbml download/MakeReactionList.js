import React from "react"

const getKeggId = comp => comp.name.substring(comp.name.length - 6, comp.name.length)

const makeUniqueSpeciesId = (abbreviation, compoundId, abbreviationList, compoundList) => {
    /**
     * Goes through abbreviations and checks if a compound object has an already known kegg compound id (these will be
     * used as sbml compound ids).
     * If compounds with the same kegg id have different abbreviations, they will receive differen sbml ids
     */

    // Is abbreviation unknown?
    if (!abbreviationList[abbreviation]) {
        abbreviationList[abbreviation] = {}
        abbreviationList[abbreviation].count = 1
        // compound unknown?
        if (!compoundList[compoundId]) {
            // unkown: create new sbml id
            abbreviationList[abbreviation].id = compoundId
            compoundList[compoundId] = 1
        } else {
            // known, but diff abbreviation: create new sbml id with index
            abbreviationList[abbreviation].id = [compoundId, "_", compoundList[compoundId]].join("")
            compoundList[compoundId] += 1
        }
    } else {
        // do nothing
        abbreviationList[abbreviation].count += 1
        // abbreviationList[abbreviation].id = keggCompound
    }

    return abbreviationList[abbreviation].id
}

const makeUniqueGlyphId = (compoundId, x, y, stoichiometry, index, speciesGlyphList) => {
    /**
     * recursively creates unique compound glyph ids
     */

        // create glyph id
    let glyphId = [compoundId, "_", index].join("")
    // get current index value
    let count = parseInt(glyphId.split("_")[1])

    // if glyph id is new, create entry
    if (!speciesGlyphList[glyphId]) {
        speciesGlyphList[glyphId] = {x: x, y: y, stoichiometry: stoichiometry}
        return glyphId
        // if glyph id is present and all properties are equal, don't create new glyph id
    } else if (speciesGlyphList[glyphId].x === x &&
        speciesGlyphList[glyphId].y === y &&
        speciesGlyphList[glyphId].stoichiometry === stoichiometry
    ) {
        return glyphId
        // if glyph id is used and properties are different start another recursion until a unique id is created
    } else {
        // start next recursion
        return makeUniqueGlyphId(compoundId, x, y, stoichiometry, count + 1, speciesGlyphList)
    }
}

const MakeReactionList = (reactionsInSelectArray, reactionTaxonomies) => {
    /**
     * Updates substrate and product objects with unique glyph and unique sbml ids
     */

    const speciesGlyphList = {}

    const abbreviationList = {}
    const compoundList = {}

    const updateCompoundObj = (compounds) => {
        compounds.map(compound => {
            compound.glyphId = makeUniqueGlyphId(
                getKeggId(compound), compound.x, compound.y, compound.stoichiometry, 1, speciesGlyphList)
            compound.sbmlId = makeUniqueSpeciesId(
                compound.abbreviation, getKeggId(compound), abbreviationList, compoundList)
        })
    }

    const reactionList = reactionsInSelectArray.map(reaction => {
        reaction.taxonomyIds = reactionTaxonomies.filter(tax => tax.reactionId === reaction.reactionId)

        updateCompoundObj(reaction.substrates)
        updateCompoundObj(reaction.products)

        return reaction
    })

    return reactionList
}

export default MakeReactionList


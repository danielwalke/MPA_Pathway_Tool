import React from "react"

const getKeggId = comp => comp.name.substring(comp.name.length - 6, comp.name.length)

const MakeSpeciesList = (reactionsInSelectArray) => {
    /**
     * Takes an Array of reaction objects, extracts information on reaction substrates/products and corresponding graph
     * positions and returns an array with unique entries for each component.
     * @reactionArrayProcessed {Array of Objects} - entries correspond to reaction objects, must contain substrates/products
     * objects with necessary abbreviation, x and y props
     * */

    let compounds = []

    let speciesObjArray = []
    let compartmentObjArray = []

    for (const reaction of reactionsInSelectArray) {
        compounds.push(...reaction.products)
        compounds.push(...reaction.substrates)
    }

    // discard duplicate compounds
    const uniqueCompoundsStrArray = Array.from(new Set(compounds.map(item => JSON.stringify(item))))
    const uniqueCompoundsArray = uniqueCompoundsStrArray.map(item => JSON.parse(item))

    for (const compound of uniqueCompoundsArray) {

        const compoundObj = {
            name: compound.abbreviation,
            keggId: getKeggId(compound),
            biggId: compound.biggId ? compound.biggId : "",
            glyphId: compound.glyphId,
            sbmlId: compound.sbmlId,
            compartment: "c",
            compartmentName: "cytosol",    // TODO: take this from compound in general state
            hasOnlySubstanceUnits: "true",
            boundaryCondition: "false",
            constant: "false",
            x: compound.x,
            y: compound.y,
            opacity: compound.opacity
            // maybe addition of sboTerm
        }
        speciesObjArray.push(compoundObj)

        const compartmentObj = {
            compartment: "c",
            compartmentName: "cytosol",
            constant: "true"
        }

        compartmentObjArray.push(compartmentObj)
    }

    const uniqueCompartmentsStrArray = Array.from(new Set(compartmentObjArray.map(item => JSON.stringify(item))))
    const uniqueCompartmentsArray = uniqueCompartmentsStrArray.map(item => JSON.parse(item))

    return [speciesObjArray, uniqueCompartmentsArray]
}

export default MakeSpeciesList

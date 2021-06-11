import React from "react"

const getKeggId = comp => comp.name.substring(comp.name.length-6, comp.name.length)


const MakeSpeciesList = (reactionArrayProcessed) => {
    /**
     * Takes an Array of reaction objects, extracts information on reaction substrates/products and corresponding graph
     * positions and returns an array with unique entries for each component.
     * @reactionArrayProcessed {Array of Objects} - entries correspond to reaction objects, must contain substrates/products
     * objects with necessary abbreviation, x and y props
     * */

    let compounds = []

    let speciesPosArray = []
    let speciesArray = []
    let compartmentArray = []

    for(const rxn of reactionArrayProcessed) {
        compounds.push(...rxn.products)
        compounds.push(...rxn.substrates)
    }
    for (const comp of compounds) {

        const compoundsForSpeciesArray = {
            name: comp.abbreviation,
            keggId: getKeggId(comp),
            id: comp.id,
            compartment: "c",
            compartmentName: "cytosol",    //extend functionality for multiple compartments
            hasOnlySubstanceUnits: "true",
            boundaryCondition: "false",
            constant: "false",
            // maybe addition of sboTerm
        }
        speciesArray.push(compoundsForSpeciesArray)

        const compoundPositions = {
            glyphId: comp.glyphId,
            id: comp.id,
            compartment: "c",
            compartmentName: "cytosol",
            x: comp.x,
            y: comp.y,
            opacity: comp.opacity
        }
        speciesPosArray.push(compoundPositions)

        const compartments = {
            compartment: "c",
            compartmentName: "cytosol",
            constant: "true"
        }
        compartmentArray.push(compartments)
    }

    const uniqueSpeciesArrayStr = Array.from(new Set(speciesArray.map(item => JSON.stringify(item))))
    const uniqueSpeciesArray = uniqueSpeciesArrayStr.map(item => JSON.parse(item))

    const uniqueSpeciesPosArrayStr = Array.from(new Set(speciesPosArray.map(item => JSON.stringify(item))))
    const uniqueSpeciesPosArray = uniqueSpeciesPosArrayStr.map(item => JSON.parse(item))

    const uniqueCompartmentsArrayStr = Array.from(new Set(compartmentArray.map(item => JSON.stringify(item))))
    const uniqueCompartmentsArray = uniqueCompartmentsArrayStr.map(item => JSON.parse(item))

    return [uniqueSpeciesArray, uniqueSpeciesPosArray, uniqueCompartmentsArray]
}

export default MakeSpeciesList
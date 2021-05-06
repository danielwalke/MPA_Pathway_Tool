import React from "react"

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

        compounds.map(
            item => {
                const compoundsForSpeciesArray = {
                    name: item.abbreviation,
                    compartment: "c",
                    compartmentName: "cytosol",    //extend functionality for multiple compartments
                    hasOnlySubstanceUnits: "true", //might be changed by User
                    boundaryCondition: "false",    //might be changed by User
                    constant: "false"              //might be changed by User
                    // maybe addition of sboTerm
                }
                speciesArray.push(compoundsForSpeciesArray)

                const compoundPositions = {
                    name: item.abbreviation,
                    compartment: "c",
                    compartmentName: "cytosol",
                    x: item.x,
                    y: item.y
                }
                speciesPosArray.push(compoundPositions)

                const compartments = {
                    compartment: "c",
                    compartmentName: "cytosol",
                    constant: "true"
                }
                compartmentArray.push(compartments)
            })

    const uniqueSpeciesArrayStr = Array.from(new Set(speciesArray.map(item => JSON.stringify(item))))
    const uniqueSpeciesArray = uniqueSpeciesArrayStr.map(item => JSON.parse(item))

    const uniqueSpeciesPosArrayStr = Array.from(new Set(speciesPosArray.map(item => JSON.stringify(item))))
    const uniqueSpeciesPosArray = uniqueSpeciesPosArrayStr.map(item => JSON.parse(item))

    const uniqueCompartmentsArrayStr = Array.from(new Set(compartmentArray.map(item => JSON.stringify(item))))
    const uniqueCompartmentsArray = uniqueCompartmentsArrayStr.map(item => JSON.parse(item))

    return [uniqueSpeciesArray, uniqueSpeciesPosArray, uniqueCompartmentsArray]
}

export default MakeSpeciesList
import React from "react"

const MakeSpeciesList = (reactionArrayProcessed) => {
    /**
     * Takes an Array of reaction objects, extracts information on reaction substrates/products and corresponding graph
     * positions and returns an array with unique entries for each component.
     * @reactionArrayProcessed {Array of Objects} - entries correspond to reaction objects, must contain substrates/products
     * objects with necessary abbreviation, x and y props
     * */

    let speciesArray = []
    for(const rxn of reactionArrayProcessed) {
        const prods = rxn.products.map(
            item => {
                return {
                    name: item.abbreviation,
                    x: item.x,
                    y: item.y
                }
            })
        speciesArray.push(...prods)
        const subs = rxn.substrates.map(
            item => {
                return {
                    name: item.abbreviation,
                    x: item.x,
                    y: item.y
                }
            })
        speciesArray.push(...subs)
    }

    return Array.from(new Set(speciesArray))
}

export default MakeSpeciesList
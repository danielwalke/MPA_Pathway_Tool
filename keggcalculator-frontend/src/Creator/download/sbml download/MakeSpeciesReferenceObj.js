import React from "react";

const MakeSpeciesReferenceObj = (reactant) => {

    /**
     *      Input: <ReactionObject>.products / <ReactionObject>.substrates
     *      extracts species, stoichiometry and constant parameters from the Input and returns an object that can be fed into
     *      the SBML object tree
     *      example:
     *      listOfReactants: {'#':makeSpeciesReferenceObj(item.substrates)}
     *  */

    const reference = reactant.map(comps => {
        const ref = {
            '@': {
                species: comps.id,
                name: comps.abbreviation.substring(0, comps.abbreviation.length - 7),
                stoichiometry: comps.stochiometry,
                constant: "true"
            }
        }
        return ref
    })

    return {'speciesReference': reference}
}

export default MakeSpeciesReferenceObj

import {getKeggId} from "./CreateFbaGraphData";

const writeMetabolitesToReaction = (compounds, listOfMetabolites, reactionMetabolites, stoichiometrySign) => {
    /**
     * Pushes metabolites of every reaction into list of Metabolites and writes metabolite object for reaction request
     * object.
     *
     * @param compounds - substrates/products Array from reaction object of reactionsInSelectArray
     * @param listOfMetabolites - list of all metabolites for request object
     * @param reactionMetabolites - list of metabolites involved in a reaction for request reaction object
     * @param stoichiometrySign - sign for stoichiometric coefficients; -1 for substrates, 1 for products
     */
    try {
        let sign
        if (typeof stoichiometrySign === "number") {
            sign = stoichiometrySign
        } else {
            throw "Stoichiometry sign should be -1 or +1."
        }

        for (const compound of compounds) {

            listOfMetabolites.push({
                metaboliteId: getKeggId(compound.name),
                metaboliteName: compound.name,
                compartment: compound.compartment ? compound.compartment : 'cytosol'
            })

            reactionMetabolites.push({
                metaboliteId: getKeggId(compound.name),
                stoichiometry: compound.stoichiometry ?
                    sign * parseFloat(compound.stoichiometry) : compound.stochiometry ?
                        sign * parseFloat(compound.stochiometry) : sign
            })
        }

    } catch (e) {
        console.error(e)
    }

}

export function parseRequestArray(reactionsInSelectArray) {

    const listOfReactions = []
    const listOfMetabolites = []

    reactionsInSelectArray.forEach(reaction => {
        const metabolites = []

        writeMetabolitesToReaction(reaction.substrates, listOfMetabolites, metabolites, -1)
        writeMetabolitesToReaction(reaction.products, listOfMetabolites, metabolites, +1)

        listOfReactions.push({
            reactionId: reaction.reactionId,
            reactionName: reaction.reactionName,
            lowerBound: typeof reaction.lowerBound === 'string' ? parseFloat(reaction.lowerBound) : reaction.lowerBound,
            upperBound: typeof reaction.upperBound === 'string' ? parseFloat(reaction.upperBound) : reaction.upperBound,
            objectiveCoefficient: reaction.objectiveCoefficient,
            exchangeReaction: reaction.exchangeReaction ? reaction.exchangeReaction : false,
            metabolites: metabolites
        })
    })

    const stringListOfMetabolites = Array.from(new Set (listOfMetabolites.map(
        item => JSON.stringify(item))))
    const uniqueListOfMetabolites = stringListOfMetabolites.map(item => JSON.parse(item))

    return {reactions: listOfReactions, metabolites: uniqueListOfMetabolites};
}

export function parseDummyRequestArray(reactionsInSelectArray) {

    const requestObj = {
        "FBAObj": {
            "reactionList":[]
        }
    }

    reactionsInSelectArray.forEach(reaction => {
        requestObj.FBAObj.reactionList.push({"reactionId": reaction.reactionId})
    })

    return requestObj;
}

export function responseToMap(responseArray) {
    const fbaDataMap = new Map()

    responseArray.forEach(reaction => {
        fbaDataMap.set(Object.keys(reaction)[0], Object.values(reaction)[0])
    })

    return fbaDataMap
}

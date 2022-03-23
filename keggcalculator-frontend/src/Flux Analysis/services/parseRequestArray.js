import {getKeggId} from "./createFbaGraphData";

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

            const compartment = compound.compartment ? compound.compartment : 'cytosol'
            // const compartment = !compound.compartment ? 'c' :
            //     compound.compartment === 'cytosol' ? 'c' : 'e'
            const id = `${getKeggId(compound.name)}_${compartment}`
            // const id = `${compound.biggId}_${compartment}`

            listOfMetabolites.push({
                metaboliteId: id,
                metaboliteName: compound.name,
                compartment: compartment,
                biggId: compound.biggId
            })

            reactionMetabolites.push({
                metaboliteId: id,
                stoichiometry: compound.stoichiometry ?
                    sign * parseFloat(compound.stoichiometry) : compound.stochiometry ?
                        sign * parseFloat(compound.stochiometry) : sign
            })
        }

    } catch (e) {
        console.error(e)
    }

}

export function parseRequestArray(reactionsInSelectArray, listOfGeneProducts, dispatch) {

    const listOfReactions = []
    const listOfMetabolites = []
    let hasExchangeReaction = false
    let hasObjective = false

    reactionsInSelectArray.forEach(reaction => {
        const metabolites = []

        for (const metabolite of [...reaction.substrates, ...reaction.products]) {
        }

        writeMetabolitesToReaction(reaction.substrates, listOfMetabolites, metabolites, -1)
        writeMetabolitesToReaction(reaction.products, listOfMetabolites, metabolites, +1)

        if (reaction.exchangeReaction) {
            hasExchangeReaction = true
        }

        if (reaction.objectiveCoefficient !== 0) {
            hasObjective = true
        }

        listOfReactions.push({
            reactionId: reaction.reactionId,
            // reactionId: reaction.biggId,
            reactionName: reaction.reactionName,
            lowerBound: typeof reaction.lowerBound === 'string' ? parseFloat(reaction.lowerBound) : reaction.lowerBound,
            upperBound: typeof reaction.upperBound === 'string' ? parseFloat(reaction.upperBound) : reaction.upperBound,
            objectiveCoefficient: reaction.objectiveCoefficient,
            exchangeReaction: reaction.exchangeReaction ? reaction.exchangeReaction : false,
            metabolites: metabolites,
            biggId: reaction.biggId,
            keggOrthologies: reaction.koNumbersString,
            ecNumbers: reaction.ecNumbersString,
            geneRule: reaction.geneRule ? reaction.geneRule : []
        })
    })

    if (!hasExchangeReaction) {
        dispatch({type: "SET_STATUS", payload: {alert: true, message:
                "Your network has no exchange reactions. Please add an exchange reaction for every metabolite that should " +
                    "be exchanged with the network."
            }})
        return
    }

    if (!hasObjective) {
        dispatch({type: "SET_STATUS", payload: {alert: true, message:
                    "Your network contains no reaction to be minimized or maximized. Please set an objective Coefficient."
            }})
        return
    }

    const stringListOfMetabolites = Array.from(new Set (listOfMetabolites.map(
        item => JSON.stringify(item))))
    const uniqueListOfMetabolites = stringListOfMetabolites.map(item => JSON.parse(item))

    return {reactions: listOfReactions, metabolites: uniqueListOfMetabolites, geneProducts: listOfGeneProducts};
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

export function responseToMap(responseObject) {

    const origModelFbaData = new Map()
    let sMomentFBAData

    responseObject.original.forEach(reaction => {
        origModelFbaData.set(Object.keys(reaction)[0], Object.values(reaction)[0])
    })

    console.log(responseObject.sMOMENT)

    if (responseObject.sMOMENT.length !== 0) {
        sMomentFBAData = new Map()
        responseObject.sMOMENT.forEach(reaction => {
            sMomentFBAData.set(Object.keys(reaction)[0], Object.values(reaction)[0])
        })
    }

    return {origModelFbaData: origModelFbaData, sMomentFBAData: sMomentFBAData}
}

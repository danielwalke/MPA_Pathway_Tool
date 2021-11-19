import {getKeggId} from "./CreateFbaGraphData";

export function parseRequestArray(reactionsInSelectArray) {

    const listOfReactions = []
    const listOfMetabolites = []

    reactionsInSelectArray.forEach(reaction => {
        const metabolites = []

        for (const component of [...reaction.substrates, ...reaction.products]) {

            listOfMetabolites.push({
                metaboliteId: getKeggId(component.name),
                metaboliteName: component.name,
                compartment: component.compartment ? component.compartment : 'cytosol'
            })

            metabolites.push({
                metaboliteId: getKeggId(component.name),
                stoichiometry: component.stoichiometry ?
                    parseFloat(component.stoichiometry) : component.stochiometry ?
                        parseFloat(component.stochiometry) : 1.0
            })
        }

        listOfReactions.push({
            reactionId: reaction.reactionId,
            reactionName: reaction.reactionName,
            lowerBound: reaction.lowerBound,
            upperBound: reaction.upperBound,
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

/*
this component is responsible for adding all reaction from the sbml file to the redux-store in the state general to reactionsInSelectArray
reactionInSelectArray: [
ecNumbersString:[],
koNumbersString:[],
reactionId:"",
reactionName:"sbmlId;sbmlName KeggId",
stochiometrySubstratesString: {CXXXXX: number,compoundId: number
},
stochiometryProductsString::{CXXXXX: number,compoundId: number
}
]
 */

export const setReactionsInStore = (state, listOfReactions) => {
    const reactions = listOfReactions.map(reaction => {
        const reactionId = reaction.keggId;
        const reactionName = reaction.sbmlId.concat(";" + reaction.sbmlName + " " + reaction.keggId);
        const ecNumbersString = reaction.ecNumbers;
        const koNumbersString = reaction.koNumbers;
        const stochiometrySubstratesString = new Map()
        reaction.substrates.forEach(substrate => {
            stochiometrySubstratesString[`${substrate.keggId}`] = substrate.stoichiometry;
            // stochiometrySubstratesString.set(substrate.keggId, substrate.stoichiometry)
        })
        const stochiometryProductsString = new Map()
        reaction.products.forEach(product => {
            stochiometryProductsString[`${product.keggId}`] = product.stoichiometry;
            // stochiometryProductsString.set(product.keggId, product.stoichiometry)
        })
        return (
            {
                reactionId: reactionId,
                reactionName: reactionName,
                ecNumbersString: ecNumbersString,
                koNumbersString: koNumbersString,
                stochiometrySubstratesString: stochiometrySubstratesString,
                stochiometryProductsString: stochiometryProductsString,
                taxa: reaction.taxonomy,
                isForwardReaction: true
            }
        )

    })
    return reactions
}

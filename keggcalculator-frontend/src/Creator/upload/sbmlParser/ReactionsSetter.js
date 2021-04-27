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

export const setReactionsInStore = (state, listOfReactions) =>{
    const reactions = listOfReactions.map(reaction =>{
        const reactionId = reaction.keggId;
        const reactionName = reaction.sbmlId.concat(";" + reaction.sbmlName + " " + reaction.keggId);
        const ecNumbersString = reaction.ecNumbers;
        const koNumbersString= reaction.koNumbers;
        const stochiometrySubstratesString = {}
        reaction.substrates.map(substrate =>{
            stochiometrySubstratesString[`${substrate.keggId}`] = substrate.stoichiometry;
            return null;
        })
        const stochiometryProductsString = {}
        reaction.products.map(product => {
            stochiometryProductsString[`${product.keggId}`] = product.stoichiometry;
            return null;
        })
        return(
            {
                reactionId: reactionId,
                reactionName: reactionName,
                ecNumbersString: ecNumbersString,
                koNumbersString: koNumbersString,
                stochiometrySubstratesString: stochiometrySubstratesString,
                stochiometryProductsString: stochiometryProductsString,
                taxa:{}
            }
        )

    })
    console.log(reactions); //check whether everything is fine here
    return reactions
}
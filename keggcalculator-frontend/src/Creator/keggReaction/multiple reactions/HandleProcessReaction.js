import {getNLastChars} from "../../usefulFunctions/Strings";
/*
abbreviation: "polyphosphate polyphosphohydrolase; Polyphosphate + n H2O <=> (n+1) Oligophosphate R00001 "
ecNumbersString: ['3.6.1.10']
isForwardReaction: true
koNumbersString: []
opacity: 1
products: [{…}]
reactionId: "R00001"
reactionName: "polyphosphate polyphosphohydrolase; Polyphosphate + n H2O <=> (n+1) Oligophosphate R00001 R00001"
reversible: false
stochiometryProductsString: {C02174: '(n+1)'}
stochiometrySubstratesString: {C00001: 'n', C00404: '1'}
substrates: (2) [{…}, {…}]
taxa: {}
taxonomies: []
x: 0
y: 0
 */
export const handleProcessReaction = (reaction, generalState) =>{
    reaction.reactionName = reaction.reactionName.concat(" " + reaction.reactionId)
    reaction.substrates = []
    reaction.products = []
    reaction.reversible = false
    for(const comp of Object.keys(reaction.stochiometrySubstratesString)){
        const compoundName = generalState.compoundId2Name[comp]
        const coeff= reaction.stochiometrySubstratesString[comp]
        const compoundObject = {
            abbreviation: compoundName,
            name: compoundName,
            opacity: 1,
            stochiometry: coeff,
            x: 0,
            y: 0,
        }
        reaction.substrates.push(compoundObject)
    }

    for(const comp of Object.keys(reaction.stochiometryProductsString)){
        const compoundName = generalState.compoundId2Name[comp]
        const coeff= reaction.stochiometrySubstratesString[comp]
        const compoundObject = {
            abbreviation: compoundName,
            name: compoundName,
            opacity: 1,
            stochiometry: coeff,
            x: 0,
            y: 0,
        }
        reaction.products.push(compoundObject)
    }
}

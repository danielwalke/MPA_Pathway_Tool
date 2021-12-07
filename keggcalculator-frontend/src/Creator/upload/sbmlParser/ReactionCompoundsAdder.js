/*
this component is responsible for adding information of individual species from speciesList to substrates and products in each reaction of ListOfReaction
listOfReactions:
listOfReactions: [
{sbmlId:"", sbmlName:"", keggId:"R/UXXXXX", ecNumbers:[}, koNumbers:[], substrates: [
{sbmlId:"", stoichiometry:"",sbmlName:"", keggId:"", keggName:""}], products:[{sbmlId:"", stoichiometry:"",sbmlName:"", keggId:"", keggName:""}
]}]
listOfSpecies:
listOfSpecies: [
{sbmlId: "", sbmlName:"", keggId:"", keggName:""}]
 */

export const addCompoundsToReactions = (state, listOfReactions, listOfSpecies) => {
    const newListOfReactions = listOfReactions.map(reaction => {
        //override substartes and products with additional information

        reaction.substrates.map(substrate => {
            const species = listOfSpecies.filter(speciesReference => speciesReference.sbmlId === substrate.sbmlId)[0] //filters all species information from listOfSpecies
            substrate.sbmlName = species.sbmlName;
            substrate.keggId = species.keggId;
            substrate.keggName = species.keggName;
            substrate.biggId = species.biggId;
            substrate.compartment = species.compartment;
            return substrate;
        })
        reaction.products.map(product => {
            const species = listOfSpecies.filter(speciesReference => speciesReference.sbmlId === product.sbmlId)[0] //filters all species information from listOfSpecies
            product.sbmlName = species.sbmlName;
            product.keggId = species.keggId;
            product.keggName = species.keggName;
            product.biggId = species.biggId;
            product.compartment = species.compartment;
            return product;
        })
        return reaction;
    })
    return newListOfReactions
}

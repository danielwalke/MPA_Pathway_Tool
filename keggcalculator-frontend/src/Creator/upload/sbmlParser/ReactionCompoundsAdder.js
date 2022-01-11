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

function updateCompoundObjects(compoundObjects, listOfSpecies, annotateSbml) {
    return compoundObjects.map(compound => {
        let species
        if (annotateSbml) {
            species = listOfSpecies.find(speciesReference => speciesReference.sbmlId === compound.sbmlId) //filters all species information from listOfSpecies
        } else {
            species = listOfSpecies.find(speciesReference => speciesReference.sbmlName === compound.name)
        }

        compound.sbmlName = species.sbmlName;
        compound.keggId = species.keggId;
        compound.keggName = species.keggName;
        compound.biggId = species.biggId;
        compound.compartment = species.compartment;
        return compound;
    })
}

export const addCompoundsToReactions = (state, listOfReactions, listOfSpecies) => {
    return listOfReactions.map(reaction => {
        //override substartes and products with altered information

        reaction.substrates = updateCompoundObjects(reaction.substrates, listOfSpecies, state.general.annotateSbml)
        reaction.products = updateCompoundObjects(reaction.products, listOfSpecies, state.general.annotateSbml)

        return reaction
    })
}

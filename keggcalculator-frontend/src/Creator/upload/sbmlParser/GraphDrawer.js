/*
this component is responsible for drawing all components from all read/annotated sbml reactions/compounds into the Graph (adding them to the redux-store graph -> data)
data:{
nodes:[{id:"", color,:"", symbolType:"", opacity:1}], links:[{
source:"", target:"", opacity:1}]}
 */

//checks whether a specific node "newNode" is in the existent nodes
import {handleJSONGraphUpload} from "../json upload/ModuleUploadFunctionsJSON";
import {Reaction} from "../model/Reaction";
import {Compound} from "../model/Compound";

export const setReactionsAndCompoundsInStore = (state, listOfReactions, dispatch) => {
    const reactions = listOfReactions.map(reaction => {
        const reactionId = reaction.sbmlId.concat(";" + reaction.sbmlName + " " + reaction.keggId); //retruns name like "R_PFK;Phosphofructokinase UXXXXX"
        const r = new Reaction(reactionId)
        r._x = 0
        r._y = 0
        r._opacity = 1
        r._reversible = reaction.reversible
        reaction.substrates.forEach(substrate => {
            const compound = getSbmlCompound(substrate, "substrate")
            r.addSubstrate(compound)
        })
        reaction.products.forEach(product => {
            const compound = getSbmlCompound(product, "product")
            r.addProduct(compound)
        })
        return r
    })
    return handleJSONGraphUpload(reactions, dispatch, state.graph)
}

const getSbmlCompound = (sbmlCompound, typeOfCompound) => {
    const productId = sbmlCompound.sbmlId.concat(";" + sbmlCompound.sbmlName + " " + sbmlCompound.keggId); //retruns name like "M_pep_c;Phosphoenolpyruvate K/G/CXXXXX"
    const compound = new Compound(productId)
    compound._x = 0
    compound._y = 0
    compound._abbreviation = productId
    compound._typeOfCompound = typeOfCompound
    compound._opacity = 1
    return compound
}
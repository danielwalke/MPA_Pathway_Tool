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

export const setReactionsAndCompoundsInStore = (state, listOfReactions, dispatch, listOfReactionGlyphs) => {
    const reactions = listOfReactions.map(reaction => {
        const reactionId = reaction.sbmlId.concat(";" + reaction.sbmlName + " " + reaction.keggId); //retruns name like "R_PFK;Phosphofructokinase UXXXXX"
        const r = new Reaction(reactionId)
        // console.log(listOfReactionGlyphs)
        // const reactionGlyphs = typeof listOfReactionGlyphs === "undefined" ? state.general.listOfReactionGlyphs : listOfReactionGlyphs
        // console.log(reactionGlyphs)
        const reactionGlyph = findReactionGlyph(state.general.listOfReactionGlyphs, reaction.keggId)
        r._x = getReactionXPositionFromSbml(reactionGlyph)
        r._y = getReactionYPositionFromSbml(reactionGlyph)
        r._opacity = getReactionOpacity(reactionGlyph)
        r._reversible = reaction.reversible
        reaction.substrates.forEach(substrate => {
            const compound = getSbmlCompound(substrate, "substrate", reactionGlyph)
            r.addSubstrate(compound)
        })
        reaction.products.forEach(product => {
            const compound = getSbmlCompound(product, "product", reactionGlyph)
            r.addProduct(compound)
        })
        return r
    })
    return handleJSONGraphUpload(reactions, dispatch, state.graph)
}
const getReactionOpacity = (reactionGlyph) => reactionGlyph.isKeyCompound ? 1 : 0.4

const findReactionGlyph = (listOfReactionGlyphs, reactionId) => listOfReactionGlyphs.find(reactionGlyphObject => reactionGlyphObject.layoutReaction === reactionId)


const getReactionXPositionFromSbml = (reactionGlyph) => reactionGlyph.layoutX

const getReactionYPositionFromSbml = (reactionGlyph) => reactionGlyph.layoutY

const getSbmlCompound = (sbmlCompound, typeOfCompound, reactionGlyph) => {
    const productId = sbmlCompound.sbmlId.concat(";" + sbmlCompound.sbmlName + " " + sbmlCompound.keggId); //retruns name like "M_pep_c;Phosphoenolpyruvate K/G/CXXXXX"
    const compound = new Compound(productId)
    const speciesGlyph = getSpeciesGlyph(sbmlCompound.sbmlId, reactionGlyph)
    compound._x = typeof speciesGlyph === "object" ? getSpeciesXPositionFromSbml(typeOfCompound, speciesGlyph) : 0
    compound._y =typeof speciesGlyph === "object" ? getSpeciesYPositionFromSbml(typeOfCompound, speciesGlyph) : 0
    compound._abbreviation = productId
    compound._typeOfCompound = typeOfCompound
    compound._opacity = getCompoundOpacity(speciesGlyph)
    return compound
}

const getCompoundOpacity = speciesGlyph => speciesGlyph.isKeyCompound? 1: 0.4

const getSpeciesGlyph = (sbmlId, reactionGlyph) => reactionGlyph.listOfSpeciesReferenceGlyphs.find(speciesGlyph => getSpeciesIdOfSpeciesGlyph(speciesGlyph.layoutId) === sbmlId)

const getSpeciesIdOfSpeciesGlyph = (layoutId) => {
    return layoutId.split("SpeciesReferenceGlyph_")[1]
}

const getSpeciesXPositionFromSbml = (typeOfCompound, speciesGlyph) => typeOfCompound === "substrate" ? speciesGlyph.layOutStartX : speciesGlyph.layOutEndX

const getSpeciesYPositionFromSbml = (typeOfCompound, speciesGlyph) => typeOfCompound === "substrate" ? speciesGlyph.layOutStartY : speciesGlyph.layOutEndY
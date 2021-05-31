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
        r._opacity = 1
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

const findReactionGlyph = (listOfReactionGlyphs, reactionId) => listOfReactionGlyphs.find(reactionGlyphObject => reactionGlyphObject.layoutReaction === reactionId)


const getReactionXPositionFromSbml = (reactionGlyph) => reactionGlyph.layoutX

const getReactionYPositionFromSbml = (reactionGlyph) => reactionGlyph.layoutY

const getSbmlCompound = (sbmlCompound, typeOfCompound, reactionGlyph) => {
    const productId = sbmlCompound.sbmlId.concat(";" + sbmlCompound.sbmlName + " " + sbmlCompound.keggId); //retruns name like "M_pep_c;Phosphoenolpyruvate K/G/CXXXXX"
    const compound = new Compound(productId)
    console.log(reactionGlyph)
    console.log(sbmlCompound)
    const speciesGlyph = getSpeciesGlyph(sbmlCompound.sbmlName, reactionGlyph)
    console.log(speciesGlyph)
    compound._x = 0// +getSpeciesXPositionFromSbml(typeOfCompound, speciesGlyph)
    compound._y = 0//+getSpeciesYPositionFromSbml(typeOfCompound, speciesGlyph)
    console.log(getSpeciesXPositionFromSbml(typeOfCompound, speciesGlyph))
    console.log(getSpeciesYPositionFromSbml(typeOfCompound, speciesGlyph))
    compound._abbreviation = productId
    compound._typeOfCompound = typeOfCompound
    compound._opacity = 1
    return compound
}

const getSpeciesGlyph = (sbmlName, reactionGlyph) => reactionGlyph.listOfSpeciesReferenceGlyphs.find(speciesGlyph => getSpeciesNameOfSpeciesGlyph(speciesGlyph.layoutId) === sbmlName)

const getSpeciesNameOfSpeciesGlyph = (layoutId) => {
    return layoutId.split("SpeciesReferenceGlyph_")[1]
}

const getSpeciesXPositionFromSbml = (typeOfCompound, speciesGlyph) => typeOfCompound === "substrate" ? speciesGlyph.layOutStartX : speciesGlyph.layOutEndX

const getSpeciesYPositionFromSbml = (typeOfCompound, speciesGlyph) => typeOfCompound === "substrate" ? speciesGlyph.layOutStartY : speciesGlyph.layOutEndY
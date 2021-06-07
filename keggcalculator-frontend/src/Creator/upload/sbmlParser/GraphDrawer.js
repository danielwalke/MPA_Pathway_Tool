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
import {getLastItemOfList} from "../../usefulFunctions/Arrays";

export const setReactionsAndCompoundsInStore = (state, listOfReactions, dispatch, listOfReactionGlyphs) => {
    const reactions = listOfReactions.map(reaction => {
        const reactionId = reaction.sbmlId.concat(";" + reaction.sbmlName + " " + reaction.keggId); //retruns name like "R_PFK;Phosphofructokinase UXXXXX"
        const r = new Reaction(reactionId)
        const reactionGlyph = findReactionGlyph(state.general.listOfReactionGlyphs, reaction.keggId)
        r._x =  typeof reactionGlyph === "object" &&reactionGlyph !== null ? getReactionXPositionFromSbml(reactionGlyph) : 0
        r._y = typeof reactionGlyph === "object" &&reactionGlyph !== null? getReactionYPositionFromSbml(reactionGlyph) : 0
        r._opacity = typeof reactionGlyph === "object" &&reactionGlyph !== null? getReactionOpacity(reactionGlyph) : 1
        r._reversible = typeof reaction.reversible !== "undefined"? reaction.reversible : true
        r._abbreviation = reaction.sbmlName
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
    const speciesGlyph =typeof reactionGlyph === "object" && reactionGlyph!=="null" ? getSpeciesGlyph(sbmlCompound.sbmlId, reactionGlyph) : null
    const compoundId = `${sbmlCompound.sbmlId}_${getSpeciesGlyphIndex(speciesGlyph)};${sbmlCompound.sbmlName} ${sbmlCompound.keggId}`; //retruns name like "M_pep_c;Phosphoenolpyruvate K/G/CXXXXX"
    const compound = new Compound(compoundId)
    compound._x = typeof speciesGlyph === "object" &&speciesGlyph !== null? getSpeciesXPositionFromSbml(typeOfCompound, speciesGlyph) : 0
    compound._y =typeof speciesGlyph === "object" &&speciesGlyph !== null? getSpeciesYPositionFromSbml(typeOfCompound, speciesGlyph) : 0
    compound._abbreviation = sbmlCompound.sbmlName
    compound._typeOfCompound = typeOfCompound
    compound._opacity = typeof speciesGlyph === "object" &&speciesGlyph !== null? getCompoundOpacity(speciesGlyph) : 1
    console.log(compound)
    return compound
}

const getSpeciesGlyphIndex = (speciesGlyph) => speciesGlyph.layoutId.split("_")[getLastItemOfList(speciesGlyph.layoutId.split("_"))]

const getCompoundOpacity = speciesGlyph => speciesGlyph.isKeyCompound? 1: 0.4

const getSpeciesGlyph = (sbmlId, reactionGlyph) => reactionGlyph.listOfSpeciesReferenceGlyphs.find(speciesGlyph => speciesGlyph.layoutSpeciesReference === sbmlId)

const getSpeciesIdOfSpeciesGlyph = (layoutId) => {
    return layoutId.split("SpeciesReferenceGlyph_")[1]
}

const getSpeciesXPositionFromSbml = (typeOfCompound, speciesGlyph) => typeOfCompound === "substrate" ? speciesGlyph.layOutStartX : speciesGlyph.layOutEndX

const getSpeciesYPositionFromSbml = (typeOfCompound, speciesGlyph) => typeOfCompound === "substrate" ? speciesGlyph.layOutStartY : speciesGlyph.layOutEndY
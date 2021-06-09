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
import {getStochiometrySubstratesString} from "../../specReaction/functions/SpecReactionFunctions";


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
        r._taxonomy = reaction.taxonomy
        r._koList = reaction.koNumbers
        r._ecList= reaction.ecNumbers
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
    return handleJSONGraphUpload(getReactions(reactions, dispatch), dispatch, state.graph)
}
const getReactions=(reactions, dispatch) =>{
    const reactionObjects = reactions.map(r=>{
        const reaction = {}
        reaction.reactionId = r._reactionName.substring(r._reactionName.length-6,r._reactionName.length)
        reaction.reactionName = r._reactionName
        reaction.koNumbersString = r._koList
        reaction.ecNumbersString = r._ecList
        reaction.taxa = r._taxonomy
        reaction.reversible = r._reversible
        reaction.isForwardReaction = true
        reaction.opacity = r._opacity
        reaction.abbreviation = r._abbreviation
        reaction.x = r._x
        reaction.y = r._y
        reaction.stochiometrySubstratesString = new Map()
        reaction.stochiometryProductsString = new Map()
        reaction.substrates = r._substrates.map(substrate => {
            reaction.stochiometrySubstratesString.set(substrate._id, substrate._stoichiometry)
            return({
            x: substrate._x,
            y: substrate._y,
            name: substrate.name,
            opacity: substrate._opacity,
            abbreviation:substrate._abbreviation,
            stochiometry: substrate._stoichiometry
        })})
        reaction.products = r._products.map(product => {
            reaction.stochiometryProductsString.set(product._id, product._stoichiometry)
            return({
            x: product._x,
            y: product._y,
            name: product.name,
            opacity: product._opacity,
            abbreviation:product._abbreviation,
            stochiometry: product._stoichiometry
        })})
        return reaction
    })
    console.log(reactionObjects)
    dispatch({type:"ADDREACTIONSTOARRAY", payload: reactionObjects})
    return reactionObjects
}

const getReactionOpacity = (reactionGlyph) => reactionGlyph.isKeyCompound ? 1 : 0.4

const findReactionGlyph = (listOfReactionGlyphs, reactionId) => listOfReactionGlyphs.find(reactionGlyphObject => reactionGlyphObject.layoutReaction === reactionId)


const getReactionXPositionFromSbml = (reactionGlyph) => reactionGlyph.layoutX

const getReactionYPositionFromSbml = (reactionGlyph) => reactionGlyph.layoutY

const getSbmlCompound = (sbmlCompound, typeOfCompound, reactionGlyph) => {
    const speciesGlyph =typeof reactionGlyph === "object" && reactionGlyph!==null ? getSpeciesGlyph(sbmlCompound.sbmlId, reactionGlyph) : null
    const compoundId = typeof speciesGlyph === "object" && speciesGlyph!==null ? `${sbmlCompound.sbmlId}_${getSpeciesGlyphIndex(speciesGlyph)};${sbmlCompound.sbmlName} ${sbmlCompound.keggId}`:
        `${sbmlCompound.sbmlId};${sbmlCompound.sbmlName} ${sbmlCompound.keggId}`; //retruns name like "M_pep_c;Phosphoenolpyruvate K/G/CXXXXX"
    const compound = new Compound(compoundId)
    compound._id =sbmlCompound.keggId
    compound._x = typeof speciesGlyph === "object" &&speciesGlyph !== null? getSpeciesXPositionFromSbml(typeOfCompound, speciesGlyph) : 0
    compound._y =typeof speciesGlyph === "object" &&speciesGlyph !== null? getSpeciesYPositionFromSbml(typeOfCompound, speciesGlyph) : 0
    compound._abbreviation = sbmlCompound.sbmlName
    compound._typeOfCompound = typeOfCompound
    compound._stoichiometry = sbmlCompound.stoichiometry
    compound._opacity = typeof speciesGlyph === "object" &&speciesGlyph !== null? getCompoundOpacity(speciesGlyph) : 1
    return compound
}

const getSpeciesGlyphIndex = (speciesGlyph) => typeof speciesGlyph.layoutId === "undefined"? "" : getLastItemOfList(speciesGlyph.layoutId.split("_"))

const getCompoundOpacity = speciesGlyph => speciesGlyph.isKeyCompound? 1: 0.4

const getSpeciesGlyph = (sbmlId, reactionGlyph) => reactionGlyph.listOfSpeciesReferenceGlyphs.find(speciesGlyph => speciesGlyph.layoutSpeciesReference === sbmlId)

const getSpeciesXPositionFromSbml = (typeOfCompound, speciesGlyph) => typeOfCompound === "substrate" ? speciesGlyph.layOutStartX : speciesGlyph.layOutEndX

const getSpeciesYPositionFromSbml = (typeOfCompound, speciesGlyph) => typeOfCompound === "substrate" ? speciesGlyph.layOutStartY : speciesGlyph.layOutEndY
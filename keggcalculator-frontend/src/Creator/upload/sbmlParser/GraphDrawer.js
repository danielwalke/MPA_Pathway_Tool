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
import {NOT_KEY_COMPOUND_OPACITY} from "../../graph/Constants";


export const setReactionsAndCompoundsInStore = (state, listOfReactions, dispatch) => {
    const reactions = listOfReactions.map(reaction => {
        const reactionName = reaction.sbmlId.concat(";" + reaction.sbmlName + " " + reaction.keggId); //retruns name like "R_PFK;Phosphofructokinase UXXXXX"
        // Big TODO: this is absolutely messy, best practice would be a class that handles everything
        const r = new Reaction(reactionName)
        const reactionGlyph = findReactionGlyph(state.general.listOfReactionGlyphs, reaction.keggId)
        r._x = typeof reactionGlyph === "object" && reactionGlyph !== null ? getReactionXPositionFromSbml(reactionGlyph) : 0
        r._y = typeof reactionGlyph === "object" && reactionGlyph !== null ? getReactionYPositionFromSbml(reactionGlyph) : 0
        r._opacity = typeof reactionGlyph === "object" && reactionGlyph !== null ? getReactionOpacity(reactionGlyph) : 1
        r._reversible = typeof reaction.reversible !== "undefined" ? reaction.reversible : true
        r._abbreviation = reaction.sbmlName
        r._taxonomy = reaction.taxonomy
        r._koList = reaction.koNumbers
        r._ecList = reaction.ecNumbers
        r.biggId = reaction.biggReaction
        r.lowerBound = reaction.lowerBound
        r.upperBound = reaction.upperBound
        r.objectiveCoefficient = reaction.objectiveCoefficient

        reaction.substrates.forEach(substrate => {
            const compound = getSbmlCompound(substrate, "substrate", reactionGlyph, state.general.listOfSpeciesGlyphs)
            r.addSubstrate(compound)
        })
        reaction.products.forEach(product => {
            const compound = getSbmlCompound(product, "product", reactionGlyph, state.general.listOfSpeciesGlyphs)
            r.addProduct(compound)
        })

        return r
    })

    const reactionArray = getReactions(reactions, dispatch)
    dispatch({type: "ADDREACTIONSTOARRAY", payload: reactionArray})

    return handleJSONGraphUpload(reactionArray, dispatch, state.graph)
}
const getReactions = (reactions) => {
    const reactionObjects = reactions.map(r => {
        const reaction = {}
        reaction.reactionId = r._reactionName.substring(r._reactionName.length - 6, r._reactionName.length)
        reaction.reactionName = r._reactionName
        reaction.koNumbersString = r._koList
        reaction.ecNumbersString = r._ecList
        reaction.taxa = r._taxonomy
        reaction.reversible = r._reversible
        reaction.isForwardReaction = true
        reaction.opacity = r._opacity
        reaction.abbreviation = r._abbreviation
        reaction.x = parseFloat(r._x)
        reaction.y = parseFloat(r._y)
        reaction.stochiometrySubstratesString = new Map()
        reaction.stochiometryProductsString = new Map()
        reaction.biggId = r._biggId
        reaction.exchangeReaction = false
        reaction.lowerBound = r._lowerBound
        reaction.upperBound = r._upperBound
        reaction.objectiveCoefficient = r._objectiveCoefficient
        reaction.substrates = r._substrates.map(substrate => {
            reaction.stochiometrySubstratesString.set(substrate._id, substrate._stoichiometry)
            return ({
                x: substrate._x,
                y: substrate._y,
                name: substrate.name,
                opacity: substrate._opacity,
                abbreviation: substrate._abbreviation,
                stoichiometry: substrate._stoichiometry,
                biggId: substrate._biggId,
                compartment: substrate._compartment
            })
        })
        reaction.products = r._products.map(product => {
            reaction.stochiometryProductsString.set(product._id, product._stoichiometry)
            return ({
                x: product._x,
                y: product._y,
                name: product.name,
                opacity: product._opacity,
                abbreviation: product._abbreviation,
                stoichiometry: product._stoichiometry,
                biggId: product._biggId,
                compartment: product._compartment
            })
        })

        if (reaction.products.length === 0 &&
            reaction.substrates.length === 1 &&
            reaction.substrates[0].compartment === 'external') {
            reaction.exchangeReaction = true
        }
        return reaction
    })
    return reactionObjects
}

const getReactionOpacity = (reactionGlyph) => reactionGlyph.isKeyCompound ? 1 : NOT_KEY_COMPOUND_OPACITY

const findReactionGlyph = (listOfReactionGlyphs, reactionId) => listOfReactionGlyphs.find(reactionGlyphObject => reactionGlyphObject.layoutReaction === reactionId)

const getReactionXPositionFromSbml = (reactionGlyph) => reactionGlyph.layoutX

const getReactionYPositionFromSbml = (reactionGlyph) => reactionGlyph.layoutY

const getSbmlCompound = (sbmlCompound, typeOfCompound, reactionGlyph, speciesGlyphs) => {

    const speciesGlyph = typeof reactionGlyph === "object" && reactionGlyph !== null ?
        getSpeciesGlyph(sbmlCompound.sbmlId, reactionGlyph, speciesGlyphs) :
        null

    const speciesGlyphSplitArray = speciesGlyph.layoutId.split('_')

    let prefix
    if (speciesGlyphSplitArray.length <= 2) {
        prefix = sbmlCompound.sbmlId
    } else {
        const index = speciesGlyphSplitArray[2] === '1' ? '' : `_${speciesGlyphSplitArray[2]}`
        prefix = sbmlCompound.sbmlId + index
    }

    const compoundName = `${prefix}; ${sbmlCompound.sbmlName} ${sbmlCompound.keggId}`; //retruns name like "M_pep_c;Phosphoenolpyruvate K/G/CXXXXX"
    const compound = new Compound(compoundName)

    const coordinates = typeof speciesGlyph === "object" && speciesGlyph !== null ?
        speciesGlyph.getCoordinates() : {x: 0, y: 0}

    compound._id = sbmlCompound.keggId
    compound._x = coordinates.x
    compound._y = coordinates.y
    compound._abbreviation = sbmlCompound.sbmlName
    compound._typeOfCompound = typeOfCompound
    compound._stoichiometry = sbmlCompound.stoichiometry
    compound._opacity = typeof speciesGlyph === "object" && speciesGlyph !== null ? getCompoundOpacity(speciesGlyph) : 1
    compound._biggId = sbmlCompound.biggId
    compound._compartment = sbmlCompound.compartment
    return compound
}

const getCompoundOpacity = speciesGlyph => speciesGlyph.isKeyCompound ? 1 : NOT_KEY_COMPOUND_OPACITY

const getSpeciesGlyph = (sbmlId, reactionGlyph, speciesGlyphs) => {
    const speciesGlyphsWithCompound = speciesGlyphs.filter(glyph => glyph.layoutSpecies === sbmlId)
    const listOfSpeciesGlyphIdsInReaction = reactionGlyph.listOfSpeciesReferenceGlyphs.map(glyph => glyph.speciesGlyph)

    let speciesGlyphSelection

    for (const speciesGlyph of speciesGlyphsWithCompound) {
        if (listOfSpeciesGlyphIdsInReaction.some(glyphId => glyphId === speciesGlyph.layoutId)) {
            speciesGlyphSelection = speciesGlyph
            break;
        }
    }

    return speciesGlyphSelection
}

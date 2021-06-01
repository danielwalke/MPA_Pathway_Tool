import ReactionGlyph from "./ReactionGlyph";
import SpeciesReferenceGlyph from "./SpeciesReferenceGlyph";

export const readListOfReactionGlyphs = (sbml, listOfSpeciesGlyphs) =>{
    const listOfReactionGlyphs = []
    const listOfReactionGlyphsTag = sbml.getElementsByTagName("layout:listOfReactionGlyphs")[0]
    const reactionGlyphTags = listOfReactionGlyphsTag.children
    reactionGlyphTags.forEach(reactionGlyphTag => addNewReactionGlyph(reactionGlyphTag, listOfReactionGlyphs,listOfSpeciesGlyphs))
    return listOfReactionGlyphs
}

const addNewReactionGlyph = (reactionGlyphTag, listOfReactionGlyphs,listOfSpeciesGlyphs) =>{
    const curveSegmentTag = reactionGlyphTag.getElementsByTagName("layout:curveSegment")[0]
    const reactionGlyph = createNewReactionGlyph(reactionGlyphTag, curveSegmentTag)
    const listOfSpeciesReferenceGlyphsTag =  reactionGlyphTag.getElementsByTagName("layout:listOfSpeciesReferenceGlyphs")[0]
    const speciesReferenceGlyphTags = listOfSpeciesReferenceGlyphsTag.children
    speciesReferenceGlyphTags.forEach(speciesReferenceGlyphTag => addNewSpeciesReferenceGlyph(speciesReferenceGlyphTag, reactionGlyph,listOfSpeciesGlyphs))
    listOfReactionGlyphs.push(reactionGlyph)
}

const addSpeciesReferencePositions = (speciesReferenceGlyph, speciesReferenceGlyphTag) =>{
    const layoutStartTag = speciesReferenceGlyphTag.getElementsByTagName("layout:start")[0]
    const layoutEndTag = speciesReferenceGlyphTag.getElementsByTagName("layout:end")[0]
    speciesReferenceGlyph.layOutStartX = layoutStartTag.attributes["layout:x"]
    speciesReferenceGlyph.layOutStartY = layoutStartTag.attributes["layout:y"]
    speciesReferenceGlyph.layOutEndX = layoutEndTag.attributes["layout:x"]
    speciesReferenceGlyph.layOutEndY = layoutEndTag.attributes["layout:y"]
}

const addNewSpeciesReferenceGlyph = (speciesReferenceGlyphTag,reactionGlyph,listOfSpeciesGlyphs) =>{
    const speciesReferenceGlyph = new SpeciesReferenceGlyph(speciesReferenceGlyphTag.attributes["layout:id"], speciesReferenceGlyphTag.attributes["layout:role"])
    speciesReferenceGlyph.speciesGlyph = speciesReferenceGlyphTag.attributes["layout:speciesGlyph"]
    addSpeciesReferencePositions(speciesReferenceGlyph, speciesReferenceGlyphTag)
    addSpeciesIsKeyCompound(speciesReferenceGlyph, listOfSpeciesGlyphs)
    reactionGlyph.addSpeciesReferenceGlyph(speciesReferenceGlyph)
}

const addSpeciesIsKeyCompound = (speciesReferenceGlyph, listOfSpeciesGlyphs) =>{
    const speciesGlyph = listOfSpeciesGlyphs.find(speciesGlyph => speciesReferenceGlyph.speciesGlyph === speciesGlyph.layoutId)
    speciesReferenceGlyph.isKeyCompound = speciesGlyph.isKeyCompound
}

const createNewReactionGlyph = (reactionGlyphTag, curveSegmentTag) =>{
    const reactionGlyph = new ReactionGlyph(reactionGlyphTag.attributes["layout:id"], reactionGlyphTag.attributes["layout:reaction"])
    reactionGlyph.layoutX = getXPositionFromCurveSegment(curveSegmentTag)
    reactionGlyph.layoutY = getYPositionFromCurveSegment(curveSegmentTag)
    reactionGlyph.isKeyCompound = getReactionIsKeyCompound(reactionGlyphTag)
    return reactionGlyph
}

const getReactionIsKeyCompound = (reactionGlyphTag) => reactionGlyphTag.attributes["render:objectRole"] === "keyCompound"

const getXPositionFromCurveSegment = (curveSegmentTag) =>{
    return curveSegmentTag.children[0].attributes["layout:x"]
}

const getYPositionFromCurveSegment = (curveSegmentTag) =>{
    return curveSegmentTag.children[0].attributes["layout:y"]
}
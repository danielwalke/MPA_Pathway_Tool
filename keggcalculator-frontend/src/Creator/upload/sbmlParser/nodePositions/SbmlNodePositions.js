import ReactionGlyph from "./ReactionGlyph";
import SpeciesReferenceGlyph from "./SpeciesReferenceGlyph";

export const readListOfReactionGlyphs = (sbml) =>{
    const listOfReactionGlyphs = []
    const listOfReactionGlyphsTag = sbml.getElementsByTagName("layout:listOfReactionGlyphs")[0]
    const reactionGlyphTags = listOfReactionGlyphsTag.children
    reactionGlyphTags.forEach(reactionGlyphTag => addNewReactionGlyph(reactionGlyphTag, listOfReactionGlyphs))
    return listOfReactionGlyphs
}

const addNewReactionGlyph = (reactionGlyphTag, listOfReactionGlyphs) =>{
    const curveSegmentTag = reactionGlyphTag.getElementsByTagName("layout:curveSegment")[0]
    const reactionGlyph = createNewReactionGlyph(reactionGlyphTag, curveSegmentTag)
    const listOfSpeciesReferenceGlyphsTag =  reactionGlyphTag.getElementsByTagName("layout:listOfSpeciesReferenceGlyphs")[0]
    const speciesReferenceGlyphTags = listOfSpeciesReferenceGlyphsTag.children
    speciesReferenceGlyphTags.forEach(speciesReferenceGlyphTag => addNewSpeciesReferenceGlyph(speciesReferenceGlyphTag, reactionGlyph))
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

const addNewSpeciesReferenceGlyph = (speciesReferenceGlyphTag,reactionGlyph) =>{
    const speciesReferenceGlyph = new SpeciesReferenceGlyph(speciesReferenceGlyphTag.attributes["layout:id"], speciesReferenceGlyphTag.attributes["layout:role"])
    addSpeciesReferencePositions(speciesReferenceGlyph, speciesReferenceGlyphTag)
    reactionGlyph.addSpeciesReferenceGlyph(speciesReferenceGlyph)
}

const createNewReactionGlyph = (reactionGlyphTag, curveSegmentTag) =>{
    const reactionGlyph = new ReactionGlyph(reactionGlyphTag.attributes["layout:id"], reactionGlyphTag.attributes["layout:reaction"])
    reactionGlyph.layoutX = getXPositionFromCurveSegment(curveSegmentTag)
    reactionGlyph.layoutY = getYPositionFromCurveSegment(curveSegmentTag)
    return reactionGlyph
}

const getXPositionFromCurveSegment = (curveSegmentTag) =>{
    return curveSegmentTag.children[0].attributes["layout:x"]
}

const getYPositionFromCurveSegment = (curveSegmentTag) =>{
    return curveSegmentTag.children[0].attributes["layout:y"]
}
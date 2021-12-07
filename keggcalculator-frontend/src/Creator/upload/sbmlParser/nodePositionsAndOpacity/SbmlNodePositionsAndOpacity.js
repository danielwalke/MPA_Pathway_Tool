import ReactionGlyph from "./ReactionGlyph";
import SpeciesReferenceGlyph from "./SpeciesReferenceGlyph";

export const readListOfReactionGlyphs = (sbml) => {
    const listOfReactionGlyphObjects = []
    const listOfReactionGlyphs = sbml.getElementsByTagName("layout:listOfReactionGlyphs")[0].children

    listOfReactionGlyphs.forEach(reactionGlyph => {
        if (reactionGlyph.getElementsByTagName("layout:curveSegment").length > 0) {
            const newReactionGlyphObj = addNewReactionGlyph(reactionGlyph)
            listOfReactionGlyphObjects.push(newReactionGlyphObj)
        }
    })

    return listOfReactionGlyphObjects
}

const addNewReactionGlyph = (reactionGlyph) => {
    const curveSegment = reactionGlyph.getElementsByTagName("layout:curveSegment")[0]
    const reactionGlyphObj = createNewReactionGlyph(reactionGlyph, curveSegment)

    if (reactionGlyph.getElementsByTagName("layout:listOfSpeciesReferenceGlyphs").length > 0) {
        const speciesReferenceGlyphs = reactionGlyph.getElementsByTagName(
            "layout:listOfSpeciesReferenceGlyphs")[0].children

        speciesReferenceGlyphs.forEach(
            speciesReferenceGlyph => addNewSpeciesReferenceGlyph(speciesReferenceGlyph, reactionGlyphObj))
    }

    return reactionGlyphObj
}

const createNewReactionGlyph = (reactionGlyphTag, curveSegmentTag) => {
    const reactionGlyph = new ReactionGlyph(
        reactionGlyphTag.attributes["layout:id"], reactionGlyphTag.attributes["layout:reaction"])

    reactionGlyph.layoutX = getXPositionFromCurveSegment(curveSegmentTag)
    reactionGlyph.layoutY = getYPositionFromCurveSegment(curveSegmentTag)
    reactionGlyph.isKeyCompound = getReactionIsKeyCompound(reactionGlyphTag)

    return reactionGlyph
}

const addNewSpeciesReferenceGlyph = (speciesReferenceGlyph, reactionGlyphObj) => {

    const speciesReferenceGlyphObj = new SpeciesReferenceGlyph(
        speciesReferenceGlyph.attributes["layout:id"], speciesReferenceGlyph.attributes["layout:role"])

    speciesReferenceGlyphObj.speciesGlyph = speciesReferenceGlyph.attributes["layout:speciesGlyph"]
    reactionGlyphObj.addSpeciesReferenceGlyph(speciesReferenceGlyphObj)
}

const getReactionIsKeyCompound = (reactionGlyphTag) => reactionGlyphTag.attributes["render:objectRole"] === "keyCompound"

const getXPositionFromCurveSegment = (curveSegmentTag) => {
    return curveSegmentTag.children[0].attributes["layout:x"]
}

const getYPositionFromCurveSegment = (curveSegmentTag) => {
    return curveSegmentTag.children[0].attributes["layout:y"]
}

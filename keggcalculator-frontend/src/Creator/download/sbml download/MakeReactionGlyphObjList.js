import React from "react";
import MakeSpeciesReferenceGlyph from "./MakeSpeciesReferenceGlyph";

const MakeReactionGlyphObjList = (reactionsRaw) => {

    const reactionGlyphObjList = reactionsRaw.map(item => {

        const reactionGlyphObject = {
            '@': {
                'layout:id': ['glyph_', item.reactionId].join(""),
                'layout:reaction': item.reactionId,
                'render:objectRole': item.opacity === 1 ? "keyCompound" : "nonKeyCompound"
            },
            '#': {
                'layout:curve': {
                    '#': {'listOfCurveSegments': {
                            '#': {'layout:curveSegment': {
                                    '@': {
                                        'xmlns:xsi':"http://www.w3.org/2001/XMLSchema-instance",
                                        'xsi:type':"LineSegment"},
                                    '#': {
                                        //Todo: Set Start and Endpoints to substrate and product coordinates
                                        'layout:start': {'@': {'layout:x': item.x, 'layout:y': item.y}},
                                        'layout:end': {'@': {'layout:x': item.x, 'layout:y': item.y}}
                                    }}}}}},
                'layout:listOfSpeciesReferenceGlyphs': {
                    'layout:speciesReferenceGlyph': MakeSpeciesReferenceGlyph([item.substrates, item.products, item.x, item.y])}
            }}

        return reactionGlyphObject
    })
return reactionGlyphObjList

}

export default MakeReactionGlyphObjList
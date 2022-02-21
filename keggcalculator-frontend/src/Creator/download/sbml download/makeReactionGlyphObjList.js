import React from "react";
import MakeSpeciesReferenceGlyph from "./makeSpeciesReferenceGlyph";

const MakeReactionGlyphObjList = (reactionList) => {

    const reactionGlyphObjList = reactionList.map(reaction => {

        const reactionGlyphObject = {
            '@': {
                'layout:id': 'glyph_' + reaction.reactionId,
                'layout:reaction': reaction.reactionId,
                'render:objectRole': reaction.opacity === 1 ? "keyCompound" : "nonKeyCompound"
            },
            '#': {
                'layout:curve': {
                    '#': {
                        'listOfCurveSegments': {
                            '#': {
                                'layout:curveSegment': {
                                    '@': {
                                        'xmlns:xsi': "http://www.w3.org/2001/XMLSchema-instance",
                                        'xsi:type': "LineSegment"
                                    },
                                    '#': {
                                        //Todo: Set Start and Endpoints to substrate and product coordinates
                                        'layout:start': {'@': {'layout:x': reaction.x, 'layout:y': reaction.y}},
                                        'layout:end': {'@': {'layout:x': reaction.x, 'layout:y': reaction.y}}
                                    }
                                }
                            }
                        }
                    }
                },
                'layout:listOfSpeciesReferenceGlyphs': {
                    'layout:speciesReferenceGlyph': MakeSpeciesReferenceGlyph({
                        substrates: reaction.substrates, products: reaction.products, x: reaction.x, y: reaction.y})
                }
            }
        }

        return reactionGlyphObject
    })
    return reactionGlyphObjList

}

export default MakeReactionGlyphObjList

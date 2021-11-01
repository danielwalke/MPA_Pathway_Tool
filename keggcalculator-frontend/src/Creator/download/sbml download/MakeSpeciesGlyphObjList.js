import React from "react";

const MakeSpeciesGlyphObjList = (speciesRaw) => {
    const speciesGlyphObjList = speciesRaw.map(compound => {

        // const name = species.name.substring(0, species.name.length - 7).replace(/ /g, "_").replace(/^[\d\W_]*/,"")

        const speciesGlyphObj = {
            '@': {
                'layout:id': 'SpeciesGlyph_' + compound.glyphId,
                'layout:species': compound.sbmlId,
                'render:objectRole': compound.opacity === 1 ? "keyCompound" : "nonKeyCompound"
            },
            '#': {
                'layout:boundingBox': {
                    '@': {'layout:id': "bb2"},
                    '#': {
                        'layout:position': {
                            '@': {
                                'layout:x': String(compound.x),
                                'layout:y': String(compound.y),
                            }
                        },
                        'layout:dimensions': {
                            '@': {
                                'layout:width': "20",
                                'layout:height': "20"
                            }
                        }

                    }
                }
            }
        }
        return speciesGlyphObj
    })
    return speciesGlyphObjList
}

export default MakeSpeciesGlyphObjList

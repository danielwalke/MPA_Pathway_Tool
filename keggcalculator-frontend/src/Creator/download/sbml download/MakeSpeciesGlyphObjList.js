import React from "react";

const MakeSpeciesGlyphObjList = (speciesRaw) => {
    const speciesGlyphObjList = speciesRaw.map(species => {

        // const name = species.name.substring(0, species.name.length - 7).replace(/ /g, "_").replace(/^[\d\W_]*/,"")

        const speciesGlyphObj = {
            '@': {
                'layout:id': ['SpeciesGlyph_', species.glyphId].join(""),
                'layout:species': species.id,
                'render:objectRole': species.opacity === 1 ? "keyCompound" : "nonKeyCompound"
            },
            '#': {
                'layout:boundingBox': {
                    '@': {'layout:id': "bb2"},
                    '#': {
                        'layout:position': {
                            '@': {
                                'layout:x': String(species.x),
                                'layout:y': String(species.y),
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

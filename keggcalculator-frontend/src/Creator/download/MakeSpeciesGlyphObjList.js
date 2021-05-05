import React from "react";

const MakeSpeciesGlyphObjList = (speciesRaw) => {
    const speciesGlyphObjList = speciesRaw.map(species => {

        const name = species.name.substring(0, species.name.length - 7).replace(/ /g, "_")

        const speciesGlyphObj = {
            '@': {
             'layout:id': ['SpeciesGlyph_', name].join(""),
             'layout:species': name},
            '#': {
                'layout:boundingBox': {
                    '@': {'layout:id':"bb2"},
                    '#': {
                        'layout:position': {
                            '@': {
                                'layout:x': [species.x].join(""),
                                'layout:y': [species.y].join(""),
                            }},
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
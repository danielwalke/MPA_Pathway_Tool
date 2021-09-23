import React from "react";

const MakeSpeciesReferenceGlyph = (props) => {

    const speciesReferenceGlyph = []
    props[0].map(
        item => {
            // const abbreviation = item.abbreviation.substring(0, item.abbreviation.length - 7).replace(/ /g, "_")

            const subGlyph = {
                '@': {
                    'layout:id': ["SpeciesReferenceGlyph_", item.glyphId].join(""),
                    'layout:speciesReference': item.id,
                    'layout:speciesGlyph': ["SpeciesGlyph_", item.glyphId].join(""),
                    'layout:role': "substrate"
                },
                '#': {
                    'layout:curve': {
                        '#': {
                            'layout:listOfCurveSegments': {
                                'layout:curveSegment': {
                                    '@': {
                                        'xmlns:xsi': "http://www.w3.org/2001/XMLSchema-instance",
                                        'xsi:type': "LineSegment"
                                    },
                                    '#': {
                                        'layout:start': {'@': {'layout:x': item.x, 'layout:y': item.y}},
                                        'layout:end': {'@': {'layout:x': props[2], 'layout:y': props[3]}}
                                    }
                                }
                            }
                        }
                    }
                }
            }

            speciesReferenceGlyph.push(subGlyph)
        })

    props[1].map(
        item => {
            // const abbreviation = item.abbreviation.substring(0, item.abbreviation.length - 7).replace(/ /g, "_")

            const prodGlyph = {
                '@': {
                    'layout:id': ["SpeciesReferenceGlyph_", item.glyphId].join(""),
                    'layout:speciesReference': item.id,
                    'layout:speciesGlyph': ["SpeciesGlyph_", item.glyphId].join(""),
                    'layout:role': "product"
                },
                '#': {
                    'layout:curve': {
                        '#': {
                            'layout:listOfCurveSegments': {
                                'layout:curveSegment': {
                                    '@': {
                                        'xmlns:xsi': "http://www.w3.org/2001/XMLSchema-instance",
                                        'xsi:type': "LineSegment"
                                    },
                                    '#': {
                                        'layout:start': {
                                            '@': {'layout:x': props[2], 'layout:y': props[3]},
                                            'layout:end': {'@': {'layout:x': item.x, 'layout:y': item.y}}
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            speciesReferenceGlyph.push(prodGlyph)
        }
    )

    return speciesReferenceGlyph
}

export default MakeSpeciesReferenceGlyph

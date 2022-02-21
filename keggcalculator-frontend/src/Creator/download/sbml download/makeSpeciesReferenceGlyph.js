import React from "react";

const MakeSpeciesReferenceGlyph = (props) => {

    // TODO: Refactor

    const speciesReferenceGlyph = []
    props.substrates.map(
        compound => {
            // const abbreviation = item.abbreviation.substring(0, item.abbreviation.length - 7).replace(/ /g, "_")

            const subGlyph = {
                '@': {
                    'layout:id': "SpeciesReferenceGlyph_" + compound.glyphId,
                    'layout:speciesReference': compound.id,
                    'layout:speciesGlyph': "SpeciesGlyph_" + compound.glyphId,
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
                                        'layout:start': {'@': {'layout:x': compound.x, 'layout:y': compound.y}},
                                        'layout:end': {'@': {'layout:x': props.x, 'layout:y': props.y}}
                                    }
                                }
                            }
                        }
                    }
                }
            }

            speciesReferenceGlyph.push(subGlyph)
        })

    props.products.map(
        compound => {
            // const abbreviation = item.abbreviation.substring(0, item.abbreviation.length - 7).replace(/ /g, "_")

            const prodGlyph = {
                '@': {
                    'layout:id': "SpeciesReferenceGlyph_" + compound.glyphId,
                    'layout:speciesReference': compound.id,
                    'layout:speciesGlyph': "SpeciesGlyph_" + compound.glyphId,
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
                                            '@': {'layout:x': props.x, 'layout:y': props.y},
                                            'layout:end': {'@': {'layout:x': compound.x, 'layout:y': compound.y}}
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

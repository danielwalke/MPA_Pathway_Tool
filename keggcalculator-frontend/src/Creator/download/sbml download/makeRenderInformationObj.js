import React from "react";

const RenderInformationObject = {
    '@': {
        'xmlns:render': "http://www.sbml.org/sbml/level3/version1/render/version1",
        versionMajor: 1,
        versionMinor: 0
    },
    '#': {
        'render:renderInformation': {
            '@': {
                id: "renderForOpacity",
                programName: "MPA Pathway Tool",
                programVersion: "0.8"
            },
            '#': {
                'render:listOfColorDefinitions':
                    {
                        'render:colorDefinition':
                            [{
                                '@': {
                                    'render:id': "keyReaction",
                                    'render:value': "#000000ff"
                                }
                            },
                                {
                                    '@': {
                                        'render:id': "nonKeyReaction",
                                        'render:value': "#00000066"
                                    }
                                },
                                {
                                    '@': {
                                        'render:id': "keyCompound",
                                        'render:value': "#FF800000"
                                    }
                                },
                                {
                                    '@': {
                                        'render:id': "nonKeyCompound",
                                        'render:value': "#FF800066"
                                    }
                                }]

                    },
                'render:listOfStyles':
                    [
                        {
                            'render:style': {
                                '@': {
                                    'render:id': "keyReaction",
                                    'render:roleList': "keyReaction"
                                },
                                '#': {
                                    'render:g': {'@': {'render:stroke': "keyReaction"}}
                                }
                            }
                        },
                        {
                            'render:style': {
                                '@': {
                                    'render:id': "nonKeyReaction",
                                    'render:roleList': "nonKeyReaction"
                                },
                                '#': {
                                    'render:g': {'@': {'render:stroke': "nonKeyReaction"}}
                                }
                            }
                        },
                        {
                            'render:style': {
                                '@': {
                                    'render:id': "keyCompound",
                                    'render:roleList': "keyCompound"
                                },
                                '#': {
                                    'render:g': {'@': {'render:stroke': "keyCompound"}}
                                }
                            }
                        },
                        {
                            'render:style': {
                                '@': {
                                    'render:id': "nonKeyCompound",
                                    'render:roleList': "nonKeyCompound"
                                },
                                '#': {
                                    'render:g': {'@': {'render:stroke': "nonKeyCompound"}}
                                }
                            }
                        }
                    ]
            }
        }
    }
}


export default RenderInformationObject

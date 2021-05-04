import React from "react";
import {useDispatch, useSelector} from "react-redux";
import ReactDomServer from "react-dom/server"
import objectToXML from "object-to-xml"
import {saveAs} from "file-saver";
import {getReactions} from "./DownloadFunctions";
import clonedeep from "lodash/cloneDeep";
import {getNodePosition} from "./NodePosition";

const makeSpeciesReferenceObj = (props) => {

    //Input: <ReactionObject>.products / <ReactionObject>.substrates
    //extracts species, stoichiometry and constant parameters from the Input and returns an object that can be fed into
    //the SBML object tree
    //example:
    //listOfReactants: {'#':makeSpeciesReferenceObj(item.substrates)}

    const reference = props.map(comps => {
        const ref = {'@': {
            species: comps.abbreviation.substring(0, comps.abbreviation.length - 7).replace(/ /g, "_"),
                stoichiometry: comps.stochiometry,
                constant: "true"
        }}
        return ref})

    return {'speciesReference': reference}
}

const makeSpeciesReferenceGlyph = (props) => {

    const speciesReferenceGlyph = []
    props[0].map(
        item => {
            const abbreviation = item.abbreviation.substring(0, item.abbreviation.length - 7).replace(/ /g, "_")

            const subGlyph = {
                '@': {
                        'layout:id':["SpeciesReferenceGlyph_",abbreviation].join(""),
                        'layout:speciesReference':["SpeciesReference_",abbreviation].join(""),
                        'layout:speciesGlyph':["SpeciesGlyph_",abbreviation].join(""),
                        'layout:role':"substrate"
                        },
                '#': {
                    'layout:curve': {
                        '#': {'layout:listOfCurveSegments': {
                              'layout:curveSegment': {
                                  '@' : {
                                      'xmlns:xsi':"http://www.w3.org/2001/XMLSchema-instance",
                                      'xsi:type':"LineSegment"
                                  },
                                  '#' : {
                                      'layout:start': {'@': {'layout:x': item.x, 'layout:y': item.y}},
                                      'layout:end': {'@': {'layout:x': props[2], 'layout:y': props[3]}}
                                  }}}}}}}

            speciesReferenceGlyph.push(subGlyph)})

    props[1].map(
        item => {
            const abbreviation = item.abbreviation.substring(0, item.abbreviation.length - 7).replace(/ /g, "_")

            const prodGlyph = {
                '@': {
                    'layout:id':["SpeciesReferenceGlyph_",abbreviation].join(""),
                    'layout:speciesReference':["SpeciesReference_",abbreviation].join(""),
                    'layout:speciesGlyph':["SpeciesGlyph_",abbreviation].join(""),
                    'layout:role':"product"
                },
                '#': {
                    'layout:curve': {
                        '#': {'layout:listOfCurveSegments': {
                                'layout:curveSegment': {
                                    '@' : {
                                        'xmlns:xsi':"http://www.w3.org/2001/XMLSchema-instance",
                                        'xsi:type':"LineSegment"
                                    },
                                    '#' : {
                                        'layout:start': {'@': {'layout:x': props[2], 'layout:y': props[3]},
                                        'layout:end': {'@': {'layout:x': item.x, 'layout:y': item.y}}}
                                    }}}}}}}
            speciesReferenceGlyph.push(prodGlyph)
        }
    )

    return speciesReferenceGlyph
}

const handleSBMLDownload = (state, dispatch) => {

    const generalState = state.general
    const graphState = state.graph

    const {reactionObjects, reactionNames} = getReactions(graphState)
    const reactionsRaw = reactionNames.map(
        name => generalState.reactionsInSelectArray.filter(
            reaction => reaction.reactionName === name)[0])

    reactionsRaw.map(reaction => {
        reaction.abbreviation = typeof graphState.abbreviationsObject[`${reaction.reactionName}`] === "undefined" ? reaction.reactionName : graphState.abbreviationsObject[`${reaction.reactionName}`]
        reaction.opacity = clonedeep(graphState.data.nodes.filter(node => node.id = reaction.reactionName)[0].opacity)
        reaction.reversible = "reversible"
        reaction.x = getNodePosition(reaction.reactionName).x
        reaction.y = getNodePosition(reaction.reactionName).y
        if(graphState.data.links.length===0){
            reaction.substrates=[]
            reaction.products = []
        }else{
            if (reaction.isForwardReaction) {
                reaction.substrates = reactionObjects[`${reaction.reactionName}`].substrates.map(substrate =>{
                    const substrateId = substrate.name.substring(substrate.name.length-6, substrate.name.length)
                    substrate.stochiometry = reaction.stochiometrySubstratesString[`${substrateId}`]
                    return substrate
                })
                reaction.products = reactionObjects[`${reaction.reactionName}`].products.map(product =>{
                    const productId = product.name.substring(product.name.length-6, product.name.length)
                    product.stochiometry = reaction.stochiometryProductsString[`${productId}`]
                    return product
                })
            } else {
                reaction.substrates = reactionObjects[`${reaction.reactionName}`].substrates.map(substrate =>{
                    const substrateId = substrate.name.substring(substrate.name.length-6, substrate.name.length)
                    substrate.stochiometry = reaction.stochiometryProductsString[`${substrateId}`]
                    return substrate
                })
                reaction.products = reactionObjects[`${reaction.reactionName}`].products.map(product =>{
                    const productId = product.name.substring(product.name.length-6, product.name.length)
                    product.stochiometry = reaction.stochiometrySubstratesString[`${productId}`]
                    return product
                })
            }
        }
        // reaction["opacity"] = 1
        // let output = outputCsv.concat("stepId;ReactionNumberId;koNumberIds;ecNumberIds;stochCoeff;compoundId;typeOfCompound;reversibility;taxonomy;reactionX;reactionY;CompoundX;CompoundY;reactionAbbr;compoundAbbr;keyComp", "\n")
        return reaction})        // generate array of reaction information

    console.log(reactionsRaw)

    const pathwayName = "pathway" //TODO add user interface for text input

    const reaction = reactionsRaw.map(item => {

        const rIdForRDF = ['#',item.reactionId].join("")

        const references = {'rdf:li':[]}
        if(item.reactionId != ""){
            references['rdf:li'].push({'@': {'rdf:resource': ['http://identifiers.org/kegg.reaction/', item.reactionId].join("")}})
        }
        if(item.koNumbersString.length != 0){
            item.koNumbersString.map(ko => {
                references['rdf:li'].push({'@': {'rdf:resource': ['https://www.kegg.jp/entry/', ko].join("")}})})
        }
        if(item.ecNumbersString.length != 0){
            item.ecNumbersString.map(ec => {
                references['rdf:li'].push({'@': {'rdf:resource': ['http://identifiers.org/ec-code/', ec].join("")}})})
        }

        // const educt = makeSpeciesReferenceObj(item.substrates)
        // const product = makeSpeciesReferenceObj(item.products)

        const reactionObject = {
            '@': {
                id: item.reactionId,
                reversible: item.reversible==="reversible" ? "true" : "false",
                name: item.reactionId,
                metaid: item.reactionId},
            '#': {
                listOfReactants: {'#': makeSpeciesReferenceObj(item.substrates)},
                listOfProducts: {'#': makeSpeciesReferenceObj(item.products)},
                'sbml:annotation': {
                    '@': {'xmlns:sbml': "http://www.sbml.org/sbml/level3/version1/core"},
                    '#': {
                        'rdf:RDF': {
                            '@': {'xmlns:rdf': "http://www.w3.org/1999/02/22-rdf-syntax-ns#"},
                            '#': {
                                'rdf:Description': {
                                    '@': {'rdf:about': rIdForRDF},
                                    '#': {
                                        'bqbiol:is': {
                                            '@': {'xmlns:bqbiol': "http://biomodels.net/biology-qualifiers/"},
                                            '#': {
                                                'rdf:Bag': {'#': references}
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

            }}
        return reactionObject
    }) // generate reaction object for listOfReactions

    console.log(reaction)

    let speciesRaw = []                        // generate list of species
    for(const rxn of reactionsRaw) {
        const prods = rxn.products.map(item => item.abbreviation)
        speciesRaw.push(...prods)
        const subs = rxn.substrates.map(item => item.abbreviation)
        speciesRaw.push(...subs)
    }
    speciesRaw = Array.from(new Set(speciesRaw)) // make unique list of species

    const species = speciesRaw.map(item => {

        const idWithoutSpaces = [item.substring(0, item.length - 7).replace(/ /g, "_")].join("")
        const cIdForRDF = ['#',item.substring(0, item.length - 7).replace(/ /g, "_")].join("")
        const keggCompoundURI = ['http://identifiers.org/kegg.compound/',item.substring(item.length - 6)].join("")

        const speciesObj = {
            '@': {id: idWithoutSpaces, metaid: idWithoutSpaces},
            '#': {
                'sbml:annotation': {
                    '@': {'xmlns:sbml': "http://www.sbml.org/sbml/level3/version1/core"},
                    '#': {
                        'rdf:RDF': {
                            '@': {'xmlns:rdf': "http://www.w3.org/1999/02/22-rdf-syntax-ns#"},
                            '#': {
                                'rdf:Description': {
                                    '@': {'rdf:about': cIdForRDF},
                                    '#': {
                                        'bqbiol:is': {
                                            '@': {'xmlns:bqbiol': "http://biomodels.net/biology-qualifiers/"},
                                            '#': {
                                                'rdf:Bag': {
                                                    '#': {
                                                        'rdf:li': {
                                                            '@': {'rdf:resource': keggCompoundURI}
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        return speciesObj}) // generate species objects for listOfSpecies

    const reactionGlyphObj = reactionsRaw.map(item => {
        const reactionGlyph = {
                '@': {
                    'layout:id': ['glyph_', item.reactionId].join(""),
                    'layout:reaction': item.reactionId
                },
                '#': {
                    'layout:curve': {
                        '#': {'listOfCurveSegments': {
                                '#': {'layout:curveSegment': {
                                        '@': {
                                            'xmlns:xsi': "http://www.w3.org/2001/XMLSchema-instance",
                                            'xsi:type':"LineSegment"},
                                        '#': {
                                            'layout:start': {'@': {'layout:x': item.x, 'layout:y': item.y}},
                                            'layout:end': {'@': {'layout:x': item.x, 'layout:y': item.y}}
                                        }}}}}},
                    'layout:listOfSpeciesReferenceGlyphs': {
                        'layout:speciesReferenceGlyph': makeSpeciesReferenceGlyph([item.substrates, item.products, item.x, item.y])}
                    }}

    return reactionGlyph
    })



    const obj = {
        "?xml version=\"1.0\" encoding=\"UTF-8\"?": null,
        sbml: {
            '@': {
                xmlns: "http://www.sbml.org/sbml/level3/version2/core",
                'xmlns:layout': "http://www.sbml.org/sbml/level3/version1/layout/version1",
                'layout:required': "false",
                level: "3",
                version: "2"
            //    Optional: metaID, SBOterm (sysbio semantics declaring type of model elements), package namespaces and
            //    required attribute
            },
            model: {
                    '@': {id: pathwayName},
                    '#': {
                        listOfSpecies: {species},
                        listOfReactions: {reaction},
                        'layout:listOfLayouts': {
                            '@': {
                                'xmlns:xsi': "http://www.w3.org/2001/XMLSchema-instance",
                                'xmlns:layout':"http://www.sbml.org/sbml/level3/version1/layout/version1"
                            },
                            '#': {
                                'layout:layout': {
                                    '@': {'layout:id': "Layout1"},
                                    '#': {
                                        'layout:dimensions': {'@': {'layout:width':"400", 'layout:height':"230"}},
                                        'layout:ListOfReactionGlyphs': {reactionGlyph: reactionGlyphObj}
                                        }
                                    }
                                }
                            }
                        }
                    }
            }

        }

    console.log(objectToXML(obj))
    // let blob = new Blob(new Array(objectToXML(obj).trim()), {type: "text/plain;charset=utf-8"});
    // saveAs(blob, "ModuleGraph.xml")
}

const SBMLDownloader = () => {
    const state = useSelector(state => state)
    const dispatch = useDispatch()
    return (
        <div>
            <button className={"downloadButton"} onClick={() => handleSBMLDownload(state, dispatch)}>Download SBML
            </button>
        </div>
    )
}

export default SBMLDownloader
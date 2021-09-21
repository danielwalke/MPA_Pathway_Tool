import React from "react";
import MakeSpeciesReferenceObj from "./MakeSpeciesReferenceObj";

const MakeReactionObjectList = (reactionsRaw, taxonomyIdArray) => {

    const reactionObj = reactionsRaw.map(item => {

        const taxonomyIds = taxonomyIdArray.filter(taxon => item.reactionId == taxon.reactionId)

        const rIdForRDF = ['#', item.reactionId].join("")

        const references = {'rdf:li': []}
        if (item.reactionId != "") {
            references['rdf:li'].push({'@': {'rdf:resource': ['http://identifiers.org/kegg.reaction/', item.reactionId].join("")}})
        }
        if (item.koNumbersString.length != 0) {
            item.koNumbersString.map(ko => {
                references['rdf:li'].push({'@': {'rdf:resource': ['https://www.kegg.jp/entry/', ko].join("")}})
            })
        }
        if (item.ecNumbersString.length != 0) {
            item.ecNumbersString.map(ec => {
                references['rdf:li'].push({'@': {'rdf:resource': ['http://identifiers.org/ec-code/', ec].join("")}})
            })
        }
        if (taxonomyIds.length > 0) {
            taxonomyIds.map(id => {
                references['rdf:li'].push({'@': {'rdf:resource': ['https://www.uniprot.org/taxonomy/', id.id].join("")}})
            })
        }

        const reactionObject = {
            '@': {
                id: item.reactionId,
                reversible: item.reversible.toString(),
                name: item.abbreviation,
                metaid: item.reactionId
            },
            '#': {
                listOfReactants: {'#': MakeSpeciesReferenceObj(item.substrates)},
                listOfProducts: {'#': MakeSpeciesReferenceObj(item.products)},
                'annotation': {
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

            }
        }
        return reactionObject
    })
    return reactionObj
}


export default MakeReactionObjectList

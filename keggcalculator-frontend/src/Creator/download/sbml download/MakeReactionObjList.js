import React from "react";
import makeSpeciesReferenceObj from "./MakeSpeciesReferenceObj";

const makeReactionObjectList = (reactionsInSelectArray, reactionTaxonomies) => {

    const reactionObj = reactionsInSelectArray.map(reaction => {

        const taxonomyIds = reaction.taxonomyIds
        const rIdForRDF = '#' + reaction.reactionId
        const references = {'rdf:li': []}

        if (reaction.reactionId !== "" && !reaction.reactionId.startsWith("U")) {
            references['rdf:li'].push({'@': {'rdf:resource': 'http://identifiers.org/kegg.reaction/' + reaction.reactionId}})
        }
        if (reaction.koNumbersString.length != 0) {
            reaction.koNumbersString.map(ko => {
                references['rdf:li'].push({'@': {'rdf:resource': 'https://www.kegg.jp/entry/' + ko}})
            })
        }
        if (reaction.ecNumbersString.length != 0) {
            reaction.ecNumbersString.map(ec => {
                references['rdf:li'].push({'@': {'rdf:resource': 'http://identifiers.org/ec-code/' + ec}})
            })
        }
        if (taxonomyIds.length > 0) {
            taxonomyIds.map(id => {
                references['rdf:li'].push({'@': {'rdf:resource': 'https://www.uniprot.org/taxonomy/' + id.id}})
            })
        }
        if (reaction.biggId) {
            references['rdf:li'].push({'@': {'rdf:resource': 'http://identifiers.org/bigg.reaction/' + reaction.biggId}})
        }

        const annotationXml = {
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

        const xmlChildren = {
            listOfReactants: {'#': makeSpeciesReferenceObj(reaction.substrates)},
            listOfProducts: {'#': makeSpeciesReferenceObj(reaction.products)},
        }

        if (references['rdf:li'].length > 0) {
            xmlChildren.annotation = annotationXml
        }

        const reactionListObject = {
            '@': {
                id: reaction.reactionId,
                reversible: reaction.reversible.toString(),
                name: reaction.abbreviation,
                metaid: reaction.reactionId
            },
            '#': xmlChildren
        }
        return reactionListObject
    })
    return reactionObj
}


export default makeReactionObjectList

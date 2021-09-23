import React from "react";

const MakeSpeciesObjList = (speciesRaw) => {
    const speciesObj = speciesRaw.map(item => {

        // const idWithoutSpaces = [item.name.substring(0, item.name.length - 7).replace(/ /g, "_").replace(/^[\d\W_]*/,"")].join("")
        // const cIdForRDF = ['#',item.name.substring(0, item.name.length - 7).replace(/ /g, "_").replace(/^[\d\W_]*/,"")].join("")
        const cIdForRDF = ['#', item.id].join("")
        const keggCompoundURI = ['http://identifiers.org/kegg.compound/', item.keggId].join("")
        console.log("itemname " + item.name)
        const speciesObject = {
            '@': {
                id: item.id,
                name: item.name,
                metaid: item.id,
                compartment: item.compartment,
                hasOnlySubstanceUnits: item.hasOnlySubstanceUnits,
                boundaryCondition: item.boundaryCondition,
                constant: item.constant
            },
            '#': {
                'annotation': {
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

        return speciesObject
    })

    return speciesObj
}

export default MakeSpeciesObjList

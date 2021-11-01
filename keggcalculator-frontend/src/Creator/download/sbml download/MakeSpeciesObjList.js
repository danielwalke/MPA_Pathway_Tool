import React from "react";

const MakeSpeciesObjList = (speciesRaw) => {
    const speciesXmlList = speciesRaw.map(compound => {

        const cIdForRDF = '#' + compound.sbmlId
        const references = {'rdf:li': []}

        if (compound.keggId && !compound.keggId.startsWith("K")) {
            references['rdf:li'].push({'@': {'rdf:resource': 'http://identifiers.org/kegg.compound/' + compound.keggId}})
        }
        if (compound.biggId) {
            references['rdf:li'].push({'@': {'rdf:resource': 'http://identifiers.org/bigg.metabolite/' + compound.biggId}})
        }

        const annotationXml = {
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
                                        'rdf:Bag': {'#': references}
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        const speciesXml = {
            '@': {
                id: compound.sbmlId,
                name: compound.name,
                metaid: compound.sbmlId,
                compartment: compound.compartment,
                hasOnlySubstanceUnits: compound.hasOnlySubstanceUnits,
                boundaryCondition: compound.boundaryCondition,
                constant: compound.constant
            }
        }

        if (references['rdf:li'].length > 0) {
            speciesXml['#'] = {'annotation': annotationXml}
        }

        return speciesXml
    })

    // discard duplicates
    const speciesXmlStrList = Array.from(new Set(speciesXmlList.map(item => JSON.stringify(item))))
    const uniqueSpeciesXmlList = speciesXmlStrList.map(item => JSON.parse(item))

    return uniqueSpeciesXmlList
}

export default MakeSpeciesObjList

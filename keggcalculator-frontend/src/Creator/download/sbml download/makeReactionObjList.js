import React from "react";
import makeSpeciesReferenceObj from "./makeSpeciesReferenceObj";

function generateChildren(currentParentId, geneRuleArray) {

    const listOfIncludedGenes = []
    const geneObject = {'fbc:geneProductRef': [], 'fbc:and': [], 'fbc:or': []}

    for (const child of geneRuleArray) {
        if (child.parent === currentParentId) {
            if ("gene" in child) {
                listOfIncludedGenes.push(child.gene)
                geneObject['fbc:geneProductRef'].push({'@': {'fbc:geneProduct': child.gene}})
                continue
            }

            const childResults = generateChildren(child.id, geneRuleArray)
            geneObject[child.relation === "AND" ? 'fbc:and' : 'fbc:or'].push(childResults[0])
            listOfIncludedGenes.push(...childResults[1])
            continue
        }
    }

    for (const [key, value] of Object.entries(geneObject)) {
        if (value.length === 0) {
            delete geneObject[key]
        }
    }

    return [geneObject, listOfIncludedGenes]
}

function xmlGeneRuleFromArray(geneRuleArray) {

    const listOfIncludedGenes = []

    const parentObj = geneRuleArray.find(gene => gene.id === 1)
    const geneObject = {}

    if ("gene" in parentObj) {
        listOfIncludedGenes.push(parentObj.gene)
        return [{'fbc:geneProductRef': {'@': {'fbc:geneProduct': parentObj.gene}}}, listOfIncludedGenes]
    }

    const childResults = generateChildren(parentObj.id, geneRuleArray)
    listOfIncludedGenes.push(...childResults[1])

    if (parentObj.relation === "AND") {
        geneObject['fbc:and'] = childResults[0]
    } else {
        geneObject['fbc:or'] = childResults[0]
    }

    return [geneObject, listOfIncludedGenes]
}

export function generateRefObject(listOfRefs, rIdForRDF) {
    return({
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
                                        'rdf:Bag': {'#': listOfRefs}
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    )
}

export default function makeReactionObjectList(reactionsInSelectArray, reactionToParameterMap) {

    const genesInReactions = new Set()
    const reactionXmlList = reactionsInSelectArray.map(reaction => {

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

        const annotationXml = generateRefObject(references, rIdForRDF)

        const xmlChildren = {
            listOfReactants: {'#': makeSpeciesReferenceObj(reaction.substrates)},
            listOfProducts: {'#': makeSpeciesReferenceObj(reaction.products)},
        }

        if (references['rdf:li'].length > 0) {
            xmlChildren.annotation = annotationXml
        }

        if ("geneRule" in reaction && reaction.geneRule.length > 0) {
            const geneRuleObjects = xmlGeneRuleFromArray(reaction.geneRule)
            geneRuleObjects[1].forEach(gene => genesInReactions.add(gene))

            xmlChildren['fbc:geneProductAssociation'] = geneRuleObjects[0]
        }

        const reactionListObject = {
            '@': {
                id: reaction.reactionId,
                reversible: reaction.reversible.toString(),
                name: reaction.abbreviation,
                metaid: reaction.reactionId,
                'fbc:lowerFluxBound': reactionToParameterMap.get(reaction.reactionId).lowerBound,
                'fbc:upperFluxBound': reactionToParameterMap.get(reaction.reactionId).upperBound
            },
            '#': xmlChildren
        }
        return reactionListObject
    })
    return {reactionXmlList, genesInReactions}
}

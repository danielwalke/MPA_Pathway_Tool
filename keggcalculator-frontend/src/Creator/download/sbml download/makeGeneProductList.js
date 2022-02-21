import {generateRefObject} from "./makeReactionObjList";

export function makeGeneProductList(includedGeneSet, listOfGeneProducts) {
    const listOfGeneObjects = []


    for (const gene of includedGeneSet) {
        const geneObjectsWithId = listOfGeneProducts.find(geneObj => geneObj.id === gene)
        const geneProductObj = {
            '@': {
                'fbc:id': gene,
                'fbc:label': gene,
                'fbc:name': gene,
                'metaid': gene
            }
        }

        if (geneObjectsWithId) {
            const refObj = {
                'rdf:li': {
                    '@': {
                        'rdf:resource': 'http://identifiers.org/uniprot/' + geneObjectsWithId.uniprotAccession
                    }
                }
            }

            geneProductObj['#'] = {
                annotation: generateRefObject(refObj, `#${gene}`)
            }
        }

        listOfGeneObjects.push( geneProductObj)
    }

    return {'fbc:geneProduct': listOfGeneObjects}
}

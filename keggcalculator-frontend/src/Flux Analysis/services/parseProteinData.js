import {filterProteomeData} from "../../Creator/data-mapping/Sample";
import {getGenesFromReactions} from "../../Creator/upload/annotationModal/geneProductAnnotation/GeneAnnotation";

function getAllUniprotIds(reactionArray, listOfGeneProducts) {
    const listOfGeneIds = [...getGenesFromReactions(reactionArray)]
    const listOfIds = []
    listOfGeneProducts.forEach(geneProduct => {
        if (listOfGeneIds.includes(geneProduct.id) && geneProduct.uniprotAccession) {
            listOfIds.push(geneProduct.uniprotAccession)
        }
    })
    return listOfIds
}

export function parseProteinData(reactionArray, proteinState, listOfGeneProducts) {
    // const identifiers = getAllIdentifiersInNetwork(reactionArray)
    const uniProtIdentifiers = getAllUniprotIds(reactionArray, listOfGeneProducts)
    return filterProteomeData(Array.from(proteinState.proteinSet), uniProtIdentifiers, "uniprotAccession")
}

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
    const filteredProteinData = filterProteomeData(Array.from(proteinState.proteinSet), uniProtIdentifiers, "uniprotAccession")

    const proteinData = []
    for (const protein of filteredProteinData) {
        proteinData.push({
            name: protein.name,
            molecularMass: protein.molecularMass,
            uniprotAccession: protein.uniprotAccession,
            quantity: protein.quant
        })
    }
    return proteinData
}

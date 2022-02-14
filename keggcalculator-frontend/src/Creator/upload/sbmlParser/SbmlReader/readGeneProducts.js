import {generateGeneProduct} from "../../annotationModal/geneProductAnnotation/generateGeneProduct";


export function readGeneProducts(dispatch, sbml) {

    const uniprotLinkRegEx = /^http:\/\/identifiers.org\/uniprot/
    const listOfGeneProductsElement = sbml.getElementsByTagName("fbc:listOfGeneProducts")[0]

    if(!listOfGeneProductsElement) {
        return []
    }

    return listOfGeneProductsElement.children.map((geneProduct, index) => {
        const geneProductId = geneProduct.attributes["fbc:id"]
        const rdfList = geneProduct.getElementsByTagName("rdf:li")

        const uniProtObj = rdfList.find(listElement => uniprotLinkRegEx.test(listElement.attributes["rdf:resource"]))
        const uniProtId = uniProtObj ? uniProtObj.attributes["rdf:resource"].split(/\/uniprot\//)[1] : ""

        return generateGeneProduct(geneProductId, uniProtId, index)
    })
}



export function generateGeneProduct(id, uniprotAccession, index) {

    return {
        id: id,
        uniprotAccession: uniprotAccession,
        index: index
    }
}

export function getGeneProteinReactionRule(geneProductAssociation) {

    const geneRuleList = []

    if (geneProductAssociation.length === 0) {
        return geneRuleList
    }

    const initElement = geneProductAssociation[0].children[0]
    let idIndex = 1
    const parentId = 0

    traverseGeneRule(initElement, idIndex, parentId, geneRuleList)

    return geneRuleList
}

function traverseGeneRule(geneRuleEl, idIndex, parentId, geneRuleList) {

    const newParentId = idIndex

    if (geneRuleEl.name === "fbc:geneProductRef") {
        geneRuleList.push({id: idIndex, parent: parentId, gene: geneRuleEl.attributes['fbc:geneProduct']})
    } else {
        if (geneRuleEl.name === "fbc:or") {
            geneRuleList.push({id: idIndex, parent: parentId, relation: "OR"})
            idIndex++
        } else {
            geneRuleList.push({id: idIndex, parent: parentId, relation: "AND"})
            idIndex++
        }
        for(const child of geneRuleEl.children) {
            const diff = traverseGeneRule(child, idIndex, newParentId, geneRuleList)
            idIndex = diff + 1
        }
        idIndex-- // corrects for loop exit of AND and OR
    }

    return idIndex
}

export function extractListOfGenes(geneRuleSplitArray) {
    const geneRule = []
    const listOfGenes = []

    for (const entry of geneRuleSplitArray) {
        let geneRuleJson
        if (typeof entry === "string") {
            geneRuleJson = JSON.parse(entry)
        } else {
            geneRuleJson = entry
        }

        if ("gene" in geneRuleJson) {
            geneRule.push({id: geneRuleJson.id, parent: geneRuleJson.parent, gene: geneRuleJson.gene})
            const uniprotAccession = geneRuleJson.uniprotAccession ? geneRuleJson.uniprotAccession : ""
            listOfGenes.push(
                JSON.stringify({gene: geneRuleJson.gene, uniprotAccession: uniprotAccession}))
        } else if ("relation" in geneRuleJson) {
            geneRule.push({id: geneRuleJson.id, parent: geneRuleJson.parent, relation: geneRuleJson.relation})
        }
    }
    return {geneRule, listOfGenes};
}

export function convertGeneRuleToArray(geneRuleString) {

    const geneRuleSplitArray = geneRuleString.split(", ")
    const {geneRule, listOfGenes} = extractListOfGenes(geneRuleSplitArray);

    return [geneRule, listOfGenes]
}

export function extendGeneRule(geneRule, listOfGeneProducts) {
    const extendedGeneRule = []
    for (const entry of geneRule) {
        const newEntry = {...entry}
        if ("gene" in entry) {
            const geneProduct = listOfGeneProducts.find(geneProduct => geneProduct.id === entry.gene)
            newEntry.uniprotAccession = geneProduct ? geneProduct.uniprotAccession : ""
            extendedGeneRule.push(newEntry)
            continue
        }
        extendedGeneRule.push(newEntry)
    }
    return extendedGeneRule
}

export function convertGeneRuleToString(geneRule, listOfGeneProducts) {
    const extendedGeneRule = extendGeneRule(geneRule, listOfGeneProducts)
    return extendedGeneRule.map(entry => JSON.stringify(entry)).join(', ')
}

export function createAndDispatchListOfGeneProducts(setOfGeneProducts, dispatch) {
    const arrayOfGeneProducts = [...setOfGeneProducts]

    console.log(arrayOfGeneProducts)

    const newListOfGeneProducts = arrayOfGeneProducts.map((geneProduct, index) => {
        const {gene, uniprotAccession} = JSON.parse(geneProduct)

        return {id: gene, uniprotAccession: uniprotAccession, index: index}
    })

    dispatch({type: "SET_LIST_OF_GENE_PRODUCTS", payload: newListOfGeneProducts})
}



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

export const filterTaxon = (reactionTaxa, proteinTaxa) =>{
    const isTaxonMatching = false
    if(Object.keys(reactionTaxa).length === 0){
        console.log("skip tax filter")
        return true;
    }
    for(const taxon in reactionTaxa){
        const taxonomyRank = typeof reactionTaxa[taxon] === "undefined" ? "none" : reactionTaxa[taxon]
        const proteinTaxon = typeof proteinTaxa[taxonomyRank] === "undefined" ? "proteinNone" : proteinTaxa[taxonomyRank]
        if(proteinTaxon === taxon){
            return true;
        }
    }

    return isTaxonMatching;
}
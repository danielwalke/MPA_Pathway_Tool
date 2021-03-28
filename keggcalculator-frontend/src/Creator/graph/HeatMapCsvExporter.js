import {useSelector} from "react-redux";
import React from "react";
import {saveAs} from "file-saver";
import {filterTaxon} from "../main/TaxonomyFilter";

const HeatMapCsvExporter = () => {
    const proteinState = useSelector(state => state.mpaProteins)
    const generalState = useSelector(state => state.general)
    const graphState = useSelector(state => state.graph)

    const handleHeatMapExport = () => {
        const graphReactionObjects = graphState.data.nodes.filter(node => node.id.match(/\s[R,U][0-9][0-9][0-9][0-9][0-9]/))
        console.log(graphReactionObjects)
        const graphReactionSet = new Set()
        graphReactionObjects.map(node => graphReactionSet.add(node.id.substring(node.id.length-6, node.id.length)))
        const graphReactions = Array.from(graphReactionSet)
        console.log(generalState.reactionsInSelectArray)
        const reactions = generalState.reactionsInSelectArray.filter(reaction => graphReactions.includes(reaction.reactionId))
        console.log(reactions)
        let outputString = `reactions;KO-numbers;EC-numbers;Metaproteins;${proteinState.sampleNames.toString().replaceAll(",",";")}\n`
        reactions.map(reaction => {
            const proteins = Array.from(proteinState.proteinSet)
            const matchedMetaProteins = proteins.filter(protein => {
                let containsKoOrEc = false
                const koAndEcNumbers = Array.from(protein.koAndEcSet)
                loop:
                for (let iterator = 0; iterator < koAndEcNumbers.length; iterator++) {
                    // const number = koAndEcNumbers[iterator]
                    const proteinKoAndEc = koAndEcNumbers[iterator]
                    const isProteinKoInReaction = reaction.koNumbersString.includes(proteinKoAndEc)
                    const isProteinEcInReaction = reaction.ecNumbersString.includes(proteinKoAndEc)
                    if(filterTaxon(reaction.taxa, protein.taxa)&& (isProteinEcInReaction || isProteinKoInReaction)){
                        containsKoOrEc = true
                        break;
                    }
                    // for(const taxonomy of reaction.taxonomies){
                    //     const isProteinKoInReaction = reaction.koNumbersString.includes(proteinKoAndEc)
                    //     const isProteinEcInReaction = reaction.ecNumbersString.includes(proteinKoAndEc)
                    //     const isTaxonomyInProtein = protein.taxonomies.includes(taxonomy)
                    //     const isReactionTaxonomies = reaction.taxonomies.length === 1 && reaction.taxonomies.includes("")
                    //     if ((isTaxonomyInProtein && (isProteinEcInReaction || isProteinKoInReaction)) //matching taxonomies && ko or ec matching
                    //         || (isReactionTaxonomies && (isProteinEcInReaction || isProteinKoInReaction))) { //empty taxonomies && ko or ec matching
                    //         containsKoOrEc = true
                    //         break loop;
                    //     }
                    // }
                }
                return containsKoOrEc
            })
            const quantSums = proteinState.sampleNames.map(sample => 0)
            matchedMetaProteins.map((protein) => protein.quants.map((quant, index) => quantSums[index] += +quant))
            const matchedMetaProteinNames = matchedMetaProteins.map(protein => protein.name)
            outputString += `${reaction.reactionName.replaceAll(";","\t")};${reaction.koNumbersString};${reaction.ecNumbersString};${matchedMetaProteinNames};${quantSums.toString().replaceAll(",",";")}\n`
            console.log(outputString)
            return null
        })
        console.log(outputString.trim())
        let blob = new Blob(new Array(outputString.trim()), {type: "text/plain;charset=utf-8"});
        saveAs(blob, "Reactions.csv")
    }


    return (
        <div>
            <button className={"downloadButton"}
                    disabled={!graphState.data.nodes.length > 0 || !proteinState.proteinSet.size > 0}
                    onClick={() => handleHeatMapExport()}>Download Heatmap
            </button>
        </div>
    )
}

export default HeatMapCsvExporter
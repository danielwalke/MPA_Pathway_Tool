import {useDispatch, useSelector} from "react-redux";
import React from "react";
import {saveAs} from "file-saver";
import {filterTaxon} from "../../data-mapping/TaxonomyFilter";

const HeatMapCsvExporter = () => {
    const proteinState = useSelector(state => state.mpaProteins)
    const generalState = useSelector(state => state.general)
    const graphState = useSelector(state => state.graph)
    const dispatch = useDispatch()

    const handleHeatMapExport = () => {
        console.time("HeatMap")
        dispatch({type:"SETLOADING", payload: true})
        const graphReactionObjects = graphState.data.nodes.filter(node => node.id.match(/\s[R,U][0-9][0-9][0-9][0-9][0-9]/))
        const graphReactionSet = new Set()
        graphReactionObjects.map(node => graphReactionSet.add(node.id.substring(node.id.length-6, node.id.length)))
        const graphReactions = Array.from(graphReactionSet)
        const reactions = generalState.reactionsInSelectArray.filter(reaction => graphReactions.includes(reaction.reactionId))
        let outputString = `reactions;KO-numbers;EC-numbers;Metaproteins;${proteinState.sampleNames.toString().replaceAll(",",";")}\n`
        reactions.map(reaction => {
            const proteins = Array.from(proteinState.proteinSet)
            const matchedMetaProteins = proteins.filter(protein => {
                let containsKoOrEc = false
                const koAndEcNumbers = Array.from(protein.koAndEcSet)
                loop:
                for (let iterator = 0; iterator < koAndEcNumbers.length; iterator++) {
                    const proteinKoAndEc = koAndEcNumbers[iterator]
                    const isProteinKoInReaction = reaction.koNumbersString.includes(proteinKoAndEc)
                    const isProteinEcInReaction = reaction.ecNumbersString.includes(proteinKoAndEc)
                    if(filterTaxon(reaction.taxa, protein.taxa)&& (isProteinEcInReaction || isProteinKoInReaction)){
                        containsKoOrEc = true
                        break;
                    }
                }
                return containsKoOrEc
            })
            const quantSums = proteinState.sampleNames.map(sample => 0)
            matchedMetaProteins.map((protein) => protein.quants.map((quant, index) => quantSums[index] += +quant))
            const matchedMetaProteinNames = matchedMetaProteins.map(protein => protein.name)
            outputString += `${reaction.reactionName.replaceAll(";","\t")};${reaction.koNumbersString};${reaction.ecNumbersString};${matchedMetaProteinNames};${quantSums.toString().replaceAll(",",";")}\n`
            return null
        })

        let blob = new Blob(new Array(outputString.trim()), {type: "text/plain;charset=utf-8"});
        saveAs(blob, "Reactions.csv")
        dispatch({type:"SETLOADING", payload: false})
        console.timeEnd("HeatMap")
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
import {useDispatch, useSelector} from "react-redux";
import React from "react";
import {saveAs} from "file-saver";
import {filterTaxon} from "../../data-mapping/TaxonomyFilter";
import clonedeep from "lodash/cloneDeep"
import {ToolTipBig} from "../../main/user-interface/UserInterface";
import {getCurrentDateMinute} from "../../usefulFunctions/Date";

const HeatMapCsvExporter = (props) => {
    let proteinState = useSelector(state => state.mpaProteins)
    const {setDownloadedHeatMapData} = props
    const dispatch = useDispatch()

    const handleHeatMapExport = () => {
        dispatch({type: "SET_MAPPING_START_TIME", payload: getCurrentDateMinute()})
        dispatch({type: "SETLOADING", payload: true})
        setDownloadedHeatMapData(true) // boolean for checking whether mapping was performed
        proteinState = clonedeep(proteinState)
        const {generalState, graphState} = clonedeep(props)
        dispatch({type: "SETLOADING", payload: true})
        const graphReactionObjects = graphState.data.nodes.filter(node => node.id.match(/\s[R,U][0-9][0-9][0-9][0-9][0-9]/))
        const graphReactionSet = new Set()
        graphReactionObjects.map(node => graphReactionSet.add(node.id.substring(node.id.length - 6, node.id.length)))
        const graphReactions = Array.from(graphReactionSet)
        const reactions = generalState.reactionsInSelectArray.filter(reaction => graphReactions.includes(reaction.reactionId))
        let outputString = `reactions;KO-numbers;EC-numbers;Metaproteins;${proteinState.sampleNames.toString().replaceAll(",", ";")}\n`
        reactions.forEach(reaction => {
            const proteins = Array.from(proteinState.proteinSet)
            const matchedMetaProteins = proteins.filter(protein => {
                let containsKoOrEc = false
                const koAndEcNumbers = Array.from(protein.koAndEcSet)
                for (let iterator = 0; iterator < koAndEcNumbers.length; iterator++) {
                    const proteinKoAndEc = koAndEcNumbers[iterator]
                    const isProteinKoInReaction = reaction.koNumbersString.includes(proteinKoAndEc)
                    const isProteinEcInReaction = reaction.ecNumbersString.includes(proteinKoAndEc)
                    if (filterTaxon(reaction.taxa, protein.taxa) && (isProteinEcInReaction || isProteinKoInReaction)) {
                        containsKoOrEc = true
                        break;
                    }
                }
                return containsKoOrEc
            })
            const quantSums = proteinState.sampleNames.map(sample => 0)
            matchedMetaProteins.map((protein) => protein.quants.map((quant, index) => quantSums[index] += +quant))
            const matchedMetaProteinNames = matchedMetaProteins.map(protein => protein.name)
            let metaProteinsString = ""
            matchedMetaProteinNames.forEach(protein => metaProteinsString += protein.concat("|"))
            outputString += `${reaction.reactionName.replaceAll(";", "\t")};${reaction.koNumbersString};${reaction.ecNumbersString};${metaProteinsString};${quantSums.toString().replaceAll(",", ";")}\n`
        })
        let blob = new Blob(new Array(outputString.trim()), {type: "text/plain;charset=utf-8"});
        saveAs(blob, "Reactions.csv")
        dispatch({type: "SETLOADING", payload: false})
        dispatch({type: "ADD_DATA_DOWNLOAD_TO_AUDIT_TRAIL"})
        dispatch({type: "SET_MAPPING_END_TIME", payload: getCurrentDateMinute()})
    }


    return (
        <div>
            <ToolTipBig title={"Click for downloading mapped data as CSV"} placement={"right"}>
                <button className={"downloadButton"}
                        disabled={!props.graphState.data.nodes.length > 0 || !proteinState.proteinSet.size > 0}
                        onClick={() => handleHeatMapExport()}>Download Data
                </button>
            </ToolTipBig>
        </div>
    )
}

export default HeatMapCsvExporter

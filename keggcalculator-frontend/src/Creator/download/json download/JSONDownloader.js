import React from "react";
import {useDispatch} from "react-redux";
import {saveAs} from "file-saver";
import clonedeep from "lodash/cloneDeep"
import {ToolTipBig} from "../../main/user-interface/UserInterface";
import {extendGeneRule} from "../../upload/annotationModal/geneProductAnnotation/generateGeneProduct";

function extendGeneRules(reactionArray, listOfGeneProducts) {
    return reactionArray.map(reaction => {
        if ("geneRule" in reaction) {
            const newGeneRule = extendGeneRule(reaction.geneRule, listOfGeneProducts)
            reaction.geneRule = newGeneRule
        } else {
            reaction.geneRule = []
        }

        return reaction
    })
}

const JSONDownloader = (props) => {

    const dispatch = useDispatch()
    const handleJsonDownload = () => {
        try {
            const {generalState} = clonedeep(props)
            const outputJson = extendGeneRules(generalState.reactionsInSelectArray, generalState.listOfGeneProducts)

            let blob = new Blob(
                new Array(JSON.stringify(outputJson, null, 2)), {type: "text/plain;charset=utf-8"});
            saveAs(blob, "ModuleGraph.json")
            dispatch({type: "ADD_JSON_DOWNLOAD_TO_AUDIT_TRAIL"})
        } catch (e) {
            console.log(e)
            window.alert("make a change")
        }
    }

    return (
        <div>
            <ToolTipBig title={" downloading the pathway as JSON"} placement={"right"}>
                <button disabled={!props.graphState.data.nodes.length > 0} className={"download-button"}
                        onClick={handleJsonDownload}>Download Json
                </button>
            </ToolTipBig>
        </div>
    )
}

export default JSONDownloader

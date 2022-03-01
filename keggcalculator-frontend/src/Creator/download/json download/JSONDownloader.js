import React from "react";
import {useDispatch} from "react-redux";
import {saveAs} from "file-saver";
import clonedeep from "lodash/cloneDeep"
import {ToolTipBig} from "../../main/user-interface/UserInterface";
import {extendGeneRule} from "../../upload/annotationModal/geneProductAnnotation/generateGeneProduct";
import {updateCoordinatesOfObject} from "../DownloadFunctions";

function extendGeneRuleForReaction(reaction, listOfGeneProducts) {
    if ("geneRule" in reaction) {
        reaction.geneRule = extendGeneRule(reaction.geneRule, listOfGeneProducts)
    } else {
        reaction.geneRule = []
    }

    return reaction
}

function extendGeneRules(reactionArray, listOfGeneProducts) {
    return reactionArray.map(reaction => {
        return extendGeneRuleForReaction(reaction, listOfGeneProducts)
    })
}

function updateJson(generalState, graphState) {

    return generalState.reactionsInSelectArray.map(reaction => {
        updateCoordinatesOfObject(reaction, 'reactionName', graphState.data.nodes)

        for (const substrate of reaction.substrates) {
            updateCoordinatesOfObject(substrate, 'name', graphState.data.nodes)
        }
        for (const product of reaction.products) {
            updateCoordinatesOfObject(product, 'name', graphState.data.nodes)
        }

        return extendGeneRuleForReaction(reaction, generalState.listOfGeneProducts)
    })
}

const JSONDownloader = (props) => {

    const dispatch = useDispatch()
    const handleJsonDownload = () => {
        try {
            const {generalState, graphState} = clonedeep(props)
            const outputJson = updateJson(generalState, graphState)

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

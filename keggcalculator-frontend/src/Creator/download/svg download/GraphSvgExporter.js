import React from "react";
import {saveAs} from "file-saver";
import * as d3 from "d3";
import {useDispatch} from "react-redux";
import {ToolTipBig} from "../../main/user-interface/UserInterface";

const GraphSvgExporter = (props) => {
    const dispatch = useDispatch()
    const fileName = "graph.svg"

    const download = (e) => {
        e.preventDefault()
        const nodeList = d3.selectAll("svg")._groups[0]
        let graph
        for (let i = 0; i < nodeList.length; i++) {
            const node = nodeList[i].outerHTML
            if (node.toString().includes("graph")) {
                graph = nodeList[i]
            }
        }
        let serializer = new XMLSerializer()
        const svg = serializer.serializeToString(graph)
        let blob = new Blob(new Array(svg), {type: "text/plain;charset=utf-8"});
        dispatch({type: "ADD_SVG_DOWNLOAD_TO_AUDIT_TRAIL"})
        saveAs(blob, fileName)
    }

    return (
        <div>
            <ToolTipBig title={"Click for downloading the pathway as SVG"} placement={"right"}>
                <button className={"download-button"} disabled={props.graphState.data.nodes.length < 1}
                        onClick={(e) => download(e)}>download svg
                </button>
            </ToolTipBig>
        </div>
    )
}

export default GraphSvgExporter

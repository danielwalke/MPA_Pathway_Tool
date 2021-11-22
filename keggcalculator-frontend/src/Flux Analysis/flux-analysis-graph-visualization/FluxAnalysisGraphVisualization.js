import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Graph} from "react-d3-graph";
import {handleNodePositionChange} from "../../Creator/graph/graph visualization/GraphVisualization";
import clonedeep from "lodash/cloneDeep";
import {getKeggId, resetFluxData} from "../services/CreateFbaGraphData";

const findReactionObj = (adjacentReactionNode, generalState) => {
    const reactionNodeId = getKeggId(adjacentReactionNode)
    return (generalState.reactionsInSelectArray.find(reactionObj => reactionNodeId === reactionObj.reactionId))
}

export default function FluxAnalysisGraphVisualization() {

    const [graphEquality, setGraphEquality] = useState(false)

    const graphState = useSelector(state => state.graph)
    const fluxState = useSelector(state => state.fluxAnalysis)
    const generalState = useSelector(state => state.general)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch({type: "SET_FLUX_GRAPH", payload: clonedeep(graphState.data)})
    }, [])

    useEffect(() => {
        if(fluxState.data.nodes.length > 0) {
            const graphEquality = checkGraphEquality(graphState.data.nodes, fluxState.data.nodes)
            setGraphEquality(graphEquality)
        }
    }, [fluxState.data])

    const onClickNode = (nodeId) => {
        const id = getKeggId(nodeId)
        let nodeType = "reaction"
        let reactionObject
        let compoundObject
        let adjacentLinks
        let dataObject

        if (id.startsWith("R") || id.startsWith("U")) {
            reactionObject = findReactionObj(nodeId, generalState)
            dataObject = reactionObject
        } else {
            // find the corresponding compound object from reactionsInSelectArray, to extract compound Information
            nodeType = "compound"
            adjacentLinks = graphState.data.links.find(link => link.source === nodeId)
            if(adjacentLinks) {
                reactionObject = findReactionObj(adjacentLinks.target, generalState)
                compoundObject = reactionObject.substrates.find(sub => getKeggId(sub.name) === id)
            }
            if (!adjacentLinks || !compoundObject)  {
                adjacentLinks = graphState.data.links.find(link => link.target === nodeId)
                if(adjacentLinks) {
                    reactionObject = findReactionObj(adjacentLinks.source, generalState)
                    compoundObject = reactionObject.products.find(prod => getKeggId(prod.name) === id)
                } else {
                    console.log("something went wrong")
                }
            }
        dataObject = compoundObject
        }

        dataObject.type = nodeType

        dispatch({type: "SHOW_GRAPH_MODAL", payload: true})
        dispatch({type: "SET_GRAPH_MODAl_INPUT", payload: dataObject})

        console.log(dataObject)
    }

    const labelCallbackNodes = (node) => {
        if (typeof graphState.abbreviationsObject[`${node.id}`] !== "undefined") {
            return graphState.abbreviationsObject[`${node.id}`]
        } else if (node.id.includes("__")) {
            const idEntries = node.id.split("__")
            return idEntries[1]
        } else {
            return node.id
        }
    }

    const checkGraphEquality = (creatorGraphNodes, fluxGraphNodes) => {
        for (let index = 0; index < creatorGraphNodes.length; index++) {

            if (creatorGraphNodes[index].x !== fluxGraphNodes[index].x ||
                creatorGraphNodes[index].y !== fluxGraphNodes[index].y) {
                console.log("false")
                return false
                break
            }
        }
        return true
    }

    const myConfig = {
        height: 0.75 * window.innerHeight,
        width: 0.95 * window.innerWidth,
        nodeHighlightBehavior: true,
        directed: true,
        // initialZoom: graphState.currentZoom,
        node: {
            size: graphState.nodeSize,
            highlightStrokeColor: "blue",
            labelProperty: labelCallbackNodes
        },
        link: {
            highlightColor: "lightblue",
            strokeWidth: 2,
            markerHeight: 6,
            markerWidth: 6
        },
        d3: {
            gravity: -80,
            linkStrength: 1.2,
            disableLinkForce: true,
        }
    };

    if (fluxState.data.nodes.length > 0 && graphEquality) {
        return (
            <div >
                <Graph
                    bottom={0}
                    id="graph"
                    data={fluxState.data}
                    config={myConfig}
                    onNodePositionChange={(id, x, y) => handleNodePositionChange(fluxState, x, y, id, dispatch)}
                    onClickNode={(nodeId) => onClickNode(nodeId)}
                    // onZoomChange={(prevZoom, newZoom) => handleZoomChange(dispatch, prevZoom, newZoom)}
                />
            </div>
        );
    }
    return (
        <div>Upload or create a network</div>
    )
}

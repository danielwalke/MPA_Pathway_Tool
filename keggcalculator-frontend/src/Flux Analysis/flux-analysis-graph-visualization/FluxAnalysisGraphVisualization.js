import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Graph} from "react-d3-graph";
import {isColliding} from "../../Creator/graph/collision/CollisionCheck";
import {handleNodePositionChange} from "../../Creator/graph/graph visualization/GraphVisualization";

export default function FluxAnalysisGraphVisualization() {

    const graphState = useSelector(state => state.graph)
    const fluxState = useSelector(state => state.fluxAnalysis)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch({type: "SET_FLUX_GRAPH", payload: graphState.data})
        console.log(graphState.data)
    }, [])

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

    const myConfig = {
        height: 0.75 * window.innerHeight,
        width: 0.95 * window.innerWidth,
        nodeHighlightBehavior: true,
        directed: true,
        node: {
            size: graphState.nodeSize,
            highlightStrokeColor: "blue",
            labelProperty: labelCallbackNodes
        },
        link: {
            highlightColor: "lightblue",
            strokeWidth: 2

        },
        d3: {
            gravity: -80,
            linkStrength: 1.2,
            disableLinkForce: true
        }
    };

    if (fluxState.data.nodes.length > 0) {
        return (
            <div>
                <Graph
                    bottom={0}
                    id="graph"
                    data={fluxState.data}
                    config={myConfig}
                    onNodePositionChange={(id, x, y) => handleNodePositionChange(fluxState, x, y, id, dispatch)}
                />
            </div>
        );
    }
    return (
        <div>Upload or create a network</div>
    )
}

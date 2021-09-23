import React from 'react';
import {Graph} from "react-d3-graph";
import {useSelector} from "react-redux";

const FBA = () => {
    const graphState = useSelector(state => state.graph)
    React.useEffect(() => {
        console.log(graphState.data)
    })
    const myConfig = {
        height: 0.75 * window.innerHeight,
        width: 0.95 * window.innerWidth,
        nodeHighlightBehavior: true,
        directed: true,
        node: {
            size: graphState.nodeSize,
            highlightStrokeColor: "blue",
        },
        link: {
            highlightColor: "lightblue",
            strokeWidth: 2

        },
        d3: {
            gravity: -80,
            linkStrength: 1.2,
            disableLinkForce: graphState.isForceDisabled
        }
    };
    if (graphState.data.nodes.length > 0) {
        return (
            <div>
                <Graph
                    bottom={0}
                    id="graph"
                    data={graphState.data}
                    config={myConfig}

                />
            </div>
        );
    }
    return (
        <div>lol</div>
    )


};

export default FBA;

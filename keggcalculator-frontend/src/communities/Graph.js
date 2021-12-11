import React, {useEffect, useState} from 'react';
import {Graph} from "react-d3-graph";
import {getNodes} from "./Circle";
import {useDispatch, useSelector} from "react-redux";

const GraphVisualizer = (props) => {

    const [data, setData] = useState({})
    const dispatch=useDispatch()
    const communityState = useSelector(state => state.communities)

    useEffect(()=>{
        setData(props.data)
    }, [props])


    const myConfig = {
        height: 0.75 * window.innerHeight,
        width: 0.95 * window.innerWidth,
        nodeHighlightBehavior: true,
        directed: false,
        node: {
            highlightStrokeColor: "blue",
            freezeAllDragEvents: true
        },
        link: {
            highlightColor: "lightblue",
            freezeAllDragEvents: true,
            strokeWidth: 2

        },
        d3: {
            disableLinkForce: true
        },
        freezeAllDragEvents: true,
        staticGraph: true
    };

    const onRightClickNode = (e, nodeId) => {
        e.preventDefault()
        setData({})
        console.log(data.nodes)
        console.log([...communityState.exclusionNodeList, +nodeId])
        dispatch({type: "ADD_NODE_TO_EXCLUSION_LIST", payload: +nodeId})
        const {nodes, links} =  getNodes(200, communityState.communityNodes-1, [...communityState.exclusionNodeList, +nodeId])
        console.log(nodes)
        setTimeout(()=>setData({
            nodes: nodes,
            links: links
        }), 200
        )

    }


    return (
        <div>
            {data.nodes && data.nodes.length > 0 && <Graph
                bottom={0}
                id="graph"
                data={data}
                config={myConfig}
                freezeAllDragEvents={true}
                onRightClickNode={onRightClickNode}
            />}
        </div>
    );
};

export default GraphVisualizer;

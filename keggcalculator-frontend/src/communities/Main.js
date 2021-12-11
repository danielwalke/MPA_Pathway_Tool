import React, {useEffect, useState} from 'react';
import {getNodes} from "./Circle";
import GraphVisualizer from "./Graph";
import {useDispatch, useSelector} from "react-redux";

const Main = () => {
    const [data, setData] = useState({})
    const dispatch = useDispatch()
    const communityState = useSelector(state => state.communities)

    const addCommunityNode = async (e) =>{
        e.preventDefault()
        dispatch({type:"SET_NUMBER_OF_COMMUNITY_NODES", payload: communityState.communityNodes+1})
        await setData({})
        const {nodes, links} =  getNodes(200, communityState.communityNodes, communityState.exclusionNodeList)
        await setData({
            nodes: nodes,
            links: links
        })
    }


    return (
        <div>
            <button className={"downloadButton"} onClick={addCommunityNode}>Add</button>
            <GraphVisualizer data={data}/>
        </div>
    );
};

export default Main;

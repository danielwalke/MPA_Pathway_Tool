import React from 'react';
import {useDispatch, useSelector} from "react-redux";

const getAlignedNodes = (graphState)=>{
    return graphState.data.nodes.map(node => {
        node.x = Math.round(node.x/50)*50
        node.y = Math.round(node.y/50)*50
        return node
    })
}

const handleAlign = async(graphState,dispatch) => {
       await  dispatch({type:"SETDATA", payload: {nodes:[], links:graphState.data.links}})
       const alignedNodes = getAlignedNodes(graphState)
        const data = {nodes: alignedNodes, links: graphState.data.links}
        await dispatch({type:"SETDATA", payload: data})


}

const Align = () => {
    const graphState = useSelector(state=> state.graph)
    const dispatch = useDispatch()
    return (
        <div>
           <button className={"downloadButton"} onClick={()=> handleAlign(graphState, dispatch)}>align</button>
        </div>
    );
};

export default Align;
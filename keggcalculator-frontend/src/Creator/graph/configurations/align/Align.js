import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {ToolTipBig} from "../../../main/user-interface/UserInterface";

const getAlignedNodes = (graphState) => {
    return graphState.data.nodes.map(node => {
        node.x = Math.round(node.x / 50) * 50
        node.y = Math.round(node.y / 50) * 50
        return node
    })
}

const handleAlign = async (graphState, dispatch) => {
    await dispatch({type: "SETDATA", payload: {nodes: [], links: graphState.data.links}})
    const alignedNodes = getAlignedNodes(graphState)
    const data = {nodes: alignedNodes, links: graphState.data.links}
    await dispatch({type: "SETDATA", payload: data})
    dispatch({type: "ADD_ALIGN_TO_AUDIT_TRAIL"})


}

const Align = () => {
    const graphState = useSelector(state => state.graph)
    const dispatch = useDispatch()
    return (
        <div>
            <ToolTipBig title={"Click for auto-aligning all nodes"} placement={"right"}>
                <button className={"download-button"} onClick={() => handleAlign(graphState, dispatch)}>align</button>
            </ToolTipBig>
        </div>
    );
};

export default Align;

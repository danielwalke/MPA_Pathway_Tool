import React, {useState} from 'react';
import {useStyles} from "../../../ModalStyles/ModalStyles";
import {TextField} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";

const NodeModificationBody = () => {
    const classes = useStyles()
    const graphState = useSelector(state=> state.graph)
    const dispatch = useDispatch()
    const [matchingString, setMatchingString] = useState("")
    const [filteredColor, setFilteredColor] = useState("")

    const changeNodeSize = (e) =>{
        dispatch({type:"SET_NODE_SIZE", payload:e.target.value})
    }

    const changeCompoundNodeColor= (e) =>{
        dispatch({type:"SET_COMPOUND_NODE_COLOR", payload:e.target.value})
        graphState.data.nodes.forEach(node => {
            if(node.symbolType === "circle"){
                node.color = e.target.value
            }
        })
        dispatch({type:"SETDATA", payload: graphState.data})
    }

    const filteredColorChange= (e) =>{
        setFilteredColor(e.target.value)
        graphState.data.nodes.forEach(node => {
            if(node.symbolType === "circle" && node.id.match(matchingString)){
                node.color = e.target.value
            }
        })
        dispatch({type:"SETDATA", payload: graphState.data})
    }

    return (
        <div className={classes.paper} style={{width:"60vw", display:"grid", gap:"2px"}}>
            <div>node size: <TextField value={graphState.nodeSize} onChange={changeNodeSize}/></div>
            <div>compound-nodes-color: <TextField value={graphState.compoundNodeColor} onChange={changeCompoundNodeColor}/></div>
            <div style={{border:"2px solid black"}}><h3>Color-Filter</h3>
            <div>matching string: <TextField value={matchingString} onChange={(e)=>setMatchingString(e.target.value)}/></div>
            <div>filtered Color Change: <TextField value={filteredColor} onChange={filteredColorChange}/></div>
            </div>
        </div>
    );
};

export default NodeModificationBody;
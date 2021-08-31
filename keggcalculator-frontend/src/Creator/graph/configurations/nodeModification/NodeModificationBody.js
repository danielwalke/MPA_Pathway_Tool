import React, {useState} from 'react';
import {useStyles} from "../../../ModalStyles/ModalStyles";
import {TextField} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {ToolTipBig} from "../../../main/user-interface/UserInterface";

const NodeModificationBody = () => {
    const classes = useStyles()
    const graphState = useSelector(state=> state.graph)
    const dispatch = useDispatch()
    const [matchingString, setMatchingString] = useState("")
    const [filteredColor, setFilteredColor] = useState("")

    const changeNodeSize = (e) =>{
        dispatch({type:"SET_NODE_SIZE", payload:e.target.value})
        dispatch({type:"ADD_NODE_MODIFICATION_TO_AUDIT_TRAIL", payload: {
                compoundSize: e.target.value
            }})
    }

    const changeCompoundNodeColor= (e) =>{
        dispatch({type:"SET_COMPOUND_NODE_COLOR", payload:e.target.value})
        graphState.data.nodes.forEach(node => {
            if(node.symbolType === "circle"){
                node.color = e.target.value
            }
        })
        dispatch({type:"SETDATA", payload: graphState.data})
        dispatch({type:"ADD_NODE_MODIFICATION_TO_AUDIT_TRAIL", payload: {
            compoundColor: e.target.value
        }})
    }

    const filteredColorChange= (e) =>{
        setFilteredColor(e.target.value)
        graphState.data.nodes.forEach(node => {
            if(node.symbolType === "circle" && node.id.match(matchingString)){
                node.color = e.target.value
                dispatch({type:"ADD_NODE_MODIFICATION_TO_AUDIT_TRAIL", payload: {
                        [node.id]: e.target.value
                    }})
            }
        })
        dispatch({type:"SETDATA", payload: graphState.data})
    }

    return (
        <div className={classes.paper} style={{width:"60vw", display:"grid", gap:"2px"}}>
            <div>node size:             <ToolTipBig title={"Enter a number for changing node size"} placement={"right"}>
                <TextField value={graphState.nodeSize} onChange={changeNodeSize}/>
            </ToolTipBig></div>
            <div>compound-nodes-color:
                <ToolTipBig title={"Enter a valid color for changing color for nodes"} placement={"right"}>
                    <TextField value={graphState.compoundNodeColor} onChange={changeCompoundNodeColor}/>
                </ToolTipBig></div>
            <div style={{border:"2px solid black"}}><h3>Color-Filter</h3>
            <div>matching string: <ToolTipBig title={"Enter a valid string or regular expression to filter nodes"} placement={"right"}>
                <TextField value={matchingString} onChange={(e)=>setMatchingString(e.target.value)}/>
            </ToolTipBig></div>
            <div>filtered Color Change: <ToolTipBig title={"Enter a valid color for changing color for filtered nodes"} placement={"right"}>
                <TextField value={filteredColor} onChange={filteredColorChange}/>
            </ToolTipBig></div>
            </div>
        </div>
    );
};

export default NodeModificationBody;

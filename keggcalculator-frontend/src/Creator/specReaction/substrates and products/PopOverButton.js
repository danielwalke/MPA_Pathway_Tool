import SyncAltIcon from "@material-ui/icons/SyncAlt";
import React from "react";
import {useDispatch} from "react-redux";
import {ToolTipBig} from "../../main/user-interface/UserInterface";

const PopOverButton =(props)=>{
    const dispatch = useDispatch()

    return(
        <div>
            <ToolTipBig title={props.isText? "Select a metabolite from list" : "Type in your own metabolite"} placement={"left"}>
            <button
                className={"notFoundButton"} style={{width:"90%"}}
                onClick={() => dispatch({type: props.dispatchType})}>    <SyncAltIcon/></button>
            </ToolTipBig>
        </div>
    )
}

export default PopOverButton

import TextField from "@material-ui/core/TextField";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import "./SpecKoAndEc.css"
import {ToolTipBig} from "../../main/user-interface/UserInterface";

const SpecKoEc = () => {
    const dispatch = useDispatch()
    const specReactionState = useSelector(state => state.specificReaction)
    return (
        <div className={"koAndEcContainer"}>
            <ToolTipBig title={"Type in a K number"} placement={"left"}>
                <TextField
                    className={"ko"}
                    size={"small"}
                    label="K-number"
                    placeholder={"K00000"}
                    variant="outlined"
                    id="KO"
                    onChange={(e) => dispatch({
                        type: "SETKONUMBER",
                        payload: e.target.value.toString()
                    })}
                /></ToolTipBig>
            <ToolTipBig title={"Add K number to reaction"} placement={"right"}>
                <button name={"addKo"}
                        className={"addKo"}
                        onClick={(e) => {
                            e.preventDefault()
                            dispatch({type: "ADDKONUMBER", payload: specReactionState.specKoNumber})
                        }}>Add K- number
                </button>
            </ToolTipBig>
            <ToolTipBig title={"Type in an EC number"} placement={"left"}><TextField
                size={"small"}
                className={"ec"}
                label="EC- number"
                placeholder={"1.1.1.1"}
                variant="outlined"
                id="EC"
                onChange={(e) => dispatch({
                    type: "SETECNUMBER",
                    payload: e.target.value.toString()
                })}
            /></ToolTipBig>
            <ToolTipBig title={"Add EC number to reaction"} placement={"right"}>
                <button name={"addEc"}
                        className={"addEc"}
                        onClick={(e) => {
                            e.preventDefault()
                            dispatch({
                                type: "SETECNUMBERS",
                                payload: [...specReactionState.ecNumbers, specReactionState.specEcNumber]
                            })
                        }}>Add EC- number
                </button>
            </ToolTipBig>
        </div>
    )
}

export default SpecKoEc

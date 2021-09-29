import TextField from "@material-ui/core/TextField";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import "./SpecKoAndEc.css"

const SpecKoEc = () => {
    const dispatch = useDispatch()
    const specReactionState = useSelector(state => state.specificReaction)
    return (
        <div className={"koAndEcContainer"}>
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
            />
            <button name={"addKo"}
                    className={"addKo"}
                    onClick={(e) => {
                        e.preventDefault()
                        dispatch({type: "ADDKONUMBER", payload: specReactionState.specKoNumber})
                    }}>Add K- number</button>
            <TextField
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
            />
            <button name={"addEc"}
                    className={"addEc"}
                    onClick={(e) => {
                        e.preventDefault()
                        dispatch({
                            type: "SETECNUMBERS",
                            payload: [...specReactionState.ecNumbers, specReactionState.specEcNumber]
                        })
                    }}>Add EC- number</button>
        </div>
    )
}

export default SpecKoEc
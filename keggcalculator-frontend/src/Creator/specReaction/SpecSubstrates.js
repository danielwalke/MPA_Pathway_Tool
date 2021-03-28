import Field from "./Field";
import TextField from "@material-ui/core/TextField";
import {handleAddSubstrate} from "./SpecReactionFunctions";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import "./SpecSubstrate.css"
import {isRequestValid} from "../request/RequestValidation";

const SpecSubstrates = () => {
    const state = useSelector(state => state.specificReaction)
    const dispatch = useDispatch()
    return (
        <div className={"substrateContainerSpec"}>
            <Field
                className={"substrate"}
                dispatchType={"SETSPECIFICSUBSTRATE"}
                id={"substrate"}
                dispatchTypeOptions={"SETSPECIFICOPTIONSSUBSTRATE"}
                options={state.specOptionsSubstrate}
                compound={state.specSubstrate}/>
            <TextField
                size={"small"}
                className={"substrateSc"}
                defaultValue={0}
                id="filled-number"
                label="SC"
                type="number"
                onChange={(e) => dispatch({
                    type: "SETSPECIFICSUBSTRATECOEFF",
                    payload: e.target.value.toString()
                })
                }
                InputLabelProps={{
                    shrink: true,
                }}
                variant="filled"
            />
            <button disabled={!isRequestValid(state.specSubstrate)}
                className={"addSubstrate"}
                    onClick={(e) => handleAddSubstrate(e, dispatch, state)}>Add Substrate</button>
        </div>
    )
}

export default SpecSubstrates
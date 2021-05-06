import Field from "./Field";
import TextField from "@material-ui/core/TextField";
import {handleAddSubstrate} from "./SpecReactionFunctions";
import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import "./SpecSubstrate.css"
import PopOverButton from "./PopOverButton";
import {getCompoundId} from "../upload/sbmlParser/SbmlReader/ReaderFunctions";



const SpecSubstrates = (props) => {
    const state = useSelector(state => state.specificReaction)

    const dispatch = useDispatch()

    return (
        <div className={"substrateContainerSpec"}>
            {state.isSpecificCompoundInputSubstrate ?
                <TextField className={"substrate"} size={"small"} value={state.specSubstrate}
                           onChange={e => dispatch({type: "SETSPECIFICSUBSTRATE", payload: e.target.value})}
                           type={"text"}
                           label={"substrate"} id={"spec substrate"}/> :
                <Field
                    className={"substrate"}
                    dispatchType={"SETSPECIFICSUBSTRATE"}
                    id={"substrate"}
                    dispatchTypeOptions={"SETSPECIFICOPTIONSSUBSTRATE"}
                    options={state.specOptionsSubstrate}
                    compound={state.specSubstrate}/>
            }
            <PopOverButton text={" not found? :-(\n" +
            "                Don't worry! Click here :)"} className={"notFoundButton"}  dispatchType={"SWITCHISSPECCOMPOUNDINPUTSUBSTRATE"}/>
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
            {/*disabled={!isRequestValid(state.specSubstrate)}*/}
            <button className={"addSubstrate"} disabled={!state.specSubstrate.length > 0}
                    onClick={(e) => handleAddSubstrate(e, dispatch, state, props.index)}>Add Substrate
            </button>
        </div>
    )
}

export default SpecSubstrates
import Field from "../Field";
import TextField from "@material-ui/core/TextField";
import {handleAddSubstrate} from "../../functions/SpecReactionFunctions";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import "./SpecSubstrate.css"
import PopOverButton from "../PopOverButton";
import {ToolTipBig} from "../../../main/user-interface/UserInterface";


const SpecSubstrates = (props) => {
    const state = useSelector(state => state.specificReaction)

    const dispatch = useDispatch()

    return (
        <div className={"substrateContainerSpec"}>
            {state.isSpecificCompoundInputSubstrate ?
                <ToolTipBig title={"Type in a substrate name"} placement={"left"}>
                    <TextField className={"substrate"} size={"small"} value={state.specSubstrate}
                               onChange={e => dispatch({type: "SETSPECIFICSUBSTRATE", payload: e.target.value})}
                               type={"text"}
                               label={"substrate"} id={"spec substrate"}/>
                </ToolTipBig> :
                <Field
                    className={"substrate"}
                    dispatchType={"SETSPECIFICSUBSTRATE"}
                    id={"substrate"}
                    dispatchTypeOptions={"SETSPECIFICOPTIONSSUBSTRATE"}
                    options={state.specOptionsSubstrate}
                    compound={state.specSubstrate}/>
            }
            <PopOverButton text={" not found? :-(\n" +
            "                Don't worry! Click here :)"}
                           dispatchType={"SWITCHISSPECCOMPOUNDINPUTSUBSTRATE"}
                           isText={state.isSpecificCompoundInputSubstrate}/>
            <ToolTipBig title={"Type in a stoichiometric coefficient"} placement={"left"}><TextField
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
            /></ToolTipBig>
            {/*disabled={!isRequestValid(state.specSubstrate)}*/}
            <ToolTipBig title={"Submit the substrate with chosen coefficient"} placement={"right"}>
                <button className={"addSubstrate"}
                        onClick={(e) => handleAddSubstrate(e, dispatch, state, props.index)}>Add Substrate
                </button>
            </ToolTipBig>
        </div>
    )
}

export default SpecSubstrates

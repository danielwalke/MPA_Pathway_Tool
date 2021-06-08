import React from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import {getCompName} from "./CompName";
import {useDispatch, useSelector} from "react-redux";
import SubmitSubstrate from "./SubmitSubstrate";
import "./Substrate.css"
import "../../../main/Buttons.css"

const Substrate = () => {
    const state = useSelector(state => state.keggReaction)
    const dispatch = useDispatch()

    const handleAutoChange = (e) => {
        const {value} = e.target
        dispatch({type: "SETSUBSTRATE", payload: value})
        if (state.substrate) {
            dispatch({
                type: "SETOPTIONS",
                payload: getCompName(state.compMap).filter(compound => compound.toLowerCase().indexOf(state.substrate.toLowerCase()) > -1)
            })
        }
    }

    return (
        <div className={"substrateContainer"}>
            {state.substrate && state.substrate.length > 2 ?
                <Autocomplete
                    size={"small"}
                    options={state.options}
                    className={"substrate"}
                    name={"substrate"}
                    onChange={(event, value) => {
                        dispatch({type: "SETSUBSTRATE", payload: value})
                    }}
                    renderInput={params => (
                        <TextField
                            onChange={(e) => handleAutoChange(e)}
                            value={state.substrate}
                            {...params}
                            label="Initialize"
                            variant="outlined"
                        />
                    )}
                /> :
                <Autocomplete
                    size={"small"}
                    id="combo-box-demo"
                    options={["Type in..."]}
                    className={"substrate"}
                    renderInput={params => (
                        <TextField
                            name={"substrate"}
                            onChange={(e) => handleAutoChange(e)}
                            value={state.substrate}
                            {...params}
                            label="Type in three letters..."
                            variant="outlined"
                        />
                    )}
                />
            }
            {/*<Checkbox*/}
            {/*    // className={"checkBox"}*/}
            {/*    checked={state.substrate.length > 0 && isRequestValid(state.substrate)}/>*/}
                <SubmitSubstrate className={"submit"}/>
        </div>
    )
}

export default Substrate
import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {Autocomplete} from "@material-ui/lab";
import TextField from "@material-ui/core/TextField";
import {useStylesList} from "./KeggCompoundAutoCompleteList";

const ReactionKeggIdSelector = (props) => {
    const [keggIds, setKeggIds] = useState([])
    const [options, setOptions] = useState([])

    useEffect(() => {
        console.log("Hello")
    }, props.reactionRowInfo.keggId)

    function handleChange(event) {
        return undefined;
    }

    return (
        <div>
            <p>Hello</p>
            <Autocomplete
                size={"small"}
                id={"keggReactionSelector"}
                options={options}
                renderInput={params => (
                    <TextField
                        onChange={(event) => handleChange(event)}
                        value={props.taxonomy}
                        {...params}
                        label="taxonomy"
                        variant="outlined"
                    />
                )}
            />
        </div>
        
        // <Autocomplete
        //     onChange={(event, value) => {
        //         // introduces selected value into state from parent, dispatches value into global state
        //         props.data.bigg[props.index] = value;
        //         dispatch({type: "SET_BIGG_ID_SELECTION", payload: props.data.bigg})
        //     }}
        //     id="AnnotationSelector"
        //     value={props.data.bigg[props.index]}
        //     classes={classes}
        //     options={biggOptions}
        //     renderInput={(params) => (
        //         <TextField {...params} variant="outlined" label="BIGG Compound"/>)}
        // />
    )
}

export default ReactionKeggIdSelector

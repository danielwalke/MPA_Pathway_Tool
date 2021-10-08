import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {Autocomplete} from "@material-ui/lab";
import TextField from "@material-ui/core/TextField";
import {useStylesList} from "./KeggCompoundAutoCompleteList";
import {requestGenerator} from "../../request/RequestGenerator";
import {
    endpoint_getFilteredTaxonomicNames,
    endpoint_getReactionsFromCompounds
} from "../../../App Configurations/RequestURLCollection";

const ReactionKeggIdSelector = (props) => {
    const state = useSelector(state => state)

    const [options, setOptions] = useState([])

    const dispatch = useDispatch()

    function handleChange(event) {
        requestGenerator("POST", endpoint_getFilteredTaxonomicNames, {}, "", "").then( //endpoint: sends max. 100 taxonomic names
            resp => {
                if (resp.data.length > 100) {
                    resp.data.push("Type another letter for more names")
                }
                setOptions(resp.data)
            }
        )
        return undefined;
    }

    useEffect(() => {
        // fetch list of possible kegg ids
        setOptions(state.general.reactionAnnotationTableOptions.map(reaction => reaction.reactionId))
    },[state.general.reactionAnnotationTableOptions])

    return (
        <div>
            <Autocomplete
                size={"small"}
                id={"keggReactionSelector"}
                options={options}
                value={props.reactionRowInfo.keggId}
                onChange={(event, value) => {
                    const newListOfReactions = props.listOfReactions
                    newListOfReactions[props.index].keggId = value

                    dispatch({type: "SETLISTOFREACTIONS", payload: newListOfReactions})
                }}
                renderInput={params => (
                    <TextField
                        // onChange={(event) => handleChange(event)}
                        value={props.reactionRowInfo.keggId}
                        {...params}
                        label="KEGG ID Suggestions"
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

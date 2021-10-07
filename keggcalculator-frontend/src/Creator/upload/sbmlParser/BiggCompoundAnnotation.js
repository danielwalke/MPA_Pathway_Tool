import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {Autocomplete} from "@material-ui/lab";
import TextField from "@material-ui/core/TextField";
import {useStylesList} from "./KeggCompoundAutoCompleteList";

const getGroupedOptions = (suggestedCompounds, allCompounds) => {
    /**
     * generates grouped options for Autocomplete component
     */
    const suggestedOptions = [...new Set(suggestedCompounds.map(comp => comp))].map(option => {
        return{suggestedOptions: "suggested", compound: option}})
    const allOptions = [...new Set(suggestedCompounds.map(comp => comp))].map(option => {
        return {suggestedOptions: "all BIGG compounds", compound: option}})
    return [...suggestedOptions,...allOptions]
}

const BiggCompoundAnnotation = (props) => {
    const dispatch = useDispatch()
    const state = useSelector(state => state)
    const classes = useStylesList();

    const [biggCompleteCompoundList, setBiggCompleteCompoundList] = useState([])
    const kegg2BiggList = state.general.kegg2BiggCompoundList

    const [biggOptions, setBiggOptions] = useState([])
    const [biggSuggestion, setBiggSuggestion] = useState([])

    useEffect(() => {
        // Initialization
        setBiggCompleteCompoundList([...new Set(state.general.biggCompoundList.map(id => {return id.universalBiggId}))])
    }, [state.general.isAnnotationPurpose])

    useEffect(() => {
        // sets a suggestion of Bigg IDs from the selected Kegg compounds; puts it into an array with all existing bigg
        // identifiers
        let biggIds = []
        const selectedKeggCompound = props.data.kegg[props.index]

        if (selectedKeggCompound) {
            const biggIdList = kegg2BiggList[selectedKeggCompound.substr(-6)]

            if (biggIdList) {
                biggIds = Object.keys(biggIdList)
            }
        }

        setBiggSuggestion(biggIds)
        setBiggOptions([...new Set([...biggSuggestion, ...biggCompleteCompoundList])])

    }, [props.data.kegg, biggCompleteCompoundList])

    return (
        <Autocomplete
            onChange={(event, value) => {
                // introduces selected value into state from parent, dispatches value into global state
                props.data.bigg[props.index] = value;
                dispatch({type: "SET_BIGG_ID_SELECTION", payload: props.data.bigg})
            }}
            id="AnnotationSelector"
            // style={{width: "50%"}}
            value={props.data.bigg[props.index]}
            classes={classes}
            options={biggOptions}
            renderInput={(params) => (
                <TextField {...params} variant="outlined" label="BIGG Compound"/>)}
        />
    );
};

export default BiggCompoundAnnotation;

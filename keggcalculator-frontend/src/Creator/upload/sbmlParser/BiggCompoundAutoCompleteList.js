import React, {useEffect, useState} from 'react';
import {Autocomplete} from "@material-ui/lab";
import TextField from "@material-ui/core/TextField";
import {VariableSizeList} from "react-window";
import {makeStyles} from "@material-ui/core/styles";
import {useDispatch, useSelector} from "react-redux";
import {ListboxComponent, useStylesList} from "./KeggCompoundAutoCompleteList";
import clonedeep from "lodash/cloneDeep";

const getGroupedOptions = (suggestedCompounds, allCompounds) => {
    /**
     * generates grouped options for Autocomplete component
     */
    const suggestedOptions = suggestedCompounds.map(option => {
        return{suggestedOptions: "suggested", compound: option}})
    const allOptions = allCompounds.map(option => {
        return {suggestedOptions: "all BIGG compounds", compound: option}})
    return [...suggestedOptions,...allOptions]
}

const BiggCompoundAutoCompleteList = (props) => {
    const dispatch = useDispatch()
    const state = useSelector(state => state)
    const classes = useStylesList();

    const [kegg2UniversalBiggCompounds, setKegg2UniversalBiggCompounds] = useState({})
    const [selectedKeggCompound, setSelectedKeggCompound] = useState("")
    const [biggCompoundFromKeggCompound, setBiggCompoundFromKeggCompound] = useState([])
    const [biggCompoundOptions, setBiggCompoundOptions] = useState([])
    const [disableBiggSelection, setDisableBiggSelection] = useState(true)
    const [selectedBiggIdOption, setSelectedBiggIdOption] = useState("")

    // const selectedBiggIds = state.general.biggIdSelectionList

    useEffect(() => {
        // get kegg to bigg id mapping
        setKegg2UniversalBiggCompounds(state.general.kegg2BiggCompoundList)
    }, [state.general.isAnnotationPurpose])

    useEffect(() => {
        // update local state when a new kegg compound was selected
        if (props.data[props.index] !== null) {
            setSelectedKeggCompound(props.data[props.index].substr(-6))
            setDisableBiggSelection(false)
        } else {
            setSelectedKeggCompound("")
            setDisableBiggSelection(true)
        }

    }, [props.data[props.index]])

    useEffect(() => {
        // triggered when kegg to bigg id mapping was loaded into local state and whenever a kegg compound is changed by
        // selection
        let biggCompounds = kegg2UniversalBiggCompounds[selectedKeggCompound]
        if (biggCompounds === undefined) {
            setBiggCompoundFromKeggCompound([])
        } else {
            setBiggCompoundFromKeggCompound(Object.keys(biggCompounds))
        }

    }, [kegg2UniversalBiggCompounds, selectedKeggCompound])

    useEffect(() => {
        const options = getGroupedOptions(biggCompoundFromKeggCompound, props.universalBiggIdList)
        setBiggCompoundOptions(options)

    }, [biggCompoundFromKeggCompound])

    return (
        <Autocomplete
            onChange={(event, value) => {
                setSelectedBiggIdOption(value)
                // if (value !== null && value.compound !== undefined) {
                //     props.biggIdSelection[props.index] = value.compound
                //     dispatch({type: "SET_BIGG_ID_SELECTION", payload: props.biggIdSelection})
                // }
            }}
            value={selectedBiggIdOption !== null ? selectedBiggIdOption.compound : ""}
            disabled={disableBiggSelection}
            id="AnnotationSelector"
            style={{width: "50%"}}
            classes={classes}
            // ListboxComponent={ListboxComponent}
            options={biggCompoundOptions}
            groupBy={(biggCompoundOptions) => biggCompoundOptions.suggestedOptions}
            getOptionLabel={(biggCompoundOptions) => biggCompoundOptions.compound}
            renderInput={(params) => (
                <TextField {...params} variant="outlined" label="BIGG Compound"/>)}
        />
    );
};

export default BiggCompoundAutoCompleteList;

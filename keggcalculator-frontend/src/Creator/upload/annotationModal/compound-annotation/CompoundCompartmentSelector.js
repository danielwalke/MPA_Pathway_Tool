import {useDispatch} from "react-redux";
import React from "react";
import {InputLabel, MenuItem, Select} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";


export default function CompoundCompartmentSelector(props) {

    const dispatch = useDispatch()
    const compartments = ["external", "cytosol"]

    const handleChange = (event) => {
        const newListOfSpecies = props.listOfSpecies
        newListOfSpecies[props.index].compartment = event.target.value
        dispatch({type:"SETLISTOFSPECIES", payload: newListOfSpecies})
    }

    return (
        <FormControl size={"small"} variant={"outlined"}>
            <InputLabel id="compound-compartment-selector">compartment</InputLabel>
            <Select
                labelId="compound-compartment-selector"
                id="compound-compartment-selector"
                value={props.listOfSpecies[props.index].compartment}
                label="compartment"
                onChange={(event) => handleChange(event)}
            >
                {compartments.map((compartment, index) => {
                    return <MenuItem key={index} value={compartment}>{compartment}</MenuItem>
                })}
            </Select>
        </FormControl>
    );
}

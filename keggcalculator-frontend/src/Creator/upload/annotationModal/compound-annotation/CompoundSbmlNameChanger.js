import React from 'react';
import TextField from "@material-ui/core/TextField";
import {useDispatch} from "react-redux";

const CompoundSbmlNameChanger = (props) => {
    const dispatch = useDispatch()

    return (
        <TextField label="Compound Name"
                   variant={"outlined"}
                   size={"small"}
                   value={props.listOfSpecies[props.index].sbmlName}
                   onChange={(e) => {
                       const newListOfSpecies = props.listOfSpecies
                       newListOfSpecies[props.index].sbmlName = e.target.value
                       console.log(newListOfSpecies)
                       dispatch({type: "SETLISTOFSPECIES", payload: newListOfSpecies})
                   }}/>
    );
};

export default CompoundSbmlNameChanger;

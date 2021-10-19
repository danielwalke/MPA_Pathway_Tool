import React from 'react';
import TextField from "@material-ui/core/TextField";
import {useDispatch} from "react-redux";

const CompoundSbmlIdChanger = (props) => {
    const dispatch = useDispatch()

    return (
        <TextField label="Compound Id"
                   variant={"outlined"}
                   size={"small"}
                   value={props.listOfSpecies[props.index].sbmlId}
                   onChange={(e) => {
                       const newListOfSpecies = props.listOfSpecies
                       newListOfSpecies[props.index].sbmlId = e.target.value

                       dispatch({type: "SETLISTOFSPECIES", payload: newListOfSpecies})
                   }}/>
    );
};

export default CompoundSbmlIdChanger;

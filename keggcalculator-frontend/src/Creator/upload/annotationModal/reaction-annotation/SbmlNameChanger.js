import React from 'react';
import TextField from "@material-ui/core/TextField";
import {useDispatch} from "react-redux";

const SbmlNameChanger = (props) => {
    const dispatch = useDispatch()

    console.log(props)

    return (
        <TextField label="Reaction Name"
                   variant={"outlined"}
                   size={"small"}
                   value={props.listOfReactions[props.index].sbmlName}
                   onChange={(e) => {
                       const newListOfReactions = props.listOfReactions
                       newListOfReactions[props.index].sbmlName = e.target.value

                       dispatch({type: "SETLISTOFREACTIONS", payload: newListOfReactions})
                   }}/>
    );
};

export default SbmlNameChanger;

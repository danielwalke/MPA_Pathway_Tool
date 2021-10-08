import React, {useState} from 'react';
import TextField from "@material-ui/core/TextField";
import {useDispatch, useSelector} from "react-redux";
import {Checkbox} from "@material-ui/core";

const SbmlNameChanger = (props) => {
    const [name, setName] = useState(props.sbmlName)
    const dispatch = useDispatch()

    return (
        <TextField label="Reaction Name"
                   variant={"outlined"}
                   size={"small"}
                   // defaultValue={props.reactionRowInfo.sbmlName}
                   value={props.reactionRowInfo.sbmlName}
                   onChange={(e) => {
                       const newListOfReactions = props.listOfReactions
                       newListOfReactions[props.index].sbmlName = e.target.value

                       dispatch({type: "SETLISTOFREACTIONS", payload: newListOfReactions})
                       setName(e.target.value)
                   }}/>
    );
};

export default SbmlNameChanger;

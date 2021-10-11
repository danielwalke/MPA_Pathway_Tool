import React from 'react';
import TextField from "@material-ui/core/TextField";
import {useDispatch, useSelector} from "react-redux";

const SbmlIdChanger = (props) => {
    const dispatch = useDispatch()

    return (
        <TextField label="Reaction Id"
                   variant={"outlined"}
                   size={"small"}
                   value={props.listOfReactions[props.index].sbmlId}
                   onChange={(e) => {
                       const newListOfReactions = props.listOfReactions
                       newListOfReactions[props.index].sbmlId = e.target.value

                       dispatch({type: "SETLISTOFREACTIONS", payload: newListOfReactions})
                   }}/>
    );
};

export default SbmlIdChanger;

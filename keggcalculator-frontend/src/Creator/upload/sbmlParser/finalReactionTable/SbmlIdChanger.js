import React, {useState, useEffect} from 'react';
import TextField from "@material-ui/core/TextField";
import {useDispatch, useSelector} from "react-redux";
import {Checkbox} from "@material-ui/core";

const SbmlIdChanger = (props) => {
    const [id, setId] = useState(props.sbmlId)
    const dispatch = useDispatch()

    return (
        <TextField label="Reaction Id"
                   variant={"outlined"}
                   size={"small"}
                   // defaultValue={props.listOfReactions[props.index].sbmlId}
                   value={props.listOfReactions[props.index].sbmlId}
                   onChange={(e) => {
                       const newListOfReactions = props.listOfReactions
                       newListOfReactions[props.index].sbmlId = e.target.value

                       dispatch({type: "SETLISTOFREACTIONS", payload: newListOfReactions})
                       setId(e.target.value)
                   }}/>
    );
};

export default SbmlIdChanger;

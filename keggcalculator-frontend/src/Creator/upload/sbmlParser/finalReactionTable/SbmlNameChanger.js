import React, {useState} from 'react';
import TextField from "@material-ui/core/TextField";
import {useDispatch, useSelector} from "react-redux";
import {Checkbox} from "@material-ui/core";

const SbmlNameChanger = (props) => {
    const [name, setName] = useState(props.sbmlName)

    return (
        <TextField label="Reaction Name"
                   variant={"outlined"}
                   size={"small"}
                   defaultValue={props.reactionRowInfo.sbmlName}
                   value={name}
                   onChange={(e) => {
                       const newReaction = props.reactionRowInfo
                       newReaction.sbmlName = e.target.value
                       props.setReactionRowInfo(newReaction)
                       setName(e.target.value)
                   }}/>
    );
};

export default SbmlNameChanger;

import React, {useState, useEffect} from 'react';
import TextField from "@material-ui/core/TextField";
import {useDispatch, useSelector} from "react-redux";
import {Checkbox} from "@material-ui/core";

const SbmlIdChanger = (props) => {
    const [id, setId] = useState(props.sbmlId)

    return (
        <TextField label="Reaction Id"
                   variant={"outlined"}
                   size={"small"}
                   defaultValue={props.reactionRowInfo.sbmlId}
                   value={id}
                   onChange={(e) => {
                       const newReaction = props.reactionRowInfo
                       newReaction.sbmlId = e.target.value
                       props.setReactionRowInfo(newReaction)
                       setId(e.target.value)
                   }}/>
    );
};

export default SbmlIdChanger;

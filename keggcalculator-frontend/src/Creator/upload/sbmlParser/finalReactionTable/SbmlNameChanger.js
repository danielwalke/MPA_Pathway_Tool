import React, {useState} from 'react';
import TextField from "@material-ui/core/TextField";
import {useDispatch, useSelector} from "react-redux";

const SbmlNameChanger = (props) => {
    const state = useSelector(state=> state)
    const dispatch = useDispatch()
    const [reactionSbmlNames, setReactionSbmlNames] = useState({})

    const handleSubmitChange = () =>{
        const listOfReactions = state.general.listOfReactions.map(r =>{
            if(r.keggId === props.reaction.keggId){
                r.sbmlName = reactionSbmlNames[props.index]
            }
            return r
        })
        dispatch({type:"SETLISTOFREACTIONS", payload: listOfReactions})
    }
    return (
        <div>
            <TextField type={"text"} size={"small"} defaultValue={props.reaction.sbmlName} value={reactionSbmlNames[props.index]} onChange={(e)=> {
                const newSbmlIds = {reactionSbmlNames};
                newSbmlIds[props.index] = e.target.value
                setReactionSbmlNames(newSbmlIds)
            }}/>
            <button onClick={()=>handleSubmitChange()} className={"downloadButton"}>submit changes</button>
        </div>
    );
};

export default SbmlNameChanger;
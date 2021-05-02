import React, {useState} from 'react';
import TextField from "@material-ui/core/TextField";
import {useDispatch, useSelector} from "react-redux";
import {Checkbox} from "@material-ui/core";

const SbmlNameChanger = (props) => {
    const state = useSelector(state=> state)
    const dispatch = useDispatch()
    const [reactionSbmlNames, setReactionSbmlNames] = useState({})
    const [isChanged, setIsChanged] = React.useState(true)

    const handleSubmitChange = () =>{
        const listOfReactions = state.general.listOfReactions.map(r =>{
            if(r.keggId === props.reaction.keggId){
                r.sbmlName = reactionSbmlNames[props.index]
            }
            return r
        })
        setIsChanged(true)
        dispatch({type:"SETLISTOFREACTIONS", payload: listOfReactions})
    }
    return (
        <div>
            <div style={{display:"flex"}}><Checkbox checked={isChanged}/><TextField
                variant={"outlined"}
                size={"small"} defaultValue={props.reaction.sbmlName} value={reactionSbmlNames[props.index]} onChange={(e)=> {
                const newSbmlIds = {reactionSbmlNames};
                newSbmlIds[props.index] = e.target.value
                setReactionSbmlNames(newSbmlIds)
                setIsChanged(false)
            }}/>
            </div>
            <button style={{ width:0.1*window.innerWidth}} onClick={()=>handleSubmitChange()} className={"downloadButton"}>submit changes</button>
        </div>
    );
};

export default SbmlNameChanger;
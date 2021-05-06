import React, {useState} from 'react';
import TextField from "@material-ui/core/TextField";
import {useDispatch, useSelector} from "react-redux";
import {Checkbox} from "@material-ui/core";

const SbmlIdChanger = (props) => {
    const state = useSelector(state=> state)
    const dispatch = useDispatch()
    const [reactionSbmlIds, setReactionSbmlIds] = useState({})
    const [isChanged, setIsChanged] = React.useState(true)

    const handleSubmitSbmlIdChanges = () =>{
        const listOfReactions = state.general.listOfReactions.map(r =>{
            if(r.keggId === props.reaction.keggId){
                r.sbmlId = reactionSbmlIds[props.index]
            }
            return r
        })
        setIsChanged(true)
        dispatch({type:"SETLISTOFREACTIONS", payload: listOfReactions})
    }
    return (
        <div>
            <div style={{display:"flex"}}><Checkbox checked={isChanged}/><TextField variant={"outlined"} size={"small"} defaultValue={props.reaction.sbmlId} value={reactionSbmlIds[props.index]} onChange={(e)=> {
                const newSbmlIds = {reactionSbmlIds};
                newSbmlIds[props.index] = e.target.value
                setReactionSbmlIds(newSbmlIds)
                // dispatch({type:"SET_REACTION_SBML_ID", payload:newSbmlIds})
                setIsChanged(false)
            }}/></div>
            <button style={{width:0.1*window.innerWidth}} onClick={()=>handleSubmitSbmlIdChanges()} className={"downloadButton"}>submit changes</button>
        </div>
    );
};

export default SbmlIdChanger;
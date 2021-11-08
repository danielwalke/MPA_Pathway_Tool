import React,{useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown'
import {useDispatch, useSelector} from "react-redux";
import {InputLabel, MenuItem, Select} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";


function ObjectiveCo(nodeId){
    const state = useSelector(state => state.keggReaction)

    const dispatch = useDispatch();
    const graphState = useSelector(state => state.graph)
    const generalState = useSelector(state => state.general)

    var reactionid = nodeId.nodeId.slice(nodeId.nodeId.length - 6);
    //console.log(reactionid);

    var reactionList = [];
    var value1 = 0;

    const [val, setValue]=useState('');
    const handleChange=(e)=>{
        //console.log(e.target.value);
        setValue(e.target.value);
        value1 = e.target.value;
        //console.log(value1)
        const found = generalState.objectiveCoeffecient.some(el => el.reactionId === reactionid);

        if(!found){
            reactionList.push({
                'reactionId' : reactionid,
                'objectiveCoefficient' : value1
            });
            dispatch({type: "SETOBJECTIVECOEFFECIENT", payload: reactionList})
        }
        else{
            generalState.objectiveCoeffecient.forEach(reaction =>{
                if(reaction.reactionId == reactionid){
                    reaction.objectiveCoefficient = value1;
                }
            })
        }
    }
    // console.log(generalState)


    //
    //




    return (
        <div className="App container">
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Objective Coeffecient</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={val}
                    label="Objective"
                    onChange={handleChange}
                >
                    <MenuItem value={0}>0</MenuItem>
                    <MenuItem value={1}>1</MenuItem>

                </Select>
            </FormControl>

        </div>
    );
}

export default ObjectiveCo;
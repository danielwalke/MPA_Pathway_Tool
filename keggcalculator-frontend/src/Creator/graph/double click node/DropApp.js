import React,{useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown'
import {useDispatch, useSelector} from "react-redux";
import {InputLabel, MenuItem, Select} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import {reaction} from "mobx";


function DropApp(nodeId){
    const state = useSelector(state => state.keggReaction)

    const dispatch = useDispatch();
    const graphState = useSelector(state => state.graph)
    const generalState = useSelector(state => state.general)

    var reactionid = nodeId.nodeId.slice(nodeId.nodeId.length - 6);
    console.log(reactionid);

    var reactionList = [];
    var value1 = false;

    const [val, setValue]= React.useState('');
    const handleChange = (e) =>{
        //console.log(e.target.value);
        setValue(e.target.value);
        value1 = e.target.value;
       // console.log(value1)

        const found = generalState.exchangeReaction.some(el => el.reactionId === reactionid);
        //console.log(found);
        if(!found){
            reactionList.push({
                'reactionId' : reactionid,
                'exchangeInfo' : value1
            });
            dispatch({type: "SETEXCHANGEREACTION", payload: reactionList})
        }
        else{
            generalState.exchangeReaction.forEach(reaction =>{
                if(reaction.reactionId == reactionid){
                    reaction.exchangeInfo = value1;
                }
            });
        }

       // console.log(reactionList);



    };
    //console.log(generalState.exchangeReaction);

    return (
        <div className="App container">
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Reaction Info</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={val}
                    label="Reaction Type"
                    onChange={handleChange}
                >
                    <MenuItem value={true}>Exchange Reaction</MenuItem>
                    <MenuItem value={false}>Not An Exchange Reaction</MenuItem>
                </Select>
            </FormControl>


        </div>
    );
}

export default DropApp;
import React,{useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown'
import {useDispatch, useSelector} from "react-redux";
import FormControl from "@material-ui/core/FormControl";
import {InputLabel, MenuItem, Select} from "@material-ui/core";


function DropCytosol(nodeId){
    const state = useSelector(state => state.keggReaction)

    const dispatch = useDispatch();
    const graphState = useSelector(state => state.graph)
    const generalState = useSelector(state => state.general)
    //console.log(nodeId)
    //var reactionid = "coo1"
    var reactionid = nodeId.node.slice(nodeId.node.length - 6);
    //console.log(reactionid);

    var reactionList = [];
    var value1 = '';
    var checked = false;
    const [val, setValue]=useState('');
    const handleChange=(e)=>{
        //console.log(e.target.value);
        setValue(e.target.value);
        value1 = e.target.value
        //console.log(value1)
        const found = generalState.cystolInformation.some(el => el.compoundId === reactionid);

        if(!found){
            reactionList.push({
                'compoundId' : reactionid,
                'compartment' : value1
            });
            dispatch({type: "SETCYSTOLINFORMATION", payload: reactionList})
        }
        else{
            generalState.cystolInformation.forEach(reaction =>{
                if(reaction.compoundId == reactionid){
                    reaction.compartment = value1;
                }
            })
        }

        //console.log(reactionList);

    }
    //console.log(generalState.cystolInformation)


    //
    //

    generalState.reactionsInSelectArray.forEach(reaction => {
        if (reaction.reactionId == reactionid) {
            checked = true;

        }
    });

    if(checked == false){
        return (

            <div className="App container">
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Cytosol Information</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={val}
                        label="Cytosol"
                        onChange={handleChange}
                    >
                        <MenuItem value={"cytosol"}>Cytosol</MenuItem>
                        <MenuItem value={"external"}>External</MenuItem>

                    </Select>
                </FormControl>

                <h4>You selected {val}</h4>
            </div>
        )
    }
    else{
        return (
            <div></div>
        )
    }




}

export default DropCytosol;
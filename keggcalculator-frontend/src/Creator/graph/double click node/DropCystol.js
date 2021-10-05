import React,{useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown'
import {useDispatch, useSelector} from "react-redux";


function DropCystol(nodeId){
    const state = useSelector(state => state.keggReaction)

    const dispatch = useDispatch();
    const graphState = useSelector(state => state.graph)
    const generalState = useSelector(state => state.general)
    //console.log(nodeId)
    //var reactionid = "coo1"
    var reactionid = nodeId.node.slice(nodeId.node.length - 6);
    console.log(reactionid);

    var reactionList = [];
    var value1 = '';

    const [value,setValue]=useState('');
    const handleSelect=(e)=>{
        console.log(e)
        setValue(e)
        value1 = e
        console.log(value1)
        reactionList.push({
            'compoundId' : reactionid,
            'compartment' : value1
        });
        console.log(reactionList);
        dispatch({type: "SETCYSTOLINFORMATION", payload: reactionList})
    }



    //
    //




    return (
        <div className="App container">

            <DropdownButton
                alignRight
                title="Set the Compund Compartment Type"
                id="dropdown-menu-align-left"
                onSelect={handleSelect}
            >
                <Dropdown.Item eventKey="cystol">cystol</Dropdown.Item>
                <Dropdown.Item eventKey="external">external</Dropdown.Item>
            </DropdownButton>
            <h4>You selected {value}</h4>
        </div>
    );
}

export default DropCystol;
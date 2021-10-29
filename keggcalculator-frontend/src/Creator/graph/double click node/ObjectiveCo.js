import React,{useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown'
import {useDispatch, useSelector} from "react-redux";


function ObjectiveCo(nodeId){
    const state = useSelector(state => state.keggReaction)

    const dispatch = useDispatch();
    const graphState = useSelector(state => state.graph)
    const generalState = useSelector(state => state.general)

    var reactionid = nodeId.nodeId.slice(nodeId.nodeId.length - 6);
    console.log(reactionid);

    var reactionList = [];
    var value1 = 0;

    const [value,setValue]=useState('');
    const handleSelect=(e)=>{
        console.log(e)
        setValue(e)
        value1 = e
        console.log(value1)
        reactionList.push({
            'reactionId' : reactionid,
            'objectiveCoefficient' : value1
        });
        console.log(reactionList);
        dispatch({type: "SETOBJECTIVECOEFFECIENT", payload: reactionList})
    }



    //
    //




    return (
        <div className="App container">
            <h4>You selected {value}</h4>
            <DropdownButton
                alignRight
                title="Set Objective Coeffecient"
                id="dropdown-menu-align-left"
                onSelect={handleSelect}
            >
                <Dropdown.Item eventKey="0">0</Dropdown.Item>
                <Dropdown.Item eventKey="1">1</Dropdown.Item>
            </DropdownButton>

        </div>
    );
}

export default ObjectiveCo;
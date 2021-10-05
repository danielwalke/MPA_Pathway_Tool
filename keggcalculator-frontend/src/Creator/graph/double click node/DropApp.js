import React,{useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown'
import {useDispatch, useSelector} from "react-redux";


function DropApp(nodeId){
    const state = useSelector(state => state.keggReaction)

    const dispatch = useDispatch();
    const graphState = useSelector(state => state.graph)
    const generalState = useSelector(state => state.general)

    var reactionid = nodeId.nodeId.slice(nodeId.nodeId.length - 6);
    console.log(reactionid);

    var reactionList = [];
    var value1 = false;

    const [value,setValue]=useState('');
    const handleSelect=(e)=>{
        console.log(e)
        setValue(e)
        value1 = e
        console.log(value1)
        reactionList.push({
            'reactionId' : reactionid,
            'exchangeInfo' : value1
        });
        console.log(reactionList);
        dispatch({type: "SETEXCHANGEREACTION", payload: reactionList})
    }



    //
    //




    return (
        <div className="App container">

            <DropdownButton
                alignRight
                title="Set the reaction Type"
                id="dropdown-menu-align-left"
                onSelect={handleSelect}
            >
                <Dropdown.Item eventKey="true">Exchange Reaction</Dropdown.Item>
                <Dropdown.Item eventKey="false">Not An Exchange Reaction</Dropdown.Item>
            </DropdownButton>
            <h4>You selected {value}</h4>
        </div>
    );
}

export default DropApp;
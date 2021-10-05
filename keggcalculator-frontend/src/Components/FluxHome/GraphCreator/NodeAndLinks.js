import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {handleJSONGraphUpload} from "../json upload/ModuleUploadFunctionsJSON";
import {Button} from "react-bootstrap";


const NodeAndLinks = () => {
    const kegstate = useSelector(state => state.keggReaction)
    const state = useSelector(state => state)
    const dispatch = useDispatch();
    const graphState = useSelector(state => state.graph)
    const generalState = useSelector(state => state.general)
    const fbaState = useSelector(state => state.fba)

    const handleClick = () =>{


        const reaction = generalState.reactionsInSelectArray;

        const {nodes, links} = handleJSONGraphUpload(reaction, dispatch, graphState, generalState)
        const data_new = {nodes: nodes, links: links}

        dispatch({type: "SETNEWDATA1", payload: data_new})
        dispatch({type: "SWITCHISMODULESIMPORT"})
        dispatch({type: "SETNEWDATALINKS", payload: links})
        console.log(nodes, links);
        console.log(reaction);
        console.log(fbaState);

    }



    return(
        <div>
            <Button onClick={handleClick}>
                CREATE NODES
            </Button>
        </div>
    )


}
export default NodeAndLinks
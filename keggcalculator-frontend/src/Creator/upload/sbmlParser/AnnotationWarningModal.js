/*
this component is responsible for showing a warning if the sbml file contains unAnnotated Compounds
 */

import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import Modal from "@material-ui/core/Modal";
import {useStyles} from "../../ModalStyles/ModalStyles";
import {addCompoundsToReactions} from "./ReactionCompoundsAdder";

const handleAnnotationPurpose = (dispatch) => {
    dispatch({type: "SETISMISSINGANNOTATIONS", payload: false})
    dispatch({type: "SETISANNOTATIONPURPOSE", payload: true}) //Annotation modal will show up
}

const handleSkipPurpose = (state, dispatch) => {
    dispatch({type: "SETISMISSINGANNOTATIONS", payload: false})
    //no annotation warning will show up
    //add additional information to each reaction
    const newListOfReactions = addCompoundsToReactions(state, state.general.listOfReactions, state.general.listOfSpecies)
    //set reactions
    // const reactions = setReactionsInStore(state, newListOfReactions)
    //set data for the Graph
    // const data = setReactionsAndCompoundsInStore(state, newListOfReactions, dispatch)
    dispatch({type: "SETLISTOFREACTIONS", payload: newListOfReactions})
    // dispatch({type:"SETREACTIONSINARRAY", payload: reactions})
    // console.log(data);//check whether this is correct, then uncomment the next line
    // dispatch({type: "SETDATA", payload: data})
    dispatch({type: "SETLOADING", payload: false})
    dispatch({type: "SETISSHOWINGREACTIONTABLE", payload: true})
}

const AnnotationWarningModal = () => {
    const state = useSelector(state => state)
    const {general} = state
    const dispatch = useDispatch();
    const classes = useStyles()
    const annotationWarning = (<div className={classes.paper} style={{width: "45vw"}}>
        <div style={{display: "flex"}}>
            <p>You have unannotated compounds in your SBML- file! Do you want to annotate them now?</p>
        </div>
        <div style={{display: "flex"}}>
            <button className={"downloadButton"} style={{width: "20vw"}}
                    onClick={() => handleAnnotationPurpose(dispatch)}>Yes
            </button>
            <button style={{width: "20vw"}} className={"downloadButton"}
                    onClick={() => handleSkipPurpose(state, dispatch)}>No
            </button>
        </div>
    </div>)
    return (
        <div>
            <Modal className={classes.modal} open={general.isMissingAnnotations}>
                {annotationWarning}
            </Modal>
        </div>
    );
};

export default AnnotationWarningModal;

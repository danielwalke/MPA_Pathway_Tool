/*
this component is responsible for showing a warning if the sbml file contains unAnnotated Compounds
 */

import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import Modal from "@material-ui/core/Modal";
import {useStyles} from "../../ModalStyles/ModalStyles";
import {addCompoundsToReactions} from "./ReactionCompoundsAdder";

const handleAnnotationPurpose = (dispatch) => {
    dispatch({type: "SHOW_ANNOTATION_WARNING", payload: false}) //Annotation modal will show up
    dispatch({type: "SETISMISSINGANNOTATIONS", payload: false})
    dispatch({type: "SETISANNOTATIONPURPOSE", payload: true})
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
    dispatch({type: "SHOW_ANNOTATION_WARNING", payload: false})
    dispatch({type: "SETISSHOWINGREACTIONTABLE", payload: true})
}

const AnnotationWarningModal = () => {
    const state = useSelector(state => state)
    const {general} = state
    const dispatch = useDispatch();
    const classes = useStyles()

    const missingAnnotationWarning = (
        <p>You have unannotated compounds in your SBML- file! Would you like to annotate them?</p>)

    const annotatePrompt = (
        <p>Would you like to check or alter your model annotation?</p>
    )

    return (
        <div>
            <Modal className={classes.modal} open={general.showAnnotationWarning}>
                <div className={classes.paper} style={{width: "45vw"}}>
                    <div style={{display: "flex"}}>
                        {general.isMissingAnnotations && missingAnnotationWarning}
                        {!general.isMissingAnnotations && annotatePrompt}
                    </div>
                    <div style={{display: "flex"}}>
                        <button className={"downloadButton"} style={{width: "20vw"}}
                                onClick={() => handleAnnotationPurpose(dispatch)}>Yes
                        </button>
                        <button style={{width: "20vw"}} className={"downloadButton"}
                                onClick={() => handleSkipPurpose(state, dispatch)}>No
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AnnotationWarningModal;

/*
this component is responsible for showing a warning if the sbml file contains unAnnotated Compounds
 */

import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import Modal from "@material-ui/core/Modal";
import {useStyles} from "../../../ModalStyles/ModalStyles";
import {addCompoundsToReactions} from "../ReactionCompoundsAdder";
import {setReactionsAndCompoundsInStore} from "../GraphDrawer";

const handleShowAnnotationTable = (dispatch) => {
    dispatch({type: "SHOW_ANNOTATION_WARNING", payload: false}) //Annotation modal will show up
    dispatch({type: "SETISMISSINGANNOTATIONS", payload: false})
    dispatch({type: "SHOWANNOTATIONTABLE", payload: true})
    dispatch({type: "SHOWCOMPOUNDANNOTATION", payload: true})
}

const handleSkipPurpose = (dispatch, state) => {
    dispatch({type: "SETISMISSINGANNOTATIONS", payload: false})
    //no annotation warning will show up
    //add additional information to each reaction
    const newListOfReactions = addCompoundsToReactions(state, state.general.listOfReactions, state.general.listOfSpecies)
    console.log(newListOfReactions)
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
    dispatch({type: "SWITCHUPLOADMODAL"})

    // creates model representation

    //set data for the Graph
    const data = setReactionsAndCompoundsInStore(state, state.general.listOfReactions, dispatch)
    dispatch({type: "SETDATA", payload: data})
    dispatch({type: "SETLOADING", payload: false})
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
                        <button className={"download-button"} style={{width: "20vw"}}
                                onClick={() => handleShowAnnotationTable(dispatch)}>Yes
                        </button>
                        <button style={{width: "20vw"}} className={"download-button"}
                                onClick={() => handleSkipPurpose(dispatch, state)}>No
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AnnotationWarningModal;

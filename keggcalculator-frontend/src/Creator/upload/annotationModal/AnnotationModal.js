
import React from 'react';
import Modal from "@material-ui/core/Modal";
import CompoundAnnotation from "./compound-annotation/CompoundAnnotation";
import {useStyles} from "../../ModalStyles/ModalStyles";
import {useSelector} from "react-redux";
import ReactionAnnotation from "./reaction-annotation/ReactionAnnotation";

const AnnotationModal = () => {
    const classes = useStyles()
    const state = useSelector(state => state)

    return (
        <Modal className={classes.modal} open={state.general.showAnnotationTable}>
            <div className={classes.paper}>
                <div className={"annotation-modal"}>
                    {
                        state.general.showAnnotationTable &&
                        state.general.showCompoundAnnotation &&
                        <CompoundAnnotation/>
                    }
                    {
                        state.general.showAnnotationTable &&
                        state.general.showReactionAnnotation &&
                        <ReactionAnnotation/>
                    }
                </div>
            </div>
        </Modal>
    );
};

export default AnnotationModal;


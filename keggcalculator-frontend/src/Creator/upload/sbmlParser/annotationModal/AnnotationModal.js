
import React from 'react';
import Modal from "@material-ui/core/Modal";
import CompoundAnnotation from "./CompoundAnnotation";
import {useStyles} from "../../../ModalStyles/ModalStyles";
import {useSelector} from "react-redux";
import ReactionAnnotation from "./ReactionAnnotation";

const AnnotationModal = () => {
    const classes = useStyles()
    const state = useSelector(state => state)

    return (
        <div>
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
        </div>
    );
};

export default AnnotationModal;


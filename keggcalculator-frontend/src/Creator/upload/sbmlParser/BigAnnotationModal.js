/*
this component is responsible for showing a modal with all unannotated compounds and allows the annotation of these compounds by selecting the respective KEGG compound
 */
import React, {useEffect, useState} from 'react';
import Modal from "@material-ui/core/Modal";
import CompoundAnnotation from "./CompoundAnnotation";
import {useStyles} from "../../ModalStyles/ModalStyles";
import {useSelector} from "react-redux";
import ReactionAnnotation from "./ReactionAnnotation";

const AnnotationModal = () => {
    const classes = useStyles()
    const state = useSelector(state => state)

    return (
        <div>
            <Modal className={classes.modal} open={state.general.isAnnotationPurpose}>
                <div className={classes.paper}>
                    <div className={"annotation-modal"}>
                        {
                            state.general.isAnnotationPurpose &&
                            state.general.showCompoundAnnotation &&
                            <CompoundAnnotation/>
                        }
                        {
                            state.general.isAnnotationPurpose &&
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


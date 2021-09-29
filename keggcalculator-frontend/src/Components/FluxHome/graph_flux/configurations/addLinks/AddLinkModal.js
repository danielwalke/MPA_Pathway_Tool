import React, {useState} from 'react';
import Modal from "@material-ui/core/Modal";
import {useStyles} from "../../../../../Creator/ModalStyles/ModalStyles";
import AddLinkBody from "./AddLinkBody";
import {useDispatch, useSelector} from "react-redux";

const AddLinkModal = () => {
    const classes = useStyles()
    const generalState = useSelector(state => state.general)

    const dispatch = useDispatch()

    const body = <AddLinkBody/>
    return (
        <Modal className={classes.modal} open={generalState.addLinkModal}
               onClose={() => dispatch({type: "SWITCHSHOWADDLINKMODAL"})}>
            {body}
        </Modal>
    );
};

export default AddLinkModal;

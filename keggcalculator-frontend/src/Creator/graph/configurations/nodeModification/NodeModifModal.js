import React from 'react';
import Modal from "@material-ui/core/Modal";
import {useStyles} from "../../../ModalStyles/ModalStyles";
import {useDispatch, useSelector} from "react-redux";
import NodeModificationBody from "./NodeModificationBody";

const NodeModifModal = () => {
    const classes = useStyles()
    const graphState = useSelector(state => state.graph)
    const dispatch = useDispatch()
    return (
        <div>
            <Modal className={classes.modal} open={graphState.nodeModificationModal}
                   onClose={() => dispatch({type: "SWITCH_NODE_MODIFICATION_MODAL"})}>
                <NodeModificationBody/>
            </Modal>
        </div>
    );
};

export default NodeModifModal;
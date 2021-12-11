import Modal from "@material-ui/core/Modal";
import React from "react";
import {useStyles} from "../ModalStyles/ModalStyles";
import {useDispatch, useSelector} from "react-redux";
import UploadMantis from "../upload/uploadMantis/UploadMantis";


const MantisModal = () => {
    const classes = useStyles();
    const state = useSelector(state => state.mantis)
    const dispatch = useDispatch()
    const body = (
        <div className={classes.paper}  style={{width:"80vw"}}>
            <UploadMantis/>
        </div>
    )

    const handleClose = () => {
        dispatch({type: "SET_IS_MANTIS_MODAL_OPEN", payload: false})
        dispatch({type: "SETLOADING", payload: false})
    }
    return (
        <div>
            <Modal className={classes.modal} open={state.isMantisModalOpen} onClose={() => handleClose()}>
                {body}
            </Modal>
        </div>
    )
}

export default MantisModal

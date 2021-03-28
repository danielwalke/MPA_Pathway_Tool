import Modal from "@material-ui/core/Modal";
import React from "react";
import {useStyles} from "../ModalStyles/ModalStyles";
import {useDispatch, useSelector} from "react-redux";
import MpaInput from "./MpaInput";
import ModuleCsvFileInput from "./ModuleCsvFileInput";
import ModuleJSONInput from "./ModuleJSONInput";
import ModuleSBMLUpload from "./ModuleSBMLUpload";


const UploadModal = () =>{
    const classes = useStyles();
    const state = useSelector(state => state.general)
    const dispatch= useDispatch()
    const body = (
        <div className={classes.paper}>
            <MpaInput/>
            <ModuleCsvFileInput/>
            <ModuleJSONInput/>
            <ModuleSBMLUpload/>
        </div>
    )

    const handleClose = () =>{
        dispatch({type: "SWITCHUPLOADMODAL"})
        dispatch({type: "SETLOADING", payload: false})
    }
    return(
        <div>
            <Modal className={classes.modal} open={state.uploadModal} onClose={() => handleClose()}>
                {body}
            </Modal>
        </div>
    )
}

export default UploadModal
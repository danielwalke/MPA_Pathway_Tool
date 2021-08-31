import Modal from "@material-ui/core/Modal";
import React from "react";
import {useStyles} from "../../ModalStyles/ModalStyles";
import {useDispatch, useSelector} from "react-redux";
import MpaInput from "../csv upload/experimental data/MpaInput";
import ModuleCsvFileInput from "../csv upload/module file/ModuleCsvFileInput";
import ModuleJSONInput from "../json upload/ModuleJSONInput";
import SbmlReader from "../sbmlParser/SbmlReader/SbmlReader";
import Example from "../example/Example";


const UploadModal = (props) =>{
    const classes = useStyles();
    const state = useSelector(state => state.general)
    const dispatch= useDispatch()
    const body = (
        <div className={classes.paper}>
            <MpaInput setOpen={props.setOpen}/>
            <ModuleCsvFileInput/>
            <ModuleJSONInput/>
            <SbmlReader/>
            <hr/>
            <Example/>
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

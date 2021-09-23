import Modal from "@material-ui/core/Modal";
import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getStructureBody} from "./StuctureModalBody";
import {useStyles} from "../../ModalStyles/ModalStyles";

const StructureModal = () => {
    const generalState = useSelector(state => state.general)
    const state = useSelector(state => state.graph)
    const dispatch = useDispatch()
    const [isNcbiTaxonomy, setIsNcbiTaxonomy] = useState(true)
    const classes = useStyles()
    let body;
    if (state.doubleClickNode.length > 0) {
        body = getStructureBody(state, dispatch, generalState, isNcbiTaxonomy, setIsNcbiTaxonomy)
    }

    return (
        <div>
            <Modal className={classes.modal} open={state.showStructure}
                   onClose={() => dispatch({type: "SWITCHSHOWSTRUCTURE"})}>
                {body}
            </Modal>
        </div>
    )
}

export default StructureModal

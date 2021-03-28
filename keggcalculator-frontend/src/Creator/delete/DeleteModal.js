import React from "react";
import Modal from '@material-ui/core/Modal';
import {useDispatch, useSelector} from "react-redux";
import "./DeleteModal.css"
import {useStyles} from "../ModalStyles/ModalStyles";


const DeleteModal = () => {
    const state = useSelector(state => state.graph)
    const dispatch = useDispatch()
    const classes = useStyles()

    const handleDeleteNode = (e) => {
        e.preventDefault()
        const newDataNodes = state.data.nodes.filter(node => node.id !== state.deleteNode)
        const sourceLinks = state.data.links.filter( links => links.source !== state.deleteNode)
        const newLinks = sourceLinks.filter( links => links.target !== state.deleteNode)
        const newData = {nodes: newDataNodes, links: newLinks}
        dispatch({type: "SETDATA", payload: newData})
        dispatch({type:"SWITCHDELETEMODAL"})
    }

    const body = (
        <div className={classes.paper}>
            <h3>Are you sure you want to delete this node?</h3>
            <button className={"buttonDelete"} onClick={handleDeleteNode}>Yes</button>
            <button className={"buttonDelete"} onClick={() => dispatch({type: "SWITCHDELETEMODAL"})}>Cancel</button>
        </div>
    )
    return (
        <div>
            <Modal className={classes.modal} open={state.showDeleteModal} onClose={() => dispatch({type: "SWITCHDELETEMODAL"})}>
                {body}
            </Modal>
        </div>
    )

}

export default DeleteModal
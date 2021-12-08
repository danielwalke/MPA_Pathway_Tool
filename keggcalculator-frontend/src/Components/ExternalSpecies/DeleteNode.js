import React from "react";
import Modal from '@material-ui/core/Modal';
import {useDispatch, useSelector} from "react-redux";
import "./DeleteModal.css"
import {useStyles} from "../../Creator/ModalStyles/ModalStyles";


const DeleteNode = () => {

    const fbaState = useSelector(state => state.fba)
    const dispatch = useDispatch()
    const classes = useStyles()

    const handleDeleteNode = (e) => {
        e.preventDefault()
        const old_data = fbaState.data_circular
        const newDataNodes = fbaState.data_circular.nodes.filter(node => node.id !== fbaState.deleteNodeCircular)
        //const sourceLinks = fbaState.data_circular.links.filter( links => links.source !== nodeId)
        const newLinks = fbaState.data_circular.links.filter( links => links.target !== fbaState.deleteNodeCircular)
        const newData = {nodes: newDataNodes, links: newLinks}
        dispatch({type: 'SETDATACIRCULAR', payload: newData});
        dispatch({type:"SWITCHDELETEMODALCIRCULAR"})
    }

    const body = (
        <div className={classes.paper}>
            <h3>Are you sure you want to delete this node?</h3>
            <button className={"buttonDelete"} onClick={handleDeleteNode}>Yes</button>
            <button className={"buttonDelete"} onClick={() => dispatch({type: "SWITCHDELETEMODALCIRCULAR"})}>Cancel</button>
        </div>
    )
    return (
        <div>
            <Modal className={classes.modal} open={fbaState.showDeleteModal} onClose={() => dispatch({type: "SWITCHDELETEMODALCIRCULAR"})}>
                {body}
            </Modal>
        </div>
    )

}

export default DeleteNode
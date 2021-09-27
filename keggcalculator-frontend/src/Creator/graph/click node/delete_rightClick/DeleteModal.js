import React from "react";
import Modal from '@material-ui/core/Modal';
import {useDispatch, useSelector} from "react-redux";
import "./DeleteModal.css"
import {useStyles} from "../../../ModalStyles/ModalStyles";
import {getNLastChars} from "../../../usefulFunctions/Strings";


const DeleteModal = () => {
    const state = useSelector(state => state.graph)
    const generalState = useSelector(state => state.general)
    const dispatch = useDispatch()
    const classes = useStyles()
    console.log('general state')
    console.log(generalState)

    const handleDeleteNode = (e) => {
        e.preventDefault()
        const newDataNodes = state.data.nodes.filter(node => node.id !== state.deleteNode)
        const sourceLinks = state.data.links.filter(links => links.source !== state.deleteNode)
        const newLinks = sourceLinks.filter(links => links.target !== state.deleteNode)
        const newData = {nodes: newDataNodes, links: newLinks}
        const newReactions = generalState.reactionsInSelectArray.filter(reaction => reaction.reactionId !== getNLastChars(state.deleteNode, 6))
        newReactions.map(reaction => {
            console.log(reaction)
            reaction.substrates = reaction.substrates.filter(substrate => getNLastChars(substrate.name, 6) !== getNLastChars(state.deleteNode, 6))
            reaction.products = reaction.products.filter(product => getNLastChars(product.name, 6) !== getNLastChars(state.deleteNode, 6))
            delete reaction.stochiometrySubstratesString[getNLastChars(state.deleteNode, 6)]
            delete reaction.stochiometryProductsString[getNLastChars(state.deleteNode, 6)]
            return reaction
        })
        const newKeggReactions = generalState.keggReactions.filter(reaction => reaction.reactionId !== getNLastChars(state.deleteNode, 6))
        newKeggReactions.map(reaction => {
            reaction.substrates = reaction.substrates.filter(substrate => getNLastChars(substrate.name, 6) !== getNLastChars(state.deleteNode, 6))
            reaction.products = reaction.products.filter(product => getNLastChars(product.name, 6) !== getNLastChars(state.deleteNode, 6))
            delete reaction.stochiometrySubstratesString[getNLastChars(state.deleteNode, 6)]
            delete reaction.stochiometryProductsString[getNLastChars(state.deleteNode, 6)]
            return reaction
        })
        // console.log(newKeggReactions)
        dispatch({type: "SET_KEGG_REACTION", payload: newKeggReactions})
        dispatch({type: "SETREACTIONSINARRAY", payload: newReactions})
        dispatch({type: "SETDATA", payload: newData})
        dispatch({type: "SWITCHDELETEMODAL"})
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
            <Modal className={classes.modal} open={state.showDeleteModal}
                   onClose={() => dispatch({type: "SWITCHDELETEMODAL"})}>
                {body}
            </Modal>
        </div>
    )

}

export default DeleteModal

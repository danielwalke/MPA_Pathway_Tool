import React from "react";
import Modal from '@material-ui/core/Modal';
import {useDispatch, useSelector} from "react-redux";
import "./DeleteModal.css"
import {useStyles} from "../../../ModalStyles/ModalStyles";
import {getNLastChars} from "../../../usefulFunctions/Strings";
import {getKeggId} from "../../../../Flux Analysis/services/CreateFbaGraphData";

const getListOfContainingReactions = (links, deleteNode) => {
    const linksWithDeleteNode = links.filter(
        link => link.source === deleteNode || link.target === deleteNode)

    const reactionNodes = linksWithDeleteNode.map(link => {
        let reactionNodeId
        if (link.source === deleteNode) {
            reactionNodeId = link.target
        } else {
            reactionNodeId = link.source
        }
        return reactionNodeId
    })

    return reactionNodes
}

const deleteCompoundFromReactionsInSelectArray = (reactionsInSelectArray, containingReactionIds, keggIdFromNode) => {

    return reactionsInSelectArray.map(
        reaction => {
            if (containingReactionIds.includes(reaction.name)) {
                reaction.products = reaction.products.filter(product =>
                    getNLastChars(product.name, 6) !== keggIdFromNode
                )
                reaction.substrates = reaction.substrates.filter(substrate =>
                    getNLastChars(substrate.name, 6) !== keggIdFromNode
                )
                delete reaction.stochiometrySubstratesString[keggIdFromNode]
                delete reaction.stochiometryProductsString[keggIdFromNode]
            }
        }
    )
}

const deleteCompoundFromReactionArray = (reactionsInSelectArray, containingReactionIds, keggIdFromNode) => {

    return reactionsInSelectArray.map(
        reaction => {
            if (containingReactionIds.includes(reaction.reactionName)) {
                reaction.products = reaction.products.length > 0 ? reaction.products.filter(product =>
                    getNLastChars(product.name, 6) !== keggIdFromNode) : []
                reaction.substrates = reaction.substrates.length > 0 ? reaction.substrates.filter(substrate =>
                    getNLastChars(substrate.name, 6) !== keggIdFromNode) : []

                delete reaction.stochiometrySubstratesString[keggIdFromNode]
                delete reaction.stochiometryProductsString[keggIdFromNode]
            }
            return reaction
        }
    )
}

const DeleteModal = () => {
    const state = useSelector(state => state.graph)
    const generalState = useSelector(state => state.general)
    const dispatch = useDispatch()
    const classes = useStyles()

    const handleDeleteNode = (e) => {
        e.preventDefault()
        // if compound, get reaction nodes
        const keggIdFromNode = getNLastChars(state.deleteNode, 6)
        let newReactions
        console.log(state.deleteNode)

        if (keggIdFromNode.startsWith("C") || keggIdFromNode.startsWith("K")) {
            const containingReactionIds = getListOfContainingReactions(state.data.links, state.deleteNode)

            const newReactions = deleteCompoundFromReactionArray(
                generalState.reactionsInSelectArray, containingReactionIds, keggIdFromNode)
            const newKeggReactions = [...newReactions]

            console.log(newReactions)

            dispatch({type: "SET_KEGG_REACTION", payload: newKeggReactions})

        } else if (keggIdFromNode.startsWith("R") || keggIdFromNode.startsWith("U")) {

            // remove reaction from data array
            newReactions = generalState.reactionsInSelectArray.filter(
                reaction => reaction.reactionId !== getNLastChars(state.deleteNode, 6))
            console.log(newReactions)

        } else {
            throw "Can't delete this node because appended Id doesn't begin with C, K, R or U"
        }

        // remove node Object from graph data
        const newDataNodes = state.data.nodes.filter(node => node.id !== state.deleteNode)
        const sourceLinks = state.data.links.filter(links => links.source !== state.deleteNode)
        const newLinks = sourceLinks.filter(links => links.target !== state.deleteNode)
        const newData = {nodes: newDataNodes, links: newLinks}

        // console.log(newKeggReactions)
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

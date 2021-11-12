import Product from "../../../keggReaction/substrate and products/product/Product";
import Reaction from "../../../keggReaction/reaction/Reaction";
import React from "react";
import Modal from "@material-ui/core/Modal";
import {useDispatch, useSelector} from "react-redux";
import {useStyles} from "../../../ModalStyles/ModalStyles";
import AddExchangeReaction from "./AddExchangeReaction";
import "../../../../Styles.css"

const NextReactionModal = () => {
    const state = useSelector(state => state.keggReaction)
    const dispatch = useDispatch()
    const classes = useStyles()
    const body = (
        <div className={classes.paper} style={{width: "40vw", display: "flex", flexDirection: "column"}}>
            <div className={"separator-line"}>add KEGG reaction to compound</div>
            <Product />
            <Reaction />
            <div className={"separator-line"}>add exchange reaction to compound</div>
            <AddExchangeReaction/>
        </div>
    )

    return (
        <Modal className={classes.modal} open={state.showNextReaction}
               onClose={() => {
                   dispatch({type: "SWITCHSHOWNEXTREACTION"})
                   dispatch({type: "SETLOADING", payload: false})
                   dispatch({type: "SETSUBSTRATE", payload: ""})
               }}>
            {body}
        </Modal>
    )
}

export default NextReactionModal

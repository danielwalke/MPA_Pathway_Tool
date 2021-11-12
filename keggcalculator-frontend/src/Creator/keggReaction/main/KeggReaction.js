import React from "react";
import Substrate from "../substrate and products/substrate/Substrate";
import Product from "../substrate and products/product/Product";
import Reaction from "../reaction/Reaction";
import {useDispatch, useSelector} from "react-redux";
import "./KeggReaction.css"
import Modal from "@material-ui/core/Modal";
import {useStyles} from "../../ModalStyles/ModalStyles";

const KeggReaction = () => {
    const classes = useStyles()
    const state = useSelector(state => state.general)
    const dispatch = useDispatch()
    const body = (
        <div className={classes.paper} style={{width: "40vw"}}>
            <div>
                <Substrate className={"substrate"}/>
                <Product className={"product"}/>
                <Reaction className={"reaction"}/>
            </div>
        </div>
    )

    return (
        <Modal className={classes.modal} open={state.showKeggReaction}
               onClose={() => dispatch({type: "SWITCHSHOWKEGGREACTION"})}>
            {body}
        </Modal>

    )
}

export default KeggReaction

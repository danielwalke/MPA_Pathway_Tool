import Modal from "@material-ui/core/Modal";
import React from "react";
import {useStyles} from "../ModalStyles/ModalStyles";
import {useDispatch, useSelector} from "react-redux";
import EcReactions from "./EcReactions";
import KoReactions from "./KoReactions";

const MultiReactionModal = () => {
    const classes = useStyles()
    const state = useSelector(state => state.general)
    const dispatch = useDispatch();
    const body = (
        <div className={classes.paper}>
            <div className={"moduleListContainerloc"}>
                <button className={"downloadButton"} onClick={()=> dispatch({type: "SWITCHSHOWMODULELIST"})}>
                    KEGG- MODULE
                </button>
            </div>
            <div className={"ecReactionContainer"}>
                <EcReactions/>
                <button className={"downloadButton"} onClick={()=> dispatch({type:"SWITCHSHOWECMODAL"})}>import by EC- numbers</button>
            </div>
            <div className={"koReactionContainer"}>
                <KoReactions/>
                <button className={"downloadButton"} onClick={()=> dispatch({type:"SWITCHSHOWKOMODAL"})}>import by K- numbers</button>
            </div>
        </div>
    )
    return(
        <div>
            <Modal className={classes.modal} open={state.multiReactionModal} onClose={() => dispatch({type: "SWITCHMULTIREACTIONMODAL"})}>
                {body}
            </Modal>
        </div>
    )
}

export default MultiReactionModal
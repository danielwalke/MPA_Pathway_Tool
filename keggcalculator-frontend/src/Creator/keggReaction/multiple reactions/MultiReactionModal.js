import Modal from "@material-ui/core/Modal";
import React from "react";
import {useStyles} from "../../ModalStyles/ModalStyles";
import {useDispatch, useSelector} from "react-redux";
import EcReactions from "./EcReactions";
import KoReactions from "./KoReactions";
import MultipleKeggReactions from "./MultipleKeggReactions";
import {ToolTipBig} from "../../main/user-interface/UserInterface";

const MultiReactionModal = () => {
    const classes = useStyles()
    const state = useSelector(state => state.general)
    const dispatch = useDispatch();
    const body = (
        <div className={classes.paper}>
            <div className={"moduleListContainerloc"}>
                <ToolTipBig title={"Import a complete KEGG module"} placement={"right"}>
                    <button className={"downloadButton"} onClick={() => dispatch({type: "SWITCHSHOWMODULELIST"})}>
                        KEGG- MODULE
                    </button>
                </ToolTipBig>
            </div>
            <div className={"ecReactionContainer"}>
                <EcReactions/>
                <ToolTipBig title={"Import multiple reactions by given EC numbers"} placement={"right"}>
                    <button className={"downloadButton"} onClick={() => dispatch({type: "SWITCHSHOWECMODAL"})}>import by
                        EC- numbers
                    </button>
                </ToolTipBig>
            </div>
            <div className={"koReactionContainer"}>
                <KoReactions/>
                <ToolTipBig title={"Import multiple reactions by given K numbers"} placement={"right"}>
                    <button className={"downloadButton"} onClick={() => dispatch({type: "SWITCHSHOWKOMODAL"})}>import by
                        K- numbers
                    </button>
                </ToolTipBig>
            </div>
            <div>
                <MultipleKeggReactions/>
                <ToolTipBig title={"Import multiple reactions by given R numbers"} placement={"right"}>
                    <button className={"downloadButton"}
                            onClick={() => dispatch({type: "SWITCHSHOWMULTIPLEKEGGREACTIONS"})}>import by reaction-
                        numbers
                    </button>
                </ToolTipBig>
            </div>
        </div>
    )
    return (
        <div>
            <Modal className={classes.modal} open={state.multiReactionModal}
                   onClose={() => dispatch({type: "SWITCHMULTIREACTIONMODAL"})}>
                {body}
            </Modal>
        </div>
    )
}

export default MultiReactionModal

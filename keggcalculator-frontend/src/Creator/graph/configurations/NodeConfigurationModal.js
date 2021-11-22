import Modal from "@material-ui/core/Modal";
import React from "react";
import {useStyles} from "../../ModalStyles/ModalStyles";
import {useDispatch, useSelector} from "react-redux";
import {Checkbox} from "@material-ui/core";
import Abbreviations from "./abbreviations/Abbreviations";
import AbundantNodeConfig from "./split nodes/AbundantNodeConfig";
import PathwayTaxonomy from "./taxonomy/PathwayTaxonomy";
import MergeNodesModal from "./merge nodes/MergeNodesModal";
import NodeModifModal from "./nodeModification/NodeModifModal";
import Align from "./align/Align";
import {ToolTipBig} from "../../main/user-interface/UserInterface";

const NodeConfigurationModal = () => {
    const classes = useStyles()
    const state = useSelector(state => state.general)
    const graphState = useSelector(state => state.graph)
    const dispatch = useDispatch();

    const body = (
        <div className={classes.paper} style={{width: "20vw"}}>
            <div className={"configForceContainer"}>
                <ToolTipBig title={"Click for activating force in the pathway"} placement={"right"}>
                    <Checkbox style={{color: "rgb(150, 25, 130)"}} size={"small"} checked={!graphState.isForceDisabled}
                              onClick={() => dispatch({type: "SWITCHDISABLEFORCE"})}/>
                </ToolTipBig>force enabled

            </div>
            <div>
                <NodeModifModal/>
                <ToolTipBig title={"Click for modifying size and color of nodes"} placement={"right"}>
                    <button onClick={() => dispatch({type: "SWITCH_NODE_MODIFICATION_MODAL"})}
                            className={"download-button"}>node modification
                    </button>
                </ToolTipBig>
            </div>
            {/*<div>*/}
            {/*    <AddLinkModal/>*/}
            {/*    <button className={"downloadButton"} onClick={()=> dispatch({type:"SWITCHSHOWADDLINKMODAL"})}>add link</button>*/}
            {/*</div>*/}
            <div className={"abbreviationWrapper"}>
                <Abbreviations/>
                <ToolTipBig title={"Click for adding abbreviations to nodes"} placement={"right"}>
                    <button className={"download-button"} onClick={() => dispatch({type: "SWITCHSHOWABBREVIATIONS"})
                    }>abbreviation
                    </button>
                </ToolTipBig>
            </div>
            <div className={"splitNodesContainer"}>
                <AbundantNodeConfig/>
                <ToolTipBig title={"Click for splitting abundant nodes into single nodes"} placement={"right"}>
                    <button className={"download-button"} onClick={() => dispatch({type: "SWITCHSHOWABUNDANTNODECONFIG"})
                    }>split nodes
                    </button>
                </ToolTipBig>
            </div>
            <div>
                <MergeNodesModal/>
                <ToolTipBig title={"Click for merging nodes"} placement={"right"}>
                    <button className={"download-button"}
                            onClick={() => dispatch({type: "SWITCHSHOWMERGENODESMODAL"})}>merge nodes
                    </button>
                </ToolTipBig>
            </div>
            <div>
                <PathwayTaxonomy/>
                <ToolTipBig title={"Click for adding taxonomic requirements to reactions"} placement={"right"}>
                    <button className={"download-button"}
                            onClick={() => dispatch({type: "SWITCHSHOWPATHWAYTAXONOMY"})}>add Taxonomy
                    </button>
                </ToolTipBig>
            </div>
            {/*<div>*/}
            {/*    <NodeCoordinates/>*/}
            {/*    <button className={"downloadButton"} onClick={()=> {*/}
            {/*        dispatch({type:"SETOLDDATA", payload: graphState.data})*/}
            {/*        dispatch({type: "SWITCHSHOWNODECOORDINATESMODAL"})*/}
            {/*    }}>change node coordinates</button>*/}
            {/*</div>*/}
            <div>
                <Align/>
            </div>
        </div>
    )
    return (
        <div>
            <Modal className={classes.modal} open={state.nodeConfigurationModal}
                   onClose={() => dispatch({type: "SWITCHNODECONFIGURATIONMODAL"})}>
                {body}
            </Modal>
        </div>
    )
}

export default NodeConfigurationModal

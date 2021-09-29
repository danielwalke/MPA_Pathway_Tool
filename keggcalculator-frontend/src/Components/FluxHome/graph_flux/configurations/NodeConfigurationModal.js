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
const NodeConfigurationModal = () => {
    const classes = useStyles()
    const state = useSelector(state => state.general)
    const graphState = useSelector(state => state.graph)
    const dispatch = useDispatch();
    const body = (
        <div className={classes.paper} style={{width:"20vw"}}>
            <div className={"configForceContainer"}>
                <Checkbox style={{color: "rgb(150, 25, 130)"}} size={"small"} checked={!graphState.isForceDisabled}
                          onClick={() => dispatch({type: "SWITCHDISABLEFORCE"})}/>force enabled
            </div>
            <div>
                <NodeModifModal/>
                <button onClick={()=> dispatch({type:"SWITCH_NODE_MODIFICATION_MODAL"})} className={"downloadButton"}>node modification</button>
            </div>
            {/*<div>*/}
            {/*    <AddLinkModal/>*/}
            {/*    <button className={"downloadButton"} onClick={()=> dispatch({type:"SWITCHSHOWADDLINKMODAL"})}>add link</button>*/}
            {/*</div>*/}
            <div className={"abbreviationWrapper"}>
                <Abbreviations/>
                <button className={"downloadButton"} onClick={() => dispatch({type: "SWITCHSHOWABBREVIATIONS"})
                }>abbreviation
                </button>
            </div>
            <div className={"splitNodesContainer"}>
                <AbundantNodeConfig/>
                <button className={"downloadButton"} onClick={() => dispatch({type: "SWITCHSHOWABUNDANTNODECONFIG"})
                }>split nodes
                </button>
            </div>
            <div>
                <MergeNodesModal/>
                <button className={"downloadButton"} onClick={()=>dispatch({type:"SWITCHSHOWMERGENODESMODAL"})}>merge nodes</button>
            </div>
            <div>
                <PathwayTaxonomy/>
                <button className={"downloadButton"} onClick={()=> dispatch({type:"SWITCHSHOWPATHWAYTAXONOMY"})}>add Taxonomy</button>
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
    return(
        <div>
            <Modal className={classes.modal} open={state.nodeConfigurationModal} onClose={() => dispatch({type: "SWITCHNODECONFIGURATIONMODAL"})}>
                {body}
            </Modal>
        </div>
    )
}

export default NodeConfigurationModal
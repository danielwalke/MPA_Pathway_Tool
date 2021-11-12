import React from "react"
import "./SpecUserReaction.css"
import {handleSpecSubmit} from "../reaction/SpecReactionGraphConstruction";
import SpecSubstrates from "../substrates and products/substrate/SpecSubstrates";
import SpecProducts from "../substrates and products/product/SpecProducts";
import SpecReaction from "../reaction/SpecReaction";
import SpecTaxonomy from "../taxonomy/SpecTaxonomy";
import SpecKoEc from "../KoAndEcNumbers/SpecKoEc";
import {useDispatch, useSelector} from "react-redux";
import Modal from "@material-ui/core/Modal";
import {ToolTipBig} from "../../main/user-interface/UserInterface";
import {useStyles} from "../../ModalStyles/ModalStyles";

const SpecUserReaction = () => {
    const dispatch = useDispatch();
    const state = useSelector(state => state.general)
    const graphStates = useSelector(state => state.graph)
    const specReactionStates = useSelector(state => state.specificReaction)
    const numberOfExistentNodes = graphStates.data.nodes.length + specReactionStates.specSubstrates.length + specReactionStates.specProducts.length
    const classes = useStyles()
    const body = (
        <div className={classes.paper} style={{width: "40vw"}}>
            <div className={"mainContainerSpec"}>
                <SpecSubstrates className={"substrate"} index={numberOfExistentNodes}/>
                <SpecProducts className={"product"} index={numberOfExistentNodes}/>
                <SpecReaction className={"reaction"}/>
                <SpecKoEc className={"koAndEc"}/>
                <SpecTaxonomy className={"taxonomy"}/>
                <div className={"submitSpecReaction"}>
                    <ToolTipBig
                        title={"See reaction details"}
                        placement={"left"}>
                        <button className={"buttonShowReaction"}
                                onClick={() => dispatch({type: "SWITCHSHOWREACTIONDETAILS"})}>show Reaction
                        </button>
                    </ToolTipBig>
                    <ToolTipBig
                        title={"Submit reaction"}
                        placement={"right"}>
                        <button className={"buttonSpec"}
                                disabled={specReactionStates.specReaction.length < 1}
                                onClick={(e) => handleSpecSubmit(e, graphStates, specReactionStates, dispatch, state)}>Submit
                        </button>
                    </ToolTipBig>
                </div>

            </div>
        </div>
    )
    return (
        <Modal className={classes.modal} open={state.showSpecificReaction}
               onClose={() => dispatch({type: "SWITCHSHOWSPECIFICREACTION"})}>
            {body}
        </Modal>
    )
}

export default SpecUserReaction

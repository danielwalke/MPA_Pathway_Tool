import React from "react"
import "./SpecUserReaction.css"
import {handleSpecSubmit} from "../reaction/SpecReactionGraphConstruction";
import SpecSubstrates from "../substrates and products/substrate/SpecSubstrates";
import SpecProducts from "../substrates and products/product/SpecProducts";
import SpecReaction from "../reaction/SpecReaction";
import SpecTaxonomy from "../taxonomy/SpecTaxonomy";
import SpecKoEc from "../KoAndEcNumbers/SpecKoEc";
import {useDispatch, useSelector} from "react-redux";
import {makeStyles} from "@material-ui/core";
import Modal from "@material-ui/core/Modal";


const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        fontFamily: "Roboto",
        border: '2px solid rgb(150, 25, 130)',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    }
}));


const SpecUserReaction = () => {
    const dispatch = useDispatch();
    const state = useSelector(state => state.general)
    const graphStates = useSelector(state => state.graph)
    const specReactionStates = useSelector(state => state.specificReaction)
    const numberOfExistentNodes = graphStates.data.nodes.length + specReactionStates.specSubstrates.length + specReactionStates.specProducts.length
    const classes = useStyles()
    const body = (
        <div className={classes.paper} style={{width:"40vw"}}>
            <div className={"mainContainerSpec"}>
                <SpecSubstrates className={"substrate"} index={numberOfExistentNodes}/>
                <SpecProducts className={"product"} index={numberOfExistentNodes}/>
                <SpecReaction className={"reaction"}/>
                <SpecKoEc className={"koAndEc"}/>
                <SpecTaxonomy className={"taxonomy"}/>
                <div className={"submitSpecReaction"}>
                    <button className={"buttonShowReaction"} onClick={()=> dispatch({type:"SWITCHSHOWREACTIONDETAILS"})}>show Reaction</button>
                    <button className={"buttonSpec"}
                            disabled={specReactionStates.specReaction.length < 1}
                            onClick={(e) => handleSpecSubmit(e, graphStates, specReactionStates, dispatch,state)}>Submit
                    </button>
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
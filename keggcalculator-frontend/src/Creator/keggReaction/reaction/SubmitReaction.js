import {useDispatch, useSelector} from "react-redux";
import {handleSubmitReaction} from "../substrate and products/SubmitHandler";
import React from "react"
import "./Reaction.css"
import {isRequestValid} from "../../request/RequestValidation";
import {ToolTipBig} from "../../main/user-interface/UserInterface";

const SubmitReaction = () => {

    const state = {
        graphState: useSelector(state => state.graph),
        keggState: useSelector(state => state.keggReaction),
        generalState: useSelector(state => state.general)
    }
    const dispatch = useDispatch()
    return (
        <ToolTipBig title={"Submit chosen reaction"} placement={"right"}>
            <button
                disabled={!isRequestValid(state.keggState.reaction)}
                className={"submitButtonReaction"}
                onClick={(event) => {
                    event.preventDefault()
                    handleSubmitReaction(state, dispatch)
                }}> Submit reaction
            </button>
        </ToolTipBig>
    )
}

export default SubmitReaction

import {useDispatch, useSelector} from "react-redux";
import {handleSubmitReaction} from "./SubmitHandler";
import React from "react"
import "./Reaction.css"
import {isRequestValid} from "../request/RequestValidation";

const SubmitReaction = () => {
    const state = {
        graphState: useSelector(state => state.graph),
        keggState: useSelector(state => state.keggReaction),
        generalState: useSelector(state => state.general)
    }
    const dispatch = useDispatch()
    return (
        <button
            disabled={!isRequestValid(state.keggState.reaction)}
            className={"submitButtonReaction"}
            onClick={(event) => {
                event.preventDefault()
                handleSubmitReaction(state, dispatch)
            }}> Submit reaction</button>
    )
}

export default SubmitReaction
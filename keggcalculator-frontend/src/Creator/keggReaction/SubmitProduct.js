import {useDispatch, useSelector} from "react-redux";
import {handleSubmitProduct} from "./SubmitHandler";
import React from "react"
import "./Product.css"
import {isRequestValid} from "../request/RequestValidation";

const SubmitProduct = () => {
    const keggState = useSelector(state => state.keggReaction)
    const graphState = useSelector(state=> state.graph)
    const dispatch = useDispatch()
    const productId = keggState.product? keggState.product.substring(keggState.product.length - 6, keggState.product.length) : ""
    return(
        <button
            disabled={!isRequestValid(keggState.product)}
            className={"submitButtonProduct"}
            onClick={(event) => {
                event.preventDefault()
                const reactionList = handleSubmitProduct(productId, graphState, keggState, dispatch)
                console.table(reactionList)
                dispatch({type: "SETREACTIONS", payload: reactionList})
                dispatch({type: "ADDREACTIONSTOARRAY", payload: reactionList})
            }}> Submit Product</button>
    )
}

export default SubmitProduct
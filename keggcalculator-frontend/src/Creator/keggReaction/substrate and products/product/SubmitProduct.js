import {useDispatch, useSelector} from "react-redux";
import {handleSubmitProduct} from "../SubmitHandler";
import React from "react"
import "./Product.css"
import {isRequestValid} from "../../../request/RequestValidation";
import {ToolTipBig} from "../../../main/user-interface/UserInterface";
import "../../../download/DownloadGraph.css"

const SubmitProduct = () => {
    const keggState = useSelector(state => state.keggReaction)
    const dispatch = useDispatch()
    const productId = keggState.product ? keggState.product.substring(keggState.product.length - 6, keggState.product.length) : ""
    return (
        <ToolTipBig title={"Submit the chosen product"} placement={"right"}>
            <button
                disabled={!isRequestValid(keggState.product)}
                className={"download-button button-5rem"}
                onClick={(event) => {
                    event.preventDefault()
                    const reactionList = handleSubmitProduct(productId, keggState)
                    dispatch({type: "ADD_PRODUCT_TO_AUDIT_TRAIL", payload: keggState.product})
                    dispatch({type: "SETREACTIONS", payload: reactionList})
                    dispatch({type: "ADDREACTIONSTOARRAY", payload: reactionList})
                }}> Submit Product
            </button>
        </ToolTipBig>
    )
}

export default SubmitProduct

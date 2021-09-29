import {isRequestValid} from "../../../request/RequestValidation";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {handleSubmit} from "../SubmitHandler";
import "./Substrate.css"



const  SubmitSubstrate = () => {
    const keggState = useSelector(state => state.keggReaction)
    const dispatch = useDispatch()

    const setProducts = ({productList, prodReactionsMap}) => {
        dispatch({type: "SETPRODUCTS", payload: productList})
        dispatch({type: "SETPRODUCTREACTIONMAP", payload: prodReactionsMap})
    }

    const substrateId = keggState.substrate? keggState.substrate.substring(keggState.substrate.length - 6, keggState.substrate.length) : ""
    return(
        <button
            disabled={!isRequestValid(keggState.substrate)}
            className={"submitButtonSubstrate"}
            onClick={(event) => {
                event.preventDefault()
                dispatch({type: "SWITCHLOADING"})
                handleSubmit(substrateId)
                    .then(({productList, prodReactionsMap}) => setProducts({productList, prodReactionsMap}))
                    .then(() => dispatch({type: "SWITCHLOADING"}))

            }}> Submit Substrate</button>
    )
}

export default SubmitSubstrate
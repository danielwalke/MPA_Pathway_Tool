import Autocomplete from "@material-ui/lab/Autocomplete";
import {useDispatch, useSelector} from "react-redux";
import TextField from "@material-ui/core/TextField";
import SubmitProduct from "./SubmitProduct";
import React from "react"
import "./Product.css"
import "../../../main/Buttons.css"
import {ToolTipBig} from "../../../main/user-interface/UserInterface";

const Product = () => {
    const dispatch = useDispatch()
    const state = useSelector(state => state.keggReaction)

    const getProdList = () => {
        const prodList = []
        state.products.map((prod) => prodList.push(prod.compoundName.concat(" ").concat(prod.compoundId)))
        return (prodList)
    }

    return (
        <div className={"productContainer"}>
            <ToolTipBig title={"Search a product"} placement={"left"}>
            <Autocomplete
                size={"small"}
                id="productBox"
                options={getProdList()}
                className={"product"}
                name={"product"}
                onChange={(event, value) => {
                    dispatch({type: "SETPRODUCT", payload: value})
                }}
                renderInput={params => (
                    <TextField
                        onChange={(event) => dispatch({type: "SETPRODUCT", payload: event.target.value})}
                        value={state.product}
                        {...params}
                        label="Type in three letters..."
                        variant="outlined"
                    />
                )}
            />
            </ToolTipBig>
            <SubmitProduct className={"submit"}/>
        </div>

    )
}

export default Product

import Field from "./Field";
import TextField from "@material-ui/core/TextField";
import {handleAddProduct} from "./SpecReactionFunctions";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import "./SpecProduct.css"
import {isRequestValid} from "../request/RequestValidation";

const SpecProducts = () => {
    const dispatch = useDispatch()
    const state = useSelector(state => state.specificReaction)

    return (
        <div className={"productContainerSpec"}>
            <Field
                className={"product"}
                dispatchType={"SETSPECIFICPRODUCT"}
                id={"product"}
                dispatchTypeOptions={"SETSPECIFICOPTIONSPRODUCT"}
                options={state.specOptionsProduct}
                compound={state.specProduct}/>
                <TextField
                    size={"small"}
                    className={"productSc"}
                    defaultValue={0}
                    id="filled-number"
                    label="SC"
                    onChange={(e) => dispatch({
                        type: "SETSPECIFICPRODUCTCOEFF",
                        payload: e.target.value.toString()
                    })}
                    type="number"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    variant="filled"
                />
            <button className={"addProduct"}
                    disabled={!isRequestValid(state.specProduct)}
                    onClick={(e) => handleAddProduct(e, dispatch, state)}>Add Product</button>
        </div>
    )
}

export default SpecProducts
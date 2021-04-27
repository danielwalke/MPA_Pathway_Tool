import Field from "./Field";
import TextField from "@material-ui/core/TextField";
import {handleAddProduct} from "./SpecReactionFunctions";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import "./SpecProduct.css"
import {isRequestValid} from "../request/RequestValidation";
import PopOverButton from "./PopOverButton";
import {getCompoundId} from "../upload/sbmlParser/SbmlReader/ReaderFunctions";

const SpecProducts = (props) => {
    const dispatch = useDispatch()
    const state = useSelector(state => state.specificReaction)

    return (
        <div className={"productContainerSpec"}>
            {state.isSpecificCompoundInputProduct ?
                <TextField className={"product"} size={"small"} value={state.specProduct}
                           onChange={e => dispatch({type: "SETSPECIFICPRODUCT", payload: e.target.value})}
                           type={"text"}
                           label={"product"} id={"spec product"}/> :
            <Field
                className={"product"}
                dispatchType={"SETSPECIFICPRODUCT"}
                id={"product"}
                dispatchTypeOptions={"SETSPECIFICOPTIONSPRODUCT"}
                options={state.specOptionsProduct}
                compound={state.specProduct}/>}
            <PopOverButton text={" not found? :-(\n" +
            "                Don't worry! Click here :)"} className={"notFoundButton"}  dispatchType={"SWITCHISSPECCOMPOUNDINPUTPRODUCT"}/>
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
                    // disabled={!isRequestValid(state.specProduct)}
                    onClick={(e) => handleAddProduct(e, dispatch, state, props.index)}>Add Product</button>
        </div>
    )
}

export default SpecProducts
import React from "react";
import {useDispatch, useSelector} from "react-redux";

const QuantLimitInput = () => {
    const dispatch = useDispatch()
    const proteinState = useSelector(state => state.mpaProteins)
    return (
        <div>
            {proteinState.proteinSet.size > 0 &&
            <span className={"maxQuant"}>Max:<input style={{width: "3vw"}} type={"number"}
                                                    onChange={(e) => dispatch({
                                                        type: "SETMAXQUANTUSER",
                                                        payload: e.target.value
                                                    })} value={proteinState.maxQuantUser}/></span>}
            {proteinState.proteinSet.size > 0 &&
            <span className={"minQuant"}>Min: <input style={{width: "3vw"}} type={"number"}
                                                     onChange={(e) => dispatch({
                                                         type: "SETMINQUANTUSER",
                                                         payload: e.target.value
                                                     })} value={proteinState.minQuantUser}/></span>}
        </div>
    )
}

export default QuantLimitInput
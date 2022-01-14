import React, {useState} from "react";
import {ToolTipBig} from "../../Creator/main/user-interface/UserInterface";
import {useDispatch, useSelector} from "react-redux";
import {fba} from "./FluxBalanceAnalysis";

export function FBAWithAutopacmen(props) {

    const dispatch = useDispatch()
    const graphState = useSelector(state => state.graph)
    const generalState = useSelector(state => state.general)
    const proteinState = useSelector(state => state.mpaProteins)

    const handleOptimizeClick = async () => {
        props.setDisableOptimizeButton(true)
        await fba(generalState, dispatch, graphState, proteinState);
        props.setDisableOptimizeButton(false)
    }

    return(
        <div className={"helpContainer"}>
            <ToolTipBig title={"Create sMOMENT model and perform FBA and FVA"} placement={"right"}>
                <button
                    disabled={props.disableOptimizeButton}
                    className={"download-button"}
                    onClick={() => handleOptimizeClick()}
                    >
                    FBA with sMOMENT
                </button>
            </ToolTipBig>
        </div>
    )
}

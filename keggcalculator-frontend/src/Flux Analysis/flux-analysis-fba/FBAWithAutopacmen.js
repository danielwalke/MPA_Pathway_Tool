import React, {useState} from "react";
import {ToolTipBig} from "../../Creator/main/user-interface/UserInterface";
import {useDispatch, useSelector} from "react-redux";
import {fba} from "./FluxBalanceAnalysis";
import {CustomButton} from "../../Components/Home/Home";

export function FBAWithAutopacmen(props) {

    const dispatch = useDispatch()
    const graphState = useSelector(state => state.graph)
    const generalState = useSelector(state => state.general)
    const proteinState = useSelector(state => state.mpaProteins)
    const fluxState = useSelector(state => state.fluxAnalysis)

    const handleOptimizeClick = async () => {
        props.setDisableOptimizeButton(true)
        await fba(dispatch, generalState, graphState, proteinState, fluxState);
        props.setDisableOptimizeButton(false)
    }

    return(
        <div className={"helpContainer"}>
            <ToolTipBig title={"Create sMOMENT model and perform FBA and FVA"} placement={"right"}>
                <span>
                    <CustomButton
                    disabled={props.disableOptimizeButton}
                    className={"download-button"}
                    onClick={() => handleOptimizeClick()}
                >
                    FBA with sMOMENT
                </CustomButton>
                </span>
            </ToolTipBig>
        </div>
    )
}

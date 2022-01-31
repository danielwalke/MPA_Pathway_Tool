import React from "react";
import {ToolTipBig} from "../../Creator/main/user-interface/UserInterface";
import {useDispatch, useSelector} from "react-redux";
import {fba} from "./FluxBalanceAnalysis";
import {CustomButton} from "../../Components/Home/Home";

export function FBAWithAutopacmen() {

    const dispatch = useDispatch()
    const graphState = useSelector(state => state.graph)
    const generalState = useSelector(state => state.general)
    const proteinState = useSelector(state => state.mpaProteins)
    const fluxState = useSelector(state => state.fluxAnalysis)

    const handleOptimizeClick = async () => {
        dispatch({type:"DISABLE_OPTIMIZE_BUTTONS", payload: true})
        await fba(dispatch, generalState, graphState, proteinState, fluxState);
        dispatch({type:"DISABLE_OPTIMIZE_BUTTONS", payload: false})
    }

    return(
        <div className={"helpContainer"}>
            <ToolTipBig title={"Create sMOMENT model and perform FBA and FVA"} placement={"right"}>
                <span>
                    <CustomButton
                        size="small"
                    disabled={fluxState.disableOptimizationButtons || !fluxState.sMomentIsConfigured}
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

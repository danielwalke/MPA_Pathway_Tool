import React, {useState} from "react";
import {ToolTipBig} from "../../Creator/main/user-interface/UserInterface";
import {useDispatch, useSelector} from "react-redux";
import {triggerLoadingWarning} from "../../Creator/main/lib/LoadingWarning";

export function FBAWithAutopacmen(props) {

    const dispatch = useDispatch()
    const generalState = useSelector(state => state.general)
    const fluxState = useSelector(state => state.fluxAnalysis)

    const handleOptimizeClick = async () => {
        if (!generalState.loading) {
            triggerLoadingWarning(dispatch)
        }
        props.setDisableOptimizeButton(true)

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

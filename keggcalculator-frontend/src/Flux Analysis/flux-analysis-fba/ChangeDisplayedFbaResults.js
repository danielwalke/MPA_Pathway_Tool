import {ToolTipBig} from "../../Creator/main/user-interface/UserInterface";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {createFbaGraphData} from "../services/createFbaGraphData";
import {CustomButton} from "../../Components/Home/Home";


export default function ChangeDisplayedFBAResults() {

    const graphState = useSelector(state => state.graph)
    const fluxState = useSelector(state => state.fluxAnalysis)

    const dispatch = useDispatch()

    const handleSwitchResults = () => {

        let fba_data

        if (!fluxState.showSMomentFlux) {
            fba_data = fluxState.sMomentFlux
        } else {
            fba_data = fluxState.flux
        }

        const newGraphData = createFbaGraphData(graphState, fba_data)
        dispatch({type: "TOGGLE_FBA_RESULTS"})
        dispatch({type: "SET_FLUX_GRAPH", payload: newGraphData.data})
    }

    return(
        <div className={"helpContainer"}>
            <ToolTipBig title={"Toggle between fba results of the original and sMOMENT models"} placement={"right"}>
                <span>
                    <CustomButton
                        size="small"
                    disabled={!fluxState.sMomentFlux}
                    className={"download-button"}
                    onClick={() => handleSwitchResults()}
                >
                    Toggle FBA results
                </CustomButton>
                </span>
            </ToolTipBig>
        </div>
    )
}

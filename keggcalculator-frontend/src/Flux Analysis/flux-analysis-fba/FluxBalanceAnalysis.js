import {ToolTipBig} from "../../Creator/main/user-interface/UserInterface";
import React, {useState} from "react";
import {parseRequestArray, responseToMap} from "../services/ParseRequestArray";
import {createFbaGraphData} from "../services/CreateFbaGraphData";
import {useDispatch, useSelector} from "react-redux";
import {triggerLoadingWarning} from "../../Creator/main/lib/LoadingWarning";
import {startFBAJob} from "./fbaJobSubmission";

export default function FluxBalanceAnalysis(props) {

    const graphState = useSelector(state => state.graph)
    const dispatch = useDispatch()
    const generalState = useSelector(state => state.general)
    const fluxState = useSelector(state => state.fluxAnalysis)

    const handleOptimizeClick = async () => {
        if (!generalState.loading) {
            triggerLoadingWarning(dispatch)
        }
        props.setDisableOptimizeButton(true)

        const requestReactionObj = parseRequestArray(generalState.reactionsInSelectArray)

        const response = await startFBAJob(dispatch, requestReactionObj)

        const fbaData = await responseToMap(JSON.parse(response))
        const newGraphData = createFbaGraphData(graphState, fbaData)

        // const dummyDataResponse = await getDummyFluxData(generalState.reactionsInSelectArray)
        // const newGraphData = createFbaGraphDummyData(fluxState, dummyDataResponse.data)

        const newReactionsInSelectArray = [...generalState.reactionsInSelectArray]

        dispatch({type: "SET_FBA_RESULTS", payload: fbaData})
        dispatch({type: "SET_FLUX_GRAPH", payload: newGraphData.data})
        dispatch({type: "SETREACTIONSINARRAY", payload: newReactionsInSelectArray})
        triggerLoadingWarning(dispatch)
        props.setDisableOptimizeButton(false)
    }

    return(
        <div className={"helpContainer"}>
            <ToolTipBig title={"perform FBA and FVA for the displayed network"} placement={"right"}>
                <button
                    disabled={props.disableOptimizeButton}
                    className={"download-button"}
                    onClick={() => handleOptimizeClick()}>
                    Flux Balance Analysis
                </button>
            </ToolTipBig>
        </div>
    )
}

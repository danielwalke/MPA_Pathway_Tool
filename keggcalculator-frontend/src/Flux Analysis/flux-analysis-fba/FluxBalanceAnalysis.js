import {ToolTipBig} from "../../Creator/main/user-interface/UserInterface";
import React from "react";
import {parseRequestArray, responseToMap} from "../services/parseRequestArray";
import {createFbaGraphData} from "../services/createFbaGraphData";
import {useDispatch, useSelector} from "react-redux";
import {triggerLoadingWarning} from "../../Creator/main/lib/LoadingWarning";
import {startFBAJob} from "./fbaJobSubmission";
import {parseProteinData} from "../services/parseProteinData";

export async function fba(generalState, dispatch, graphState, proteinState) {

    if (!generalState.loading) {
        triggerLoadingWarning(dispatch)
    }

    const networkObj = parseRequestArray(generalState.reactionsInSelectArray)
    const proteinData = []


    if (typeof proteinState !== 'undefined' && proteinState.proteinSet.size > 0) {
        proteinData.push(...parseProteinData(generalState.reactionsInSelectArray, proteinState))
    }

    const response = await startFBAJob(dispatch, networkObj, proteinData)

    const {origModelFbaData, sMomentFBAData} = responseToMap(JSON.parse(response))

    const newGraphData = createFbaGraphData(graphState, origModelFbaData)

    dispatch({type: "SET_FBA_RESULTS", payload: origModelFbaData})
    dispatch({type: "SET_SMOMENT_FBA_RESULTS", payload: sMomentFBAData})
    dispatch({type: "SET_FLUX_GRAPH", payload: newGraphData.data})
    dispatch({type: "SETREACTIONSINARRAY", payload: [...generalState.reactionsInSelectArray]})
    triggerLoadingWarning(dispatch)
}

export default function FluxBalanceAnalysis(props) {

    const graphState = useSelector(state => state.graph)
    const dispatch = useDispatch()
    const generalState = useSelector(state => state.general)
    const fluxState = useSelector(state => state.fluxAnalysis)

    const handleOptimizeClick = async() => {
        props.setDisableOptimizeButton(true)
        await fba(generalState, dispatch, graphState);
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

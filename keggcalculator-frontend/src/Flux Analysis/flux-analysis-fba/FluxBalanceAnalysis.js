import {ToolTipBig} from "../../Creator/main/user-interface/UserInterface";
import React, {useState} from "react";
import {parseRequestArray, responseToMap} from "../services/ParseRequestArray";
import {requestGenerator} from "../../Creator/request/RequestGenerator";
import {endpoint_postNetworkForFBA} from "../../App Configurations/RequestURLCollection";
import {createFbaGraphData} from "../services/CreateFbaGraphData";
import {useDispatch, useSelector} from "react-redux";
import {triggerLoadingWarning} from "../../Creator/main/lib/LoadingWarning";

export default function FluxBalanceAnalysis() {

    const dispatch = useDispatch()
    const generalState = useSelector(state => state.general)
    const fluxState = useSelector(state => state.fluxAnalysis)
    const [buttonDisabled, setButtonDisabled] = useState(false)

    const handleOptimizeClick = async () => {
        if (!generalState.loading) {
            triggerLoadingWarning(dispatch)
        }
        setButtonDisabled(true)
        const requestReactionObj = await parseRequestArray(generalState.reactionsInSelectArray)

        console.log(requestReactionObj)

        const response = await requestGenerator(
            "POST", endpoint_postNetworkForFBA, "", "", requestReactionObj)
        const fbaData = await responseToMap(response.data)
        const newGraphData = createFbaGraphData(fluxState, fbaData)

        // const dummyDataResponse = await getDummyFluxData(generalState.reactionsInSelectArray)
        // const newGraphData = createFbaGraphDummyData(fluxState, dummyDataResponse.data)

        const newReactionsInSelectArray = [...generalState.reactionsInSelectArray]

        dispatch({type: "SET_FBA_RESULTS", payload: fbaData})
        dispatch({type: "SET_FLUX_GRAPH", payload: newGraphData.data})
        dispatch({type: "SETREACTIONSINARRAY", payload: newReactionsInSelectArray})
        triggerLoadingWarning(dispatch)
        setButtonDisabled(false)
    }

    return(
        <div className={"helpContainer"}>
            <ToolTipBig title={"perform FBA and FVA for the displayed network"} placement={"right"}>
                <button
                    disabled={buttonDisabled}
                    className={"download-button"}
                    onClick={() => handleOptimizeClick()}>
                    Optimize
                </button>
            </ToolTipBig>
        </div>
    )
}

import {ToolTipBig} from "../../Creator/main/user-interface/UserInterface";
import React from "react";
import {parseRequestArray} from "../services/ParseRequestArray";
import {requestGenerator} from "../../Creator/request/RequestGenerator";
import {endpoint_postNetworkForFBA} from "../../App Configurations/RequestURLCollection";
import {createFbaGraphData} from "../services/CreateFbaGraphData";
import {useDispatch, useSelector} from "react-redux";

export default function FluxBalanceAnalysis() {

    const dispatch = useDispatch()
    const generalState = useSelector(state => state.general)
    const fluxState = useSelector(state => state.fluxAnalysis)

    const handleOptimizeClick = async () => {
        const requestReactionObj = await parseRequestArray(generalState.reactionsInSelectArray)
        const response = await requestGenerator(
            "POST", endpoint_postNetworkForFBA, "", "", requestReactionObj)
        const newGraphData = createFbaGraphData(fluxState, response.data)

        // const dummyDataResponse = await getDummyFluxData(generalState.reactionsInSelectArray)
        // const newGraphData = createFbaGraphDummyData(fluxState, dummyDataResponse.data)

        const newReactionsInSelectArray = [...generalState.reactionsInSelectArray]
        newReactionsInSelectArray.forEach(reaction => {
            const fluxObj = response.data.find(flux =>
                Object.keys(flux)[0] === reaction.reactionId)
            console.log(fluxObj)
            reaction.flux = fluxObj[Object.keys(fluxObj)[0]].fbaSolution
        })
        dispatch({type: "SET_FLUX_GRAPH", payload: newGraphData.data})
        dispatch({type: "SETREACTIONSINARRAY", payload: newReactionsInSelectArray})
    }

    return(
        <div className={"helpContainer"}>
            <ToolTipBig title={"perform FBA and FVA for the displayed network"} placement={"right"}>
                <button className={"download-button"} onClick={() => handleOptimizeClick()}>
                    Optimize
                </button>
            </ToolTipBig>
        </div>
    )
}

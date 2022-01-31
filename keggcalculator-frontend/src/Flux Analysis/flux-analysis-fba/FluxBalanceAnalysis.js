import {ToolTipBig} from "../../Creator/main/user-interface/UserInterface";
import React from "react";
import {parseRequestArray, responseToMap} from "../services/parseRequestArray";
import {createFbaGraphData} from "../services/createFbaGraphData";
import {useDispatch, useSelector} from "react-redux";
import {triggerLoadingWarning} from "../../Creator/main/lib/LoadingWarning";
import {startFBAJob} from "./fbaJobSubmission";
import {parseProteinData} from "../services/parseProteinData";
import {getTaxaList} from "../../Creator/graph/double click node/StuctureModalBody";
import {CustomButton} from "../../Components/Home/Home";
import * as RequestURL from "../../App Configurations/RequestURLCollection";

export async function fba(dispatch, generalState, graphState, proteinState, fluxState) {

    if (!generalState.loading) {
        triggerLoadingWarning(dispatch)
    }
    dispatch({type: "SET_FBA_RESULTS", payload: null})
    dispatch({type: "SET_SMOMENT_FBA_RESULTS", payload: null})

    const networkObj = parseRequestArray(generalState.reactionsInSelectArray)
    const proteinData = []


    if (typeof proteinState !== 'undefined' && proteinState.proteinSet.size > 0) {
        proteinData.push(...parseProteinData(generalState.reactionsInSelectArray, proteinState))
    }

    const configurations =  fluxState ? fluxState.sMomentConfigurations : {}

    const pathwayTaxonomySet = new Set()
    generalState.reactionsInSelectArray.forEach(
        reaction => getTaxaList(reaction.taxa).forEach(taxon => pathwayTaxonomySet.add(taxon)))
    const networkTaxa = Array.from(pathwayTaxonomySet)

    const response = await startFBAJob(networkObj, proteinData, configurations, networkTaxa)

    const {origModelFbaData, sMomentFBAData} = responseToMap(JSON.parse(response.fbaSolution))

    const newGraphData = createFbaGraphData(graphState, origModelFbaData)

    dispatch({type: "SET_FBA_RESULTS", payload: origModelFbaData})
    dispatch({type: "SET_SMOMENT_FBA_RESULTS", payload: sMomentFBAData})
    dispatch({type: "SET_FLUX_GRAPH", payload: newGraphData.data})
    dispatch({type: "SETREACTIONSINARRAY", payload: [...generalState.reactionsInSelectArray]})

    if(sMomentFBAData) {
        console.log(response)
        dispatch({type: "SET_SMOMENT_DOWNLOAD_LINK", payload: `${RequestURL.endpoint_downloadSMomentModel}/${response.jobId}`})
    }

    triggerLoadingWarning(dispatch)
}

export default function FluxBalanceAnalysis() {

    const graphState = useSelector(state => state.graph)
    const fluxState = useSelector(state => state.fluxAnalysis)
    const generalState = useSelector(state => state.general)
    const dispatch = useDispatch()

    const handleOptimizeClick = async() => {
        dispatch({type:"DISABLE_OPTIMIZE_BUTTONS", payload: true})
        await fba(dispatch, generalState, graphState);
        dispatch({type:"DISABLE_OPTIMIZE_BUTTONS", payload: false})
    }

    return(
        <div className={"helpContainer"}>
            <ToolTipBig title={"perform FBA and FVA for the displayed network"} placement={"right"}>
                <span>
                    <CustomButton
                        size="small"
                        disabled={fluxState.disableOptimizationButtons}
                        className={"download-button"}
                        onClick={() => handleOptimizeClick()}>
                        Flux Balance Analysis
                    </CustomButton>
                </span>
            </ToolTipBig>
        </div>
    )
}

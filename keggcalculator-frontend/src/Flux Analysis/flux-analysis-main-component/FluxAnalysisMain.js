import React, {useEffect, useState} from "react";
import FluxAnalysisUserInterface from "../flux-analysis-user-interface/FluxAnalysisUserInterface";
import FluxAnalysisGraphVisualization from "../flux-analysis-graph-visualization/FluxAnalysisGraphVisualization";
import GraphModal from "../flux-analysis-modals/GraphModal";
import {useDispatch, useSelector} from "react-redux";

export default function FluxAnalysisMain(){
    const fluxState = useSelector(state => state.fluxAnalysis)
    const generalState = useSelector(state => state.general)
    const [mouseCoordinates, setMouseCoordinates] = useState({x: "", y: ""})

    const dispatch = useDispatch()

    useEffect(() => {
        console.log(fluxState)
    },[fluxState])

    useEffect(() => {
        generalState.reactionsInSelectArray.forEach(reaction => {
            // initialize reactions that don't have required properties
            reaction.lowerBound = typeof reaction.lowerBound !== "undefined" ?
                reaction.lowerBound : reaction.reversible ?
                    -1000.0 : 0.0
            if (typeof reaction.upperBound === "undefined") reaction.upperBound = 1000.0
            if (typeof reaction.objectiveCoefficient === "undefined") reaction.objectiveCoefficient = 0
            if (!reaction.hasOwnProperty("exchangeReaction")) reaction.exchangeReaction = false
        })

        if (generalState.reactionsInSelectArray.length > 0) {
            dispatch({type: "SET_STATUS", payload: {alert: false, message: "ready"}})
        } else {
            dispatch({type: "SET_STATUS", payload: {alert: true, message: "no network"}})
        }
    },[])

    return (
        <div className={"mainContainer"}
             onClick={(e) => {
                 !fluxState.showGraphModal && setMouseCoordinates({x: String(e.clientX), y: String(e.clientY)}
             )}}
        >
            <div className={"main"}>
                <FluxAnalysisUserInterface reactionArray={generalState.reactionsInSelectArray}/>
                <FluxAnalysisGraphVisualization />
                {
                    fluxState.showGraphModal &&
                    <GraphModal mouseCoordinates={mouseCoordinates} />
                }
            </div>
        </div>
    )
}

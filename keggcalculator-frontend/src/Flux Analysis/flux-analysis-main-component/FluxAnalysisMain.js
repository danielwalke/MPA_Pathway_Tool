import React, {useEffect, useState} from "react";
import FluxAnalysisUserInterface from "../flux-analysis-user-interface/FluxAnalysisUserInterface";
import FluxAnalysisGraphVisualization from "../flux-analysis-graph-visualization/FluxAnalysisGraphVisualization";
import GraphModal from "../flux-analysis-modals/GraphModal";
import {useSelector} from "react-redux";

export default function FluxAnalysisMain(){
    const fluxState = useSelector(state => state.fluxAnalysis)
    const generalState = useSelector(state => state.general)
    const [mouseCoordinates, setMouseCoordinates] = useState({x: "", y: ""})

    useEffect(() => {
        generalState.reactionsInSelectArray.forEach(reaction => {
            console.log(reaction)
            reaction.lowerBound = !reaction.lowerBound && !reaction.reversible ? 0.0 : -1000.0
            if (!reaction.upperBound) reaction.upperBound = 1000.0
            if (!reaction.objectiveCoefficient) reaction.objectiveCoefficient = 0
            if (!reaction.hasOwnProperty("exchangeReaction")) reaction.exchangeReaction = false
            reaction.flux = undefined
        })
    },[])

    console.log(fluxState.showGraphModal)

    return (
        <div className={"mainContainer"}
             onClick={(e) => {
                 console.log("HEllo")
                 !fluxState.showGraphModal && setMouseCoordinates({x: String(e.clientX), y: String(e.clientY)}
             )}}>
            <div className={"main"}>
                <FluxAnalysisUserInterface />
                <FluxAnalysisGraphVisualization />
                {
                    fluxState.showGraphModal &&
                    <GraphModal mouseCoordinates={mouseCoordinates} />
                }
            </div>
        </div>
    )
}

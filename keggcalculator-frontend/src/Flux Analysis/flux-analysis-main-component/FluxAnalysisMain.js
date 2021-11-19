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
            if (!reaction.lowerBound) reaction.lowerBound = -1000.0
            if (!reaction.upperBound) reaction.upperBound = 1000.0
            if (!reaction.objectiveCoefficient) reaction.objectiveCoefficient = 0
            if (!reaction.type) reaction.type = "nonexchange"
            reaction.flux = undefined
        })
    },[])

    return (
        <div className={"mainContainer"}
             onClick={(e) => {
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

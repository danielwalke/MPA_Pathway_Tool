import React, {useState} from "react";
import FluxAnalysisUserInterface from "../flux-analysis-user-interface/FluxAnalysisUserInterface";
import FluxAnalysisGraphVisualization from "../flux-analysis-graph-visualization/FluxAnalysisGraphVisualization";
import GraphModal from "../flux-analysis-modals/GraphModal";
import {useSelector} from "react-redux";

export default function FluxAnalysisMain(){
    const fluxState = useSelector(state => state.fluxAnalysis)
    const [windowCoordinates, setWindowCoordinates] = useState({x: "", y: ""})

    return (
        <div className={"mainContainer"}
             onClick={(e) => setWindowCoordinates({x: String(e.clientX), y: String(e.clientY)})}>
            <div className={"main"}>
                <FluxAnalysisUserInterface />
                <FluxAnalysisGraphVisualization />
                {
                    fluxState.showGraphModal &&
                    <GraphModal windowCoordinates={windowCoordinates} />
                }
            </div>
        </div>
    )
}

import React from "react";
import FluxAnalysisUserInterface from "../flux-analysis-user-interface/FluxAnalysisUserInterface";
import FluxAnalysisGraphVisualization from "../flux-analysis-graph-visualization/FluxAnalysisGraphVisualization";

export default function FluxAnalysisMain(){

    return (
        <div className={"mainContainer"}>
            <div className={"main"}>
                <FluxAnalysisUserInterface />
                <FluxAnalysisGraphVisualization />
            </div>
        </div>
    )
}

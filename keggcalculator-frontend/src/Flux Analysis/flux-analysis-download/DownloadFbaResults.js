import {ToolTipBig} from "../../Creator/main/user-interface/UserInterface";
import React from "react";
import {useSelector} from "react-redux";
import {saveAs} from "file-saver";
import {createFluxAnalysisCsv} from "../services/CreateFluxAnalysisCsv";

export default function DownloadFbaResults() {

    const fluxState = useSelector(state => state.fluxAnalysis)

    const handleFbaResultDownload = () => {
        try {
            const blob = createFluxAnalysisCsv(fluxState.flux)
            saveAs(blob, "Flux_Analysis_Results.csv")
            // dispatch({type: "ADD_CSV_DOWNLOAD_TO_AUDIT_TRAIL"})
        } catch (e) {
            console.log(e)
        }
    }

    return(
        <div>
            <ToolTipBig title={"Download results of FVA and FBA as .csv"} placement={"right"}>
                <button
                    disabled={!fluxState.flux}
                    className={"download-button"}
                    onClick={() => handleFbaResultDownload()}>
                    Download Results
                </button>
            </ToolTipBig>
        </div>
    )
}

import {ToolTipBig} from "../../Creator/main/user-interface/UserInterface";
import React from "react";
import {useSelector} from "react-redux";
import {saveAs} from "file-saver";
import {createFluxAnalysisCsv} from "../services/createFluxAnalysisCsv";
import {CustomButton} from "../../Components/Home/Home";

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
                <span>
                    <CustomButton
                        size="small"
                        disabled={!fluxState.flux}
                        className={"download-button"}
                        onClick={() => handleFbaResultDownload()}>
                        Download Results
                    </CustomButton>
                </span>
            </ToolTipBig>
        </div>
    )
}

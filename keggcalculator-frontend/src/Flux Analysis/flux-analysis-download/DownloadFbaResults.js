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
            let zip = require("jszip")()
            const fluxData = zip.folder("flux_analysis_data")

            const origModelFluxData = createFluxAnalysisCsv(fluxState.flux)
            fluxData.file("original_model_flux_data.csv", new File(new Array(origModelFluxData), "original_model_flux_data.csv"))

            const origModelSplitFluxData = createFluxAnalysisCsv(fluxState.fluxSplit)
            fluxData.file("original_model_split_flux_data.csv", new File(new Array(origModelSplitFluxData), "original_model_split_flux_data.csv"))

            if (fluxState.sMomentFlux) {
                const sMomentModelFluxData = createFluxAnalysisCsv(fluxState.sMomentFlux)
                fluxData.file("smoment_model_flux_data.csv", new File(new Array(sMomentModelFluxData), "smoment_model_flux_data.csv"))
            }
            if (fluxState.sMomentSplitFluxes) {
                const sMomentModelSplitFluxData = createFluxAnalysisCsv(fluxState.sMomentSplitFluxes)
                fluxData.file("smoment_model_flux_data_split_reactions.csv", new File(new Array(sMomentModelSplitFluxData), "smoment_model_flux_data_split_reactions.csv"))
            }
            zip.generateAsync({type: "blob"}).then((content) => {
                saveAs(content, "flux_analysis_data.zip");
            });
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

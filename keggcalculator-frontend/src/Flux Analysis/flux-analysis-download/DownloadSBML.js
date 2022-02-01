import React from "react";
import {CustomButton} from "../../Components/Home/Home";
import {requestGenerator} from "../../Request Generator/RequestGenerator";
import {saveAs} from "file-saver";
import {useSelector} from "react-redux";
import {ToolTipBig} from "../../Creator/main/user-interface/UserInterface";

export default function DownloadSBML() {

    const fluxState = useSelector(state => state.fluxAnalysis)

    const handleSBMLDownload = () => {
        requestGenerator("GET", fluxState.sMOMENTDownloadLink, "", "", "").then(response => {
            if (response.status === 200) {
                let blob = new Blob(new Array(response.data), {type: "text/plain;charset=utf-8"});
                saveAs(blob, "sMomentModel.xml")
            } else {
                console.log('FAIL')
            }
        })
    }

    return(
        <div>
            <ToolTipBig title={"Toggle between fba results of the original and sMOMENT models"} placement={"right"}>
                <span>
                    <CustomButton
                        disabled={!fluxState.sMOMENTDownloadLink}
                        onClick={
                            () => handleSBMLDownload()
                        }>
                        Download SMoment SBML
                    </CustomButton>
                </span>
            </ToolTipBig>
        </div>
    )
}

import React, {useEffect} from "react";
import {useSelector} from "react-redux";

export default function StatusContainer() {

    const fluxState = useSelector(state => state.fluxAnalysis)

    useEffect(() => {
        console.log(fluxState.fluxAnalysisStatus)
    },)


    return(
        <div className={"status-container"}>
            <h5 className={"status-header"}>Status</h5>
            <div className={"status-field"}>
                {fluxState.fluxAnalysisStatus}
            </div>
        </div>
    )
}

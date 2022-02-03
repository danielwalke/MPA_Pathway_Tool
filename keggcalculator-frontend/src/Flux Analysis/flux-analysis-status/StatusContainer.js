import React from "react";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import {useSelector} from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";

export default function StatusContainer() {

    const fluxState = useSelector(state => state.fluxAnalysis)
    const generalState = useSelector(state => state.general)

    return(
        <div className={"status-container"}>
            <h5 className={"status-header"}>Status</h5>
            <div className={"status-field"}>
                {fluxState.fluxAnalysisStatus.alert && <ErrorOutlineIcon style={{color: "rgb(150, 25, 130)"}}/>}
                <p style={{marginBottom: "1rem", marginTop: "0"}}>{fluxState.fluxAnalysisStatus.message}</p>
                {generalState.loading && <CircularProgress/>}
            </div>
        </div>
    )
}

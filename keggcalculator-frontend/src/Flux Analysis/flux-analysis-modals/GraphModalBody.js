import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import "../FluxAnalysisStyles.css"
import ReactionSettings from "./ReactionSettings";

export default function GraphModalBody() {

    const fluxState = useSelector(state => state.fluxAnalysis)
    const [dataObj, setDataObj] = useState({})

    useEffect(() => {
        setDataObj(fluxState.graphModalInput)
    }, [fluxState.graphModalInput])

    return (
        <div className={"graph-modal-compound"}>
            {dataObj.type === "compound" &&
            <React.Fragment>
                <span>ID: {dataObj.name}</span>
                <span>Abbreviation: {dataObj.abbreviation}</span>
            </React.Fragment>
            }
            {dataObj.type === "reaction" &&
            <React.Fragment>
                <span>ID: {dataObj.reactionId}</span>
                <ReactionSettings dataObj={dataObj} setDataObj={setDataObj}/>
            </React.Fragment>}
        </div>
    )
}

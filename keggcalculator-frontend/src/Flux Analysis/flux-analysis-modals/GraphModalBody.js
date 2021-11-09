import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import "../FluxAnalysisStyles.css"
import ReactionSettings from "./ReactionSettings";

export default function GraphModalBody() {

    const fluxState = useSelector(state => state.fluxAnalysis)
    const [dataObj, setDataObj] = useState({})

    useEffect(() => {
        setDataObj(fluxState.graphModalInput)
    },[fluxState.graphModalInput])

    if (dataObj.type) {
        if (dataObj.type === "compound") {
            return (
                <div className={"graph-modal-compound"}>
                    <p>ID: {dataObj.name}</p>
                    <p>Abbreviation: {dataObj.abbreviation}</p>
                </div>
            )
        } else if (dataObj.type === "reaction") {
            console.log("hi")
            return (
                <div className={"graph-modal-compound"}>
                    <p>ID: {dataObj.reactionId}</p>
                    <ReactionSettings dataObj={dataObj}/>
                </div>
            )
        }
    }
    return (
        <div></div>
    )
}

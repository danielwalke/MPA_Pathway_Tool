import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
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
                    <span>ID: {dataObj.name}</span>
                    <span>Abbreviation: {dataObj.abbreviation}</span>
                </div>
            )
        } else if (dataObj.type === "reaction") {
            console.log("hi")
            return (
                <div className={"graph-modal-compound"}>
                    <span>ID: {dataObj.reactionId}</span>
                    <ReactionSettings dataObj={dataObj} setDataObj={setDataObj}/>
                </div>
            )
        }
    }
    return (
        <div></div>
    )
}

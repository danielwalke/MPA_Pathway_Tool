import React, {useEffect, useRef, useState} from "react";
import StyledSlider from "./StyledSlider";
import FluxIndicator from "./FluxIndicator";
import "../../Creator/upload/sbmlParser/annotationModal/AnnotationTable.css"
import {useDispatch, useSelector} from "react-redux";
import {TextField} from "@material-ui/core";

export default function ReactionSettings({dataObj}) {

    const generalState = useSelector(state => state.general)

    const dispatch = useDispatch()

    const [bounds, setBounds] = useState([dataObj.lowerBound, dataObj.upperBound]);
    const [finalBounds, setFinalBounds] = useState([dataObj.lowerBound, dataObj.upperBound])
    const [objectiveCoeff, setObjectiveCoeff] = useState(dataObj.objectiveCoefficient)
    const [minimize, setMinimize] = useState(false)
    const [maximize, setMaximize] = useState(false)

    useEffect(() => {
        setObjectiveCoeff(dataObj.objectiveCoefficient)

        if (dataObj.objectiveCoefficient === 1.0) {
            setMaximize(true)
            setMinimize(false)
        } else if (dataObj.objectiveCoefficient === -1.0) {
            setMaximize(false)
            setMinimize(true)
        }
    },[])

    useEffect(() => {
        updateState()
    },[finalBounds])

    useEffect(() => {
        updateState()
    },[objectiveCoeff])

    const updateState = () => {
        const reactionIndex = generalState.reactionsInSelectArray.findIndex(
            reaction => reaction.reactionId === dataObj.reactionId)
        const newReactionsInSelectArray = [...generalState.reactionsInSelectArray]
        newReactionsInSelectArray[reactionIndex].lowerBound = finalBounds[0]
        newReactionsInSelectArray[reactionIndex].upperBound = finalBounds[1]
        newReactionsInSelectArray[reactionIndex].objectiveCoefficient = objectiveCoeff
        console.log(objectiveCoeff)
        console.log(newReactionsInSelectArray[reactionIndex])
        dispatch({type: "SETREACTIONSINARRAY", payload: newReactionsInSelectArray})
    }

    const handleClick = (input) => {
        switch (input) {
            case "minimize":
                if (!minimize) {
                    setObjectiveCoeff(-1.0)
                    setMaximize(false)
                    setMinimize(true)
                } else {
                    setObjectiveCoeff(0.0)
                    setMinimize(false)
                }
                break
            case "maximize":
                if (!maximize) {
                    setObjectiveCoeff(1.0)
                    setMaximize(true)
                    setMinimize(false)
                } else {
                    setObjectiveCoeff(0.0)
                    setMaximize(false)
                }
                break
        }
    }

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
        }}>
            <StyledSlider
                bounds={bounds}
                setBounds={setBounds}
                setFinalBounds={setFinalBounds}/>
            <FluxIndicator flux={dataObj.flux}/>
            <div
                style={{padding: "0.2em"}}
                className={"button-bar spaced-buttons"}>
                <TextField
                    size={"small"}
                    style={{width: "25%"}}
                    type={"number"}
                    label={"lower Bound"}
                    variant="outlined"
                    max={1000.0}
                    min={-1000.0}
                    value={bounds[0]}
                    onChange={(event) => {
                        setFinalBounds([event.target.value, bounds[1]])
                        setBounds([event.target.value, bounds[1]])
                    }}
                />
                <TextField
                    size={"small"}
                    style={{width: "25%"}}
                    type={"number"}
                    label={"Objective Coefficient"}
                    variant="outlined"
                    max={1.0}
                    min={-1.0}
                    value={objectiveCoeff}/>
                <TextField
                    size={"small"}
                    style={{width: "25%"}}
                    type={"number"}
                    label={"upper Bound"}
                    variant="outlined"
                    max={1000.0}
                    min={-1000.0}
                    value={bounds[1]}
                    onChange={(event) => {
                        setFinalBounds([bounds[0], event.target.value])
                        setBounds([bounds[0], event.target.value])
                    }}/>

            </div>
            <div
                style={{padding: "0.2em"}}
                className={"button-bar spaced-buttons"}
            >
                <button
                    className={"download-button big-button"}
                    onClick={() => {handleClick("reset")}}>Reset</button>
                <button
                    className={"download-button big-button"}
                    onClick={() => {handleClick("ko")}}>Knockout</button>
                <button
                    className={minimize ? "download-button big-button" : "download-button big-button not-toggled"}
                    onClick={() => {handleClick("minimize")}}
                >Minimize</button>
                <button
                    className={maximize ? "download-button big-button" : "download-button big-button not-toggled"}
                    onClick={() => {handleClick("maximize")}}>Maximize</button>
            </div>
        </div>
    )
}

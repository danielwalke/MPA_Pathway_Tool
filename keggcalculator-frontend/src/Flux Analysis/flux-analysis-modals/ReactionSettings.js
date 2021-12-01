import React, {useEffect, useState} from "react";
import StyledSlider from "./StyledSlider";
import FluxIndicator from "./FluxIndicator";
import "../../Creator/upload/sbmlParser/annotationModal/AnnotationTable.css"
import "../FluxAnalysisStyles.css"
import {useDispatch, useSelector} from "react-redux";
import {TextField} from "@material-ui/core";
import {resetFluxData} from "../services/CreateFbaGraphData";
import {changeLinkOrientation} from "../../Creator/graph/double click node/ChangeLinkOrientation";

export default function ReactionSettings({dataObj}) {

    const generalState = useSelector(state => state.general)
    const fluxState = useSelector(state => state.fluxAnalysis)

    const dispatch = useDispatch()

    const [bounds, setBounds] = useState([dataObj.lowerBound, dataObj.upperBound]);
    const [finalBounds, setFinalBounds] = useState([dataObj.lowerBound, dataObj.upperBound])
    const [objectiveCoeff, setObjectiveCoeff] = useState(dataObj.objectiveCoefficient)
    const [minimize, setMinimize] = useState(false)
    const [maximize, setMaximize] = useState(false)
    const [flux, setFlux] = useState(dataObj.flux)

    useEffect(() => {
        // setObjectiveCoeff(dataObj.objectiveCoefficient)

        if (dataObj.objectiveCoefficient === 1.0) {
            setMaximize(true)
            setMinimize(false)
        } else if (dataObj.objectiveCoefficient === -1.0) {
            setMaximize(false)
            setMinimize(true)
        }
        },[])

    useEffect(() => {
        const areDefaultParametersSet = objectiveCoeff !== "" && finalBounds[0] !== "" && finalBounds[1] !== ""
        const arePrametersDefault = dataObj.lowerBound === finalBounds[0] &&
            dataObj.upperBound === finalBounds[1] && dataObj.objectiveCoefficient === objectiveCoeff

        if (areDefaultParametersSet && !arePrametersDefault) {
            updateState()
        }
    },[finalBounds[0], finalBounds[1], objectiveCoeff])

    const setLinks = () => {
        let nodeReversibility
        let linkDirection

        if (finalBounds[0] < 0 && finalBounds[1] > 0) {
            // lb < 0, ub > 0
            nodeReversibility = "reversible"
            linkDirection = "forward"
        } else if (finalBounds[0] >= 0 && finalBounds[1] >= 0) {
            // lb > 0, ub > 0 or lb = ub = 0
            nodeReversibility = "irreversible"
            linkDirection = "forward"
        } else {
            // lb < 0 , ub < 0
            nodeReversibility = "irreversible"
            linkDirection = "reverse"
        }

        const data = changeLinkOrientation(
            fluxState.selectedNode[0], fluxState, generalState, nodeReversibility, linkDirection)

        dispatch({type: "SET_FLUX_GRAPH", payload: data})
        // dispatch({type: "SETDATA", payload: data})
    }

    const updateState = () => {
        const reactionIndex = generalState.reactionsInSelectArray.findIndex(
            reaction => reaction.reactionId === dataObj.reactionId)

        const newReactionsInSelectArray = [...generalState.reactionsInSelectArray]

        newReactionsInSelectArray[reactionIndex].lowerBound = finalBounds[0]
        newReactionsInSelectArray[reactionIndex].upperBound = finalBounds[1]
        newReactionsInSelectArray[reactionIndex].objectiveCoefficient = objectiveCoeff
        // newReactionsInSelectArray[reactionIndex].reversible = finalBounds[0] < 0.0

        setLinks()

        dispatch({type: "SETREACTIONSINARRAY", payload: newReactionsInSelectArray})
    }

    const resetFlux = () => {
        resetFluxData(fluxState, dispatch, generalState)
        setFlux(null)
    }

    const resetReaction = () => {
        setObjectiveCoeff(0.0)
        setBounds([-1000.0, 1000.0])
        setFinalBounds([-1000.0, 1000.0])
        setMaximize(false)
        setMinimize(false)
    }

    const koReaction = () => {
        setObjectiveCoeff(0.0)
        setBounds([0.0, 0.0])
        setFinalBounds([0.0, 0.0])
        setMaximize(false)
        setMinimize(false)
    }

    const handleClick = (input) => {
        switch (input) {
            case "minimize":
                if (!minimize) {
                    setObjectiveCoeff(-1.0)
                    setMaximize(false)
                } else {
                    setObjectiveCoeff(0.0)
                }
                setMinimize(!minimize)
                break

            case "maximize":
                if (!maximize) {
                    setObjectiveCoeff(1.0)
                    setMinimize(false)
                } else {
                    setObjectiveCoeff(0.0)
                }
                setMaximize(!maximize)
                break

            case "reset":
                resetReaction()
                break

            case "ko":
                koReaction()
        }
        resetFlux()
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
                setFinalBounds={setFinalBounds}
                setFlux={setFlux}/>
            <div className={"flux-indicator"}>
                {flux && <FluxIndicator flux={flux}/> }
            </div>
            <div
                style={{padding: "0.2em"}}
                className={"button-bar spaced-buttons"}>
                <TextField
                    InputLabelProps={{ shrink: true }}
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
                        // resetFlux()
                    }}
                />
                <TextField
                    InputLabelProps={{ shrink: true }}
                    size={"small"}
                    style={{width: "25%"}}
                    type={"number"}
                    label={"Objective Coeff."}
                    variant="outlined"
                    max={1.0}
                    min={-1.0}
                    value={objectiveCoeff}
                    onChange={(event) => {
                        setObjectiveCoeff(event.target.value)
                        resetFlux()
                    }}
                />
                <TextField
                    InputLabelProps={{ shrink: true }}
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
                        // resetFlux()
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

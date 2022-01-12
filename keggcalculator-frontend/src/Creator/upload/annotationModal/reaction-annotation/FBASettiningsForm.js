import React, {useEffect, useState} from "react";
import {TextField} from "@material-ui/core";
import {useDispatch} from "react-redux";

export default function FBASettingsForm(props) {

    const [fbaSettings, setFBASettings] = useState({ub: 0, lb: 0, oc: 0})

    const dispatch = useDispatch()

    useEffect(() => {
        setFBASettings({
            ub: props.listOfReactions[props.index].upperBound,
            lb: props.listOfReactions[props.index].lowerBound,
            oc: props.listOfReactions[props.index].objectiveCoefficient
        })
    },[props.index])

    useEffect(() => {
        const newListOfReactions = props.listOfReactions
        newListOfReactions[props.index].lowerBound = fbaSettings.lb
        newListOfReactions[props.index].upperBound = fbaSettings.ub
        newListOfReactions[props.index].objectiveCoefficient = fbaSettings.oc
        dispatch({type:"SETLISTOFREACTIONS", payload: newListOfReactions})
    },[fbaSettings])

    return(
        <div
            style={{padding: "0.2em"}}
            className={"button-bar spaced-buttons"}>
            <TextField
                InputLabelProps={{ shrink: true }}
                size={"small"}
                style={{width: "30%"}}
                type={"number"}
                label={"lower Bound"}
                variant="outlined"
                max={1000.0}
                min={-1000.0}
                value={fbaSettings.lb}
                onChange={(event) => {
                    const newFbaSettings = {...fbaSettings}
                    newFbaSettings.lb = event.target.value
                    setFBASettings(newFbaSettings)
                }}
            />
            <TextField
                InputLabelProps={{ shrink: true }}
                size={"small"}
                style={{width: "30%"}}
                type={"number"}
                label={"upper Bound"}
                variant="outlined"
                max={1000.0}
                min={-1000.0}
                value={props.listOfReactions[props.index].upperBound}
                onChange={(event) => {
                    const newFbaSettings = {...fbaSettings}
                    newFbaSettings.ub = event.target.value
                    setFBASettings(newFbaSettings)
                }}
            />
            <TextField
                InputLabelProps={{ shrink: true }}
                size={"small"}
                style={{width: "30%"}}
                type={"number"}
                label={"Objective Coeff."}
                variant="outlined"
                max={1.0}
                min={-1.0}
                value={props.listOfReactions[props.index].objectiveCoefficient}
                onChange={(event) => {
                    const newFbaSettings = {...fbaSettings}
                    newFbaSettings.oc = event.target.value
                    setFBASettings(newFbaSettings)
                }}
            />
        </div>
    )
}

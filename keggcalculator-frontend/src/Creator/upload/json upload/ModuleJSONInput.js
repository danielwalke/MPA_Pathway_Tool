import UploadIcon from "../../icons/uploadIconWhite.svg";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {handleJSONGraphUpload} from "./ModuleUploadFunctionsJSON";
import {ToolTipBig} from "../../main/user-interface/UserInterface";

export const onModuleFileChange = (file, dispatch, state) => {
    let reader = new FileReader()
    reader.readAsText(file)
    reader.onload = e => {
        const result = e.target.result.trim()
        try {
            const reactions = JSON.parse(result)

            reactions.forEach(
                reaction => {
                    reaction.lowerBound = reaction.lowerBound ?
                        reaction.lowerBound : reaction.reversible ?
                            -1000.0 : 0.0
                    reaction.upperBound = reaction.lowerBound ?
                        reaction.upperBound : 1000.0
                    reaction.objectiveCoefficient = reaction.objectiveCoefficient ?
                        reaction.objectiveCoefficient : 0.0
                }
            )

            const {nodes, links} = handleJSONGraphUpload(reactions, dispatch, state.graph)
            const data = {nodes: nodes, links: links}
            dispatch({type: "SETDATA", payload: data})
            dispatch({type: "SWITCHISMODULEIMPORT"})
            dispatch({type: "SETDATALINKS", payload: links})
            dispatch({type: "ADDREACTIONSTOARRAY", payload: reactions})
            dispatch({type: "SETMODULEFILENAMEJSON", payload: file.name})
            dispatch({type: "ADD_PATHWAY_TO_AUDIT_TRAIL", payload: file.name})
            dispatch({type: "SET_PATHWAY_FILE", payload: file})
        } catch (e) {
            window.alert("Your file format is wrong.")
            console.error(e)
        }
    }
    dispatch({type: "SETLOADING", payload: false})
}

const ModuleJSONInput = () => {
    const dispatch = useDispatch()
    const state = useSelector(state => state)

    return (
        <div>
            <ToolTipBig title={"Click for uploading a pathway as JSON"} placement={"right"}>
                <label className={"uploadLabel"} htmlFor={"JSON_Module"}>Upload pathway as JSON
                    <img src={UploadIcon}
                         style={{width: `clamp(6px, 1.7vw, 12px)`, transform: "translate(0,0.2vw)"}}
                         alt={""}/>
                </label>
            </ToolTipBig>
            <input className={"moduleInput"} style={{display: "none"}} id={"JSON_Module"}
                   onClick={() => dispatch({type: "SETLOADING", payload: true})} type={"file"}
                   name={"module-file"}
                   onChange={(event) => onModuleFileChange(event.target.files[0], dispatch, state)}/>
            <br/>
            <div
                className={"fileName"}>{state.graph.moduleFileNameJson.length > 0 ? state.graph.moduleFileNameJson : "No file selected"}</div>
        </div>
    )
}

export default ModuleJSONInput

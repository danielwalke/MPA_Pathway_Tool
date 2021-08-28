import UploadIcon from "../../icons/uploadIconWhite.svg";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {handleJSONGraphUpload} from "./ModuleUploadFunctionsJSON";

const ModuleJSONInput = () =>{
    const dispatch = useDispatch()
    const state = useSelector(state => state)


    const onModuleFileChange = async(event, dispatch, state) => {
        let file = await event.target.files[0];
        let reader = new FileReader()
        reader.readAsText(file)
        reader.onload = e => {
            const result = e.target.result.trim()
            try{
                const reactions = JSON.parse(result)
                const {nodes, links} = handleJSONGraphUpload(reactions, dispatch, state.graph)
                const data = {nodes: nodes, links: links}
                dispatch({type: "SETDATA", payload: data})
                dispatch({type: "SWITCHISMODULEIMPORT"})
                dispatch({type: "SETDATALINKS", payload: links})
                dispatch({type: "ADDREACTIONSTOARRAY", payload: reactions})
                dispatch({type: "SETMODULEFILENAMEJSON", payload: file.name})
                dispatch({type:"ADD_PATHWAY_TO_AUDIT_TRAIL", payload: file.name})
            }catch (e){
                window.alert("Your file format is wrong.") //TODO add possible parsing/format mistake
                console.error(e)
            }
        }
        dispatch({type: "SETLOADING", payload: false})
    }
    return(
        <div>
            <label className={"uploadLabel"} htmlFor={"JSON_Module"}>Upload pathway as JSON <img src={UploadIcon} style={{
                width: `clamp(6px, 1.7vw, 12px)`,
                transform: "translate(0,0.2vw)"
            }} alt={""}/></label>
            <input className={"moduleInput"} style={{display: "none"}} id={"JSON_Module"}
                   onClick={() => dispatch({type: "SETLOADING",payload: true})} type={"file"}
                   name={"module-file"}
                   onChange={(event) => onModuleFileChange(event, dispatch, state)}/>
            <br/>
            <div
                className={"fileName"}>{state.graph.moduleFileNameJson.length > 0 ? state.graph.moduleFileNameJson : "No file selected"}</div>
        </div>
    )
}

export default ModuleJSONInput

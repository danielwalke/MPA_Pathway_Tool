import React from "react";
import UploadIcon from "../../../icons/uploadIconWhite.svg"
import {useDispatch, useSelector} from "react-redux";
import "../../main/Upload.css"
import {handleGraphUpload, handleReactionListUpload} from "./ModuleUploadFunctions";

const onModuleFileChange = (event, dispatch, state) => {
    try {
        let files = event.target.files;
        let reader = new FileReader()
        reader.readAsText(files[0])
        reader.onload = e => {
            try{
                const result = e.target.result.trim()
                const rows = result.split("\n")
                rows.shift() //header
                const {nodes, links} = handleGraphUpload(rows, dispatch, state.graph)
                const reactionList = handleReactionListUpload(rows)
                const data = {nodes: nodes, links: links}
                dispatch({type: "SETDATA", payload: data})
                dispatch({type: "SWITCHISMODULEIMPORT"})
                dispatch({type: "SETDATALINKS", payload: links})
                dispatch({type: "ADDREACTIONSTOARRAY", payload: reactionList})
                dispatch({type: "SETMODULEFILENAME", payload: files[0].name})
            }catch (e) {
                window.alert("Your file format is either wrong or you have already imported a file.")
                console.error(e)
            }
        }
    } catch (e) {
        window.alert("Your file format is either wrong or you have already imported a file.")
        console.error(e)
    }
    dispatch({type: "SETLOADING", payload: false})
}

const ModuleCsvFileInput = () => {
    const dispatch = useDispatch()
    const state = {
        general: useSelector(state => state.general),
        graph: useSelector(state => state.graph),
        keggReaction: useSelector(state => state.keggReaction),
        specificReaction: useSelector(state => state.specificReaction),
        mpaProteins: useSelector(state => state.mpaProteins),
    }

    return (
        <div>
            <label className={"uploadLabel"} htmlFor={"module-file"}>Upload pathway as CSV <img src={UploadIcon}
                                                                                                style={{
                                                                                                    width: `clamp(6px, 1.7vw, 12px)`,
                                                                                                    transform: "translate(0,0.2vw)"
                                                                                                }} alt={""}/></label>
            <input className={"moduleInput"} style={{display: "none"}} id={"module-file"}
                   onClick={() => dispatch({type: "SETLOADING", payload: true})} type={"file"}
                   name={"module-file"}
                   onChange={(event) => onModuleFileChange(event, dispatch, state)}/>
            <br/>
            <div
                className={"fileName"}>{state.graph.moduleFileName.length > 0 ? state.graph.moduleFileName : "No file selected"}</div>
        </div>
    )
}

export default ModuleCsvFileInput
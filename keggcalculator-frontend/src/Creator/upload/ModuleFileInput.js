import React from "react";
import UploadIcon from "../icons/uploadIconWhite.svg"
import {useDispatch, useSelector} from "react-redux";
import "./Upload.css"

const nodeParser = (node, nodes, isReaction) => {
    const nodeObject = {}
    nodeObject.id = node.id
    nodeObject.color = isReaction ? "black" : "darkgreen"
    nodeObject.symbolType = node.symbolType
    nodeObject.x = +node.x
    nodeObject.y = +node.y
    nodes.push(nodeObject)
}

const onModuleFileChange = async (event, dispatch, state) => {
    let files = await event.target.files;
    let reader = new FileReader()
    reader.readAsText(files[0])
    const nodes = [];
    const links = [];
    const reactionList = [];
    reader.onload = e => {
        const result = e.target.result
        const json = JSON.parse(result.toString())
        json.nodesC.map(node => nodeParser(node, nodes, false))
        json.nodesR.map(node => nodeParser(node, nodes, true))
        json.links.map(link => links.push(link))
        json.nodesR.map(node => {
            const reaction = {}
            reaction.reactionName = node.id.trim()
            reaction.reactionId = reaction.reactionName.substring(reaction.reactionName.length - 6, reaction.reactionName.length);
            reaction.koNumbersString = node.koNumbers;
            reaction.ecNumbersString = node.ecnumbers;
            reactionList.push(reaction)
            return null;
        })
        console.log(reactionList)
        const data = {nodes: nodes, links: links}
        dispatch({type: "SWITCHLOADING"})
        dispatch({type: "SETDATA", payload: data})
        dispatch({type: "SETDATALINKS", payload: links})
        dispatch({type: "ADDREACTIONSTOARRAY", payload: reactionList})
        dispatch({type: "SETMODULEFILENAME", payload: files[0].name})
    }
}

const ModuleFileInput = () => {
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
            <label className={"uploadLabel"} htmlFor={"module-file"}>Upload module-file <img src={UploadIcon} style={{
                width: `clamp(6px, 1.7vw, 12px)`,
                transform: "translate(0,0.2vw)"
            }} alt={""}/></label>
            <input className={"moduleInput"} style={{display: "none"}} id={"module-file"}
                   onClick={() => dispatch({type: "SWITCHLOADING"})} type={"file"}
                   name={"module-file"}
                   onChange={(event) => onModuleFileChange(event, dispatch, state)}/>
            <br/>
            <div
                className={"fileName"}>{state.graph.moduleFileName.length > 0 ? state.graph.moduleFileName : "No file selected"}</div>
        </div>
    )
}

export default ModuleFileInput
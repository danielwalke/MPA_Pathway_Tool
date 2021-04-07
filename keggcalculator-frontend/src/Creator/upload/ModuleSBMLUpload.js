import React from "react";
import UploadIcon from "../icons/uploadIconWhite.svg";
import {useDispatch, useSelector} from "react-redux";
import xmlParser from "react-xml-parser/xmlParser"
import {
    drawGraphFromSbml,
    getReactionsFromSbml, getSpeciesFromSbml,
    getSpeciesInformation, setReactionListfromSbml
} from "../download/SbmlDownloadFunctions";

const ModuleSBMLUpload = () => {

    const onSBMLModuleFileChange = async (event, dispatch, state) => {
        let file = await event.target.files[0];
        let reader = new FileReader()
        reader.readAsText(file)
        reader.onload = e => {
            const result = e.target.result.trim()
            const parser = new xmlParser()
            const sbmlObject = parser.parseFromString(result)
            const sbmlSpecies = getSpeciesFromSbml(sbmlObject)
            console.log(sbmlSpecies)
            // const reactions = getReactionsFromSbml(sbmlObject)
            // const reactionObjects = getSpeciesInformation(reactions, sbmlObject)
            // const data = drawGraphFromSbml(reactionObjects)
            // setReactionListfromSbml(reactionObjects, dispatch)
            dispatch({type:"SETSBMLSPECIES", payload:sbmlSpecies})
            dispatch({type:"SWITCHSHOWSBMLKEGGCONVERTER"})

            // dispatch({type: "SETDATA", payload: data})
            dispatch({type: "SWITCHISMODULEIMPORT"})
            dispatch({type: "SETLOADING", payload: false})
        }
    }

    const state = useSelector(state => state)
    const dispatch = useDispatch()
    return (
        <div>
            <label className={"uploadLabel"} htmlFor={"SBML_Module"}>Upload pathway as SBML <img src={UploadIcon}
                                                                                                 style={{
                                                                                                     width: `clamp(6px, 1.7vw, 12px)`,
                                                                                                     transform: "translate(0,0.2vw)"
                                                                                                 }} alt={""}/></label>
            <input className={"moduleInput"} style={{display: "none"}} id={"SBML_Module"}
                   onClick={() => dispatch({type: "SETLOADING", payload: true})} type={"file"}
                   name={"module-file"}
                   onChange={(event) => onSBMLModuleFileChange(event, dispatch, state)}/>
            <br/>
            <div
                className={"fileName"}>{state.graph.moduleFileNameSbml.length > 0 ? state.graph.moduleFileNameSbml : "No file selected"}</div>
        </div>
    )
}

export default ModuleSBMLUpload
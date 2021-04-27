import React, {useEffect, useState} from "react";
import UploadIcon from "../icons/uploadIconWhite.svg";
import {useDispatch, useSelector} from "react-redux";
import xmlParser from "react-xml-parser/xmlParser"
import {
    drawGraphFromSbml,
    getReactionsFromSbml, getSpeciesFromSbml,
    getSpeciesInformation, setReactionList, setReactionListfromSbml
} from "../download/SbmlDownloadFunctions";
import Modal from "@material-ui/core/Modal";
import {useStyles} from "../ModalStyles/ModalStyles";



const ModuleSBMLUpload = () => {
    const keggState = useSelector(state=> state.keggReaction)
    const graphState= useSelector(state => state.graph)
    const generalState = useSelector(state => state.general)
    const [showAnnotationWarning, setShowAnnotationWarning] = useState(false)
    const [sbmlObject, setSbmlObject]= useState({})

    const skipAnnotation = (sbmlObject) =>{
        const {reactions,unAnnotatedReactions} = getReactionsFromSbml(sbmlObject) //get reactions and their links
        const reactionObjects = getSpeciesInformation(reactions, sbmlObject) // get for each compound in eacch reaction the information about compounds
        const unAnnotatedReactionsObjects = getSpeciesInformation(unAnnotatedReactions, sbmlObject)
        let data = {nodes: [], links: []}
        reactionObjects.length>0 && setReactionList(reactionObjects, dispatch,generalState)
        unAnnotatedReactionsObjects.length>0 && setReactionList(unAnnotatedReactionsObjects, dispatch,generalState)
        data = drawGraphFromSbml(reactionObjects, data,graphState)
        data = drawGraphFromSbml(unAnnotatedReactionsObjects, data, graphState)
        dispatch({type: "SETDATA", payload: data})
        dispatch({type: "SWITCHISMODULEIMPORT"})
        dispatch({type: "SETLOADING", payload: false})
        setShowAnnotationWarning(false)
    }

    useEffect(()=>{
     setShowAnnotationWarning(false)
    }, [keggState.showSbmlKeggConverter])
    const onSBMLModuleFileChange = async (event, dispatch, state) => {
        let file = await event.target.files[0];
        let reader = new FileReader()
        reader.readAsText(file)
        reader.onload = e => {
            try {
                const result = e.target.result.trim()
                const parser = new xmlParser()
                const sbml = parser.parseFromString(result)
                setSbmlObject(sbml)
                dispatch({type:"SETSBMLOBJECT", payload: sbml})
                const sbmlSpecies = getSpeciesFromSbml(sbml)
                //for annotating compounds as kegg compounds
                dispatch({type: "SETSBMLSPECIES", payload: sbmlSpecies})
                const filteredSpecies = sbmlSpecies.filter(species => species.keggAnnotations.length === 0)
                if(filteredSpecies.length>0){
                    setShowAnnotationWarning(true)
                }else{
                    skipAnnotation(sbml)
                }
            }catch{
                window.alert("can't read the file")
            }
        }
    }

    const state = useSelector(state => state)
    const dispatch = useDispatch()
    const classes = useStyles()
    const annotationWarning = (
        <div className={classes.paper} style={{width:"30vw", backgroundColor:"white"}}>
            You have some unannotated compounds (in future additionally unannotated reactions). Do you want do annotate them?
            <button className={"downloadButton"} style={{width:"25%"}} onClick={()=>dispatch({type:"SWITCHSHOWSBMLKEGGCONVERTER"})}>Yes</button>
            <button className={"downloadButton"} style={{width:"25%"}} onClick={()=>skipAnnotation(sbmlObject)}>Skip</button>
        </div>
    )
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
            <Modal className={classes.modal} open={showAnnotationWarning}>
                {annotationWarning}
        </Modal>
        </div>
    )
}

export default ModuleSBMLUpload
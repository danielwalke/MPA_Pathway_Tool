/*
this component is responsible for reading all information from a given sbml file
listOfSpecies: [
{sbmlId: "", sbmlName:"", keggId:"", keggName:""}]
listOfReactions: [
{sbmlId:"", sbmlName:"", keggId:"R/UXXXXX", ecNumbers:[}, koNumbers:[], substrates: [
{sbmlId:"", stoichiometry:"",sbmlName:"", keggId:"", keggName:""}], products:[{sbmlId:"", stoichiometry:"",sbmlName:"", keggId:"", keggName:""}
]}]
 */

import React from 'react';
import UploadIcon from "../../../icons/uploadIconWhite.svg";
import {onSBMLModuleFileChange} from "./ReaderFunctions";
import {useDispatch, useSelector} from "react-redux";
import AnnotationModal from "../AnnotationModal";
import AnnotationWarningModal from "../AnnotationWarningModal";
import ReactionTableList from "../finalReactionTable/ReactionTableList";
import {ToolTipBig} from "../../../main/user-interface/UserInterface";

const SbmlReader = () => {
    const dispatch = useDispatch();
    const state = useSelector(state=> state)
    return (
        <div>
            <ToolTipBig title={"Click for uploading a pathway as SBML"}  placement={"right"}>
            <label className={"uploadLabel"} htmlFor={"SBML_Module"}>Upload pathway as SBML <img src={UploadIcon}
                                                                                                 style={{
                                                                                                     width: `clamp(6px, 1.7vw, 12px)`,
                                                                                                     transform: "translate(0,0.2vw)"
                                                                                                 }} alt={""}/></label>
            </ToolTipBig>
            <input className={"moduleInput"} style={{display: "none"}} id={"SBML_Module"}
                   onClick={() => dispatch({type: "SETLOADING", payload: true})} type={"file"}
                   name={"module-file"}
                   onChange={(event) => onSBMLModuleFileChange(event, dispatch, state)}/>
            <br/>
            <div
                className={"fileName"}>{state.general.moduleFileNameSbml.length > 0 ? state.graph.moduleFileNameJson : "No file selected"}</div>
            {state.general.isAnnotationPurpose && <AnnotationModal/>}
            {state.general.isMissingAnnotations && <AnnotationWarningModal/>}
            {state.general.isShowingReactionTable && <ReactionTableList/>}
        </div>
    );
};

export default SbmlReader;

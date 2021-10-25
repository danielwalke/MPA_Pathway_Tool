import React from 'react';

import "./AnnotationTable.css"
import "../../../ModalStyles/Modals.css"
import CompoundSbmlNameChanger from "./CompoundSbmlNameChanger";
import CompoundKeggIdSelector from "./CompoundKeggIdSelector";
import CompoundBiggIdSelector from "./CompoundBiggIdSelector";
import RestoreIcon from "@material-ui/icons/Restore";
import {useDispatch} from "react-redux";

const CompoundDetailsContainer = (props) => {
    /**
     Setting and displaying compound details
     */

    const dispatch = useDispatch()

    const handleRestore = (defaultCompound) => {
        /**
         * writes cloned initial state into current state, for undoing changes
         */
        const newListOfSpecies = props.listOfSpecies
        newListOfSpecies[props.index].sbmlName = defaultCompound.sbmlName
        newListOfSpecies[props.index].keggId = defaultCompound.keggId
        newListOfSpecies[props.index].biggId = defaultCompound.biggId

        dispatch({type: "SETLISTOFREACTIONS", payload: newListOfSpecies})
    }

    return (
        <div className={"detail-view"}>
            <CompoundSbmlNameChanger listOfSpecies={props.listOfSpecies}
                                     index={props.index}/>
            <CompoundKeggIdSelector listOfSpecies={props.listOfSpecies}
                                    index={props.index}/>
            <CompoundBiggIdSelector listOfSpecies={props.listOfSpecies}
                                    index={props.index}/>
            <div className={"button-bar button-center"}>
                <button className={"download-button circle-icon"}
                        onClick={() => handleRestore(props.defaultCompound)}>
                    Restore Reaction Settings <RestoreIcon/>
                </button>
            </div>
        </div>
    )
}

export default CompoundDetailsContainer

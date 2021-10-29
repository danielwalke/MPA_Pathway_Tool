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
        const newListOfSpecies = [...props.listOfSpecies]
        newListOfSpecies[props.listOfSpeciesIndex].sbmlName = defaultCompound.sbmlName
        newListOfSpecies[props.listOfSpeciesIndex].keggId = defaultCompound.keggId
        newListOfSpecies[props.listOfSpeciesIndex].biggId = defaultCompound.biggId

        dispatch({type: "SETLISTOFSPECIES", payload: newListOfSpecies})
    }

    return (
        <div className={"detail-view"}>
            <CompoundSbmlNameChanger listOfSpecies={props.listOfSpecies}
                                     index={props.listOfSpeciesIndex}/>
            <CompoundKeggIdSelector listOfSpecies={props.listOfSpecies}
                                    index={props.listOfSpeciesIndex}/>
            <CompoundBiggIdSelector listOfSpecies={props.listOfSpecies}
                                    index={props.listOfSpeciesIndex}/>
            <div className={"button-bar button-center"}>
                <button className={"download-button circle-icon"}
                        onClick={() => handleRestore(props.defaultCompound)}>
                    Restore Compound Settings <RestoreIcon/>
                </button>
            </div>
        </div>
    )
}

export default CompoundDetailsContainer

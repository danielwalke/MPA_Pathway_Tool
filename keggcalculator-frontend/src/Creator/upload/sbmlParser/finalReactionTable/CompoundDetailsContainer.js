import React from 'react';

import "../SBML.css"
import "../AnnotationTable.css"
import "../../../ModalStyles/Modals.css"
import CompoundSbmlIdChanger from "./CompoundSbmlIdChanger";
import CompoundSbmlNameChanger from "./CompoundSbmlNameChanger";
import CompoundKeggIdSelector from "../CompoundKeggIdSelector";
import CompoundBiggIdSelector from "../CompoundBiggIdSelector";

const CompoundDetailsContainer = (props) => {
    /**
     Setting and displaying reaction details
     */

    return (
        <div className={"detail-view"}>
            <CompoundSbmlIdChanger listOfSpecies={props.listOfSpecies}
                                   index={props.index}/>
            <CompoundSbmlNameChanger listOfSpecies={props.listOfSpecies}
                                     index={props.index}/>
            <CompoundKeggIdSelector listOfSpecies={props.listOfSpecies}
                                    index={props.index}/>
            <CompoundBiggIdSelector listOfSpecies={props.listOfSpecies}
                                    index={props.index}/>
        </div>
    )
}

export default CompoundDetailsContainer

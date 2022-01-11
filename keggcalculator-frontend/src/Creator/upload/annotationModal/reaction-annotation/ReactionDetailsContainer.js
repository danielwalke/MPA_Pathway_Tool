import React, {useEffect} from 'react';

import {useDispatch, useSelector} from "react-redux";
import SbmlNameChanger from "./SbmlNameChanger";
import ReactionKeggIdSelector from "./ReactionKeggIdSelector";
import {requestGenerator} from "../../../request/RequestGenerator";
import {endpoint_getReactionsFromCompounds} from "../../../../App Configurations/RequestURLCollection";
import EcSelector from "./ECSelector";
import KSelector from "./KSelector";
import RestoreIcon from "@material-ui/icons/Restore";
import BiggReactionSelector from "./BiggReactionSelector";
import CompoundSelector from "../compound-annotation/CompoundSelector";
import "../AnnotationTable.css"
import "../../../ModalStyles/Modals.css"

const CreateCompoundString = (compoundObject) => {
    /**
     * creates string of compound names
     */
    let compoundArray = []
    compoundObject.forEach((compound) => {
            compoundArray.push(compound.sbmlName)
        }
    )
    return compoundArray.join(", ")
}

const ReactionDetailsContainer = (props) => {
    /**
    Setting and displaying reaction details
     */
    const state = useSelector(state => state)
    const dispatch = useDispatch()

    const listOfReactions = state.general.listOfReactions

    useEffect(() => {
        // retrieve reaction information from compounds when the selected row is changed
        const reaction = props.rowInfo
        const compounds = [...reaction.substrates, ...reaction.products]
        let compoundIdString = []

        compounds.forEach(compound => {
            if (compound.keggId && compound.keggId.startsWith('C')) {
                compoundIdString.push(compound.keggId)
            }
        })

        compoundIdString = compoundIdString.join(";")

        requestGenerator("POST",
            endpoint_getReactionsFromCompounds,
            {compoundIds: compoundIdString},
            "", "").then(resp => {
                dispatch({type: "SET_ANNOATION_OPTIONS", payload: resp.data})
            }
        )
    }, [props.index])

    const handleRestore = (defaultReaction) => {
        /**
         * writes cloned initial state into current state, for undoing changes
         */
        const newListOfReactions = [...listOfReactions]
        newListOfReactions[props.index].biggReaction = defaultReaction.biggReaction
        newListOfReactions[props.index].keggId = defaultReaction.keggId
        newListOfReactions[props.index].sbmlId = defaultReaction.sbmlId
        newListOfReactions[props.index].sbmlName = defaultReaction.sbmlName
        newListOfReactions[props.index].koNumbers = [...defaultReaction.koNumbers]
        newListOfReactions[props.index].ecNumbers = [...defaultReaction.ecNumbers]
        newListOfReactions[props.index].substrates = [...defaultReaction.substrates]
        newListOfReactions[props.index].products = [...defaultReaction.products]

        dispatch({type: "SETLISTOFREACTIONS", payload: newListOfReactions})
    }

    return (
        <div>
            <div className={"detail-view"}>
                {props.annotateSbml &&
                    <SbmlNameChanger
                        listOfReactions={listOfReactions}
                        index={props.index}/>}
                <ReactionKeggIdSelector listOfReactions={listOfReactions}
                                        index={props.index}/>
                <BiggReactionSelector listOfReactions={listOfReactions}
                                      index={props.index}/>
                {props.annotateSbml &&
                <CompoundSelector listOfReactions={listOfReactions}
                                  index={props.index}
                                  propName={"substrates"}
                                  label={"Substrates"}
                                  annotateSbml={props.annotateSbml}/>}
                {props.annotateSbml &&
                <CompoundSelector listOfReactions={listOfReactions}
                                  index={props.index}
                                  propName={"products"}
                                  label={"Products"}/>}
                <EcSelector listOfReactions={listOfReactions}
                            index={props.index}/>
                <KSelector listOfReactions={listOfReactions}
                           index={props.index}/>
            </div>
            <div className={"button-bar button-center"}>
                <button className={"download-button circle-icon"}
                        onClick={() => handleRestore(props.defaultReaction)}>
                    Restore Reaction Settings <RestoreIcon/>
                </button>
            </div>
        </div>
    )
}

export default ReactionDetailsContainer

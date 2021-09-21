/*
this component is a modal and responsible for showing all final information about the uploaded reactions from the selected sbml file
 */

import React, {useEffect, useState} from 'react';
import Modal from "@material-ui/core/Modal";
import {useStyles} from "../../../ModalStyles/ModalStyles";
import {useDispatch, useSelector} from "react-redux";
import "../SBML.css"
import EcSelector from "./ECSelector";
import KoSelector from "./KoSelector";
import SbmlIdChanger from "./SbmlIdChanger";
import SbmlNameChanger from "./SbmlNameChanger";
import SubstrateSelector from "./SubstrateSelector";
import ProductSelector from "./ProductSelector";
import {setReactionsAndCompoundsInStore} from "../GraphDrawer";
import RestoreIcon from '@material-ui/icons/Restore';
import clonedeep from "lodash/cloneDeep";
import "./RestoreIcon.css"

const ReactionTableList = () => {
        const dispatch = useDispatch()
        const state = useSelector(state => state)
        const classes = useStyles();
        const [listOfReactions, setListOfReactions] = useState([]);
        const [listOfReactionsClone, setListOfReactionsClone] = useState([])

        useEffect(() => {
            setListOfReactions(state.general.listOfReactions)
            setListOfReactionsClone(state.general.listOfReactions)
        }, [state.general.listOfReactions])


        const handleFinish = () => {
            //set reactions
            // const reactions = setReactionsInStore(state, state.general.listOfReactions)
            //set data for the Graph
            const data = setReactionsAndCompoundsInStore(state, state.general.listOfReactions, dispatch)
            dispatch({type: "SETISSHOWINGREACTIONTABLE", payload: false})
            dispatch({type: "SETDATA", payload: data})
            dispatch({type: "SETLOADING", payload: false})
        }

        const handleRestoreReaction = (reactionClone) => {
            const newListOfReactions = listOfReactions.map(reaction => {
                if (reaction.keggId === reactionClone.keggId) {
                    reaction.sbmlId = reactionClone.sbmlId;
                    reaction.sbmlName = reactionClone.sbmlName;
                    reaction.koNumbers = reactionClone.koNumbers;
                    reaction.ecNumbers = reactionClone.ecNumbers;
                    reaction.substrates = reactionClone.substrates;
                    reaction.products = reactionClone.products;
                }
                return reaction
            })
            setListOfReactions(newListOfReactions)
        }

        const reactionTable = (
            <div className={classes.paper} style={{width: "95vw", height: "80vh", overflow: "auto"}}>
                {listOfReactions.map((reaction, index) => {
                    const reactionClone = clonedeep(listOfReactionsClone[index])
                    return (
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(4,1fr) 2fr 2fr 1fr",
                            border: "2px solid black",
                            margin: "2px 0"
                        }} key={index.toString().concat(reaction.sbmlId)}>
                            <div><SbmlIdChanger index={index} reaction={reaction}/></div>
                            <div><SbmlNameChanger index={index} reaction={reaction}/></div>
                            <div><EcSelector reaction={reaction} ecNumbers={reaction.ecNumbers}/></div>
                            <div><KoSelector reaction={reaction} koNumbers={reaction.koNumbers}/></div>
                            <div><SubstrateSelector reaction={reaction} index={index} substrates={reaction.substrates}/>
                            </div>
                            <div><ProductSelector reaction={reaction} index={index} products={reaction.products}/></div>
                            <div>{reaction.keggId}
                                <div data-tooltip={"reset reaction"} className={"CircleIcon"}
                                     onClick={() => handleRestoreReaction(reactionClone)}><RestoreIcon/></div>
                            </div>
                            {/*<div><button className={"downloadButton"} onClick={()=>handleSubmit()}>submit changes</button></div>*/}
                        </div>
                    )
                })}
                <button className={"downloadButton"} onClick={() => handleFinish()}>Finish</button>
            </div>
        )
        // onClose={() => dispatch({type: "SETISSHOWINGREACTIONTABLE", payload: false})}
        return (
            <div>
                <Modal className={classes.modal} open={state.general.isShowingReactionTable}>
                    {reactionTable}
                </Modal>
            </div>
        );
    }
;

export default ReactionTableList;

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
import ReactionKeggIdSelector from "../ReactionKeggIdSelector";
import SubstrateSelector from "./SubstrateSelector";
import ProductSelector from "./ProductSelector";
import {setReactionsAndCompoundsInStore} from "../GraphDrawer";
import RestoreIcon from '@material-ui/icons/Restore';
import clonedeep from "lodash/cloneDeep";
import "./RestoreIcon.css"
import {Collapse, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@material-ui/core";
import * as PropTypes from "prop-types";
import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

const createRowData = (reactionList) => {
    return reactionList.map((reaction, index) => {
            const reactionClone = clonedeep(reactionList[index])
            return {
                reactionID: reactionClone.sbmlId,
                reactionName: reactionClone.sbmlName,
                details: []
            }
        }
    )
}

const ReactionTableRow = (props) => {
    // const reaction = props.row
    const index = props.index
    const [reactionRowInfo, setReactionRowInfo] = useState(props.row)
    const [open, setOpen] = useState(true);

    useEffect(() => {
        console.log(reactionRowInfo)
    },)

    return (
        <React.Fragment>
            <TableRow sx={{'& > *': {borderBottom: 'unset'}}}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {reactionRowInfo.sbmlId}
                </TableCell>
                <TableCell>
                    {reactionRowInfo.sbmlName}
                </TableCell>
                <TableCell>
                </TableCell>
            </TableRow>

            <TableRow>
                <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={5}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <div style={{display: "flex", flexDirection: "row", padding: "0.3em"}}>
                            <SbmlIdChanger reactionRowInfo={reactionRowInfo}
                                           setReactionRowInfo={setReactionRowInfo}/>
                            <SbmlNameChanger reactionRowInfo={reactionRowInfo}
                                             setReactionRowInfo={setReactionRowInfo}/>
                            <ReactionKeggIdSelector reactionRowInfo={reactionRowInfo}
                                                    setReactionRowInfo={setReactionRowInfo}/>
                            {/*<EcSelector reaction={reaction} ecNumbers={reaction.ecNumbers}/>*/}
                        </div>

                        {/*<div><KoSelector reaction={reaction} koNumbers={reaction.koNumbers}/></div>*/}
                        {/*<div><SubstrateSelector reaction={reaction} index={index} substrates={reaction.substrates}/>*/}
                        {/*</div>*/}
                        {/*<div><ProductSelector reaction={reaction} index={index} products={reaction.products}/></div>*/}
                        {/*<div>{reaction.keggId}*/}
                        {/*    <div data-tooltip={"reset reaction"} className={"CircleIcon"}*/}
                        {/*         onClick={() => handleRestoreReaction(reactionClone)}><RestoreIcon/>*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    )
}

ReactionTableRow.propTypes = {};

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

        useEffect(() => {
            console.log(listOfReactions)
        }, [listOfReactions])

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

        // const reactionTable = (
        //     <div className={classes.paper} style={{width: "95vw", height: "80vh", overflow: "auto"}}>
        //         {listOfReactions.map((reaction, index) => {
        //             const reactionClone = clonedeep(listOfReactionsClone[index])
        //             console.log(reactionClone.sbmlName)
        //             return (
        //                 <div style={{
        //                     display: "grid",
        //                     gridTemplateColumns: "repeat(4,1fr) 2fr 2fr 1fr",
        //                     border: "2px solid black",
        //                     margin: "2px 0"
        //                 }} key={index.toString().concat(reaction.sbmlId)}>
        //                     <div><SbmlIdChanger index={index} reaction={reaction}/></div>
        //                     <div><SbmlNameChanger index={index} reaction={reaction}/></div>
        //                     <div><EcSelector reaction={reaction} ecNumbers={reaction.ecNumbers}/></div>
        //                     <div><KoSelector reaction={reaction} koNumbers={reaction.koNumbers}/></div>
        //                     <div><SubstrateSelector reaction={reaction} index={index} substrates={reaction.substrates}/>
        //                     </div>
        //                     <div><ProductSelector reaction={reaction} index={index} products={reaction.products}/></div>
        //                     <div>{reaction.keggId}
        //                         <div data-tooltip={"reset reaction"} className={"CircleIcon"}
        //                              onClick={() => handleRestoreReaction(reactionClone)}><RestoreIcon/></div>
        //                     </div>
        //                     {/*<div><button className={"downloadButton"} onClick={()=>handleSubmit()}>submit changes</button></div>*/}
        //                 </div>
        //             )
        //         })}
        //         <button className={"downloadButton"} onClick={() => handleFinish()}>Finish</button>
        //     </div>
        // )

        // const rows = createRowData(listOfReactions)

        const columns = [
            {id: 'reactionID', label: 'ID', minWidth: 170},
            {id: 'reactionName', label: 'name', minWidth: 100},
        ]

        const dataTable = (
            <div className={classes.paper} style={{width: "95vw",}}>
                <TableContainer style={{overflow: "auto", height: "80vh"}}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell/>
                                {columns.map((column) => (
                                    <TableCell key={column.id}>
                                        {column.label}
                                    </TableCell>
                                ))}
                                <TableCell/>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {listOfReactions.map((row, index) => (
                                <ReactionTableRow key={row.sbmlName}
                                                  row={row}
                                                  index={index}/>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        )

        // onClose={() => dispatch({type: "SETISSHOWINGREACTIONTABLE", payload: false})}
        return (
            <div>
                <Modal className={classes.modal} open={state.general.isShowingReactionTable}>
                    {/*{reactionTable}*/}
                    {dataTable}
                </Modal>
            </div>
        );
    }
;

export default ReactionTableList;

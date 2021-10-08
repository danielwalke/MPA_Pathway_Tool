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
import {
    Card, CardHeader,
    Collapse,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@material-ui/core";
import * as PropTypes from "prop-types";
import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import {requestGenerator} from "../../../request/RequestGenerator";
import {
    endpoint_getReactionsFromCompounds
} from "../../../../App Configurations/RequestURLCollection";
import DetailsContainer from "./DetailsContainer";

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

    return (
        <React.Fragment>
            <TableRow onClick={() => {
                props.handleRowClick(props.index)
            }}
                      sx={{'& > *': {borderBottom: 'unset'}}}
                      hover
                      selected={props.selectedRow === props.index}>
                <TableCell component="th" scope="row">
                    {props.row.sbmlId}
                </TableCell>
                <TableCell>
                    {props.row.sbmlName}
                </TableCell>
                <TableCell>
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
        const [selectedRow, setSelectedRow] = useState(0)
        const [previousListOfReactions, setPreviousListOfReactions] = useState([])

        useEffect(() => {
            setPreviousListOfReactions(clonedeep(state.general.listOfReactions))
        }, [])

        useEffect(() => {
            // updates local store with current list of reactions
            setListOfReactions(state.general.listOfReactions)
            // setListOfReactionsClone(state.general.listOfReactions)
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

        const columns = [
            {id: 'reactionID', label: 'ID', minWidth: 170},
            {id: 'reactionName', label: 'name', minWidth: 100},
        ]

        const handleRowClick = (index) => {
            setSelectedRow(index)
        }

        const dataTable = (
            <div className={classes.paper} style={{
                width: "95vw",
                height: "80vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"}}>
                <div style={{
                    height: "49.5%",
                    flexBasis: "0 0 auto",
                    borderRadius: "10px",
                    border: "1px solid rgba(0,0,0,.125)",
                    padding: "20px 0px 20px 0px",
                    boxSizing: "border-box"}}>
                    <TableContainer style={{
                        overflow: "auto",
                        height: "100%",
                        borderTop: "1px solid rgba(0,0,0,.125)",
                        borderBottom: "1px solid rgba(0,0,0,.125)"
                    }}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
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
                                                      index={index}
                                                      handleRowClick={handleRowClick}
                                                      selectedRow={selectedRow}/>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
                <div style={{height: "1%"}}></div>
                <div style={{
                    height: "49.5%",
                    flex: "0 0 auto",
                    borderRadius: "10px",
                    border: "1px solid rgba(0,0,0,.125)",
                    boxSizing: "border-box"}}>
                    <DetailsContainer index={selectedRow}
                                      rowInfo={listOfReactions[selectedRow]}
                                      defaultReaction={previousListOfReactions[selectedRow]}/>
                </div >
            </div>
        )

        // onClose={() => dispatch({type: "SETISSHOWINGREACTIONTABLE", payload: false})}
        return (
            <div>
                <Modal className={classes.modal} open={state.general.isShowingReactionTable}>
                    {dataTable}
                </Modal>
            </div>
        );
    }
;

export default ReactionTableList;

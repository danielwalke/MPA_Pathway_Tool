/*
this component is a modal and responsible for showing all final information about the uploaded reactions from the selected sbml file
 */

import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {setReactionsAndCompoundsInStore} from "../GraphDrawer";
import clonedeep from "lodash/cloneDeep";
import "./RestoreIcon.css"
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@material-ui/core";

import ReactionDetailsContainer from "./ReactionDetailsContainer";
import {annotationIndicator} from "./AnnotationIndicator";

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
                    {annotationIndicator(props.row.keggId)}
                </TableCell>
                <TableCell>
                    {annotationIndicator(props.row.biggReaction)}
                </TableCell>
                <TableCell>
                    {annotationIndicator(props.row.koNumbers)}
                </TableCell>
                <TableCell>
                    {annotationIndicator(props.row.ecNumbers)}
                </TableCell>
            </TableRow>
        </React.Fragment>
    )
}

const ReactionAnnotation = () => {
        const dispatch = useDispatch()
        const state = useSelector(state => state)

        const [listOfReactions, setListOfReactions] = useState([]);
        const [selectedRow, setSelectedRow] = useState(0)
        const [previousListOfReactions, setPreviousListOfReactions] = useState([])

        useEffect(() => {
            setPreviousListOfReactions(clonedeep(state.general.listOfReactions))
            // setListOfReactions(state.general.listOfReactions)
        }, [])

        useEffect(() => {
            // updates local store with current list of reactions
            setListOfReactions(state.general.listOfReactions)
        }, [state.general.listOfReactions])

        const handleFinish = () => {
            //set data for the Graph
            const data = setReactionsAndCompoundsInStore(state, state.general.listOfReactions, dispatch)
            dispatch({type: "SHOWREACTIONANNOTATION", payload: false})
            dispatch({type: "SHOWANNOTATIONTABLE", payload: false})
            dispatch({type: "SETDATA", payload: data})
            dispatch({type: "SETLOADING", payload: false})
            dispatch({type: "SWITCHUPLOADMODAL"})
        }

        const handleGoToCompounds = () => {
            dispatch({type: "SHOWREACTIONANNOTATION", payload: false})
            dispatch({type: "SHOWCOMPOUNDANNOTATION", payload: true})
        }

        const columns = [
            {id: 'reactionID', label: 'ID', minWidth: 10},
            {id: 'reactionName', label: 'name', minWidth: 10},
            {id: 'KeggId', label: 'KEGG Reaction', minWidth: 10},
            {id: 'BiggId', label: 'BIGG Reaction', minWidth: 10},
            {id: 'K', label: 'K Number', minWidth: 10},
            {id: 'EC', label: 'EC', minWidth: 10},
        ]

        const handleRowClick = (index) => {
            setSelectedRow(index)
        }

        return (
            <div className={"annotation-modal-content"}>
                <h5 className={"modal-header"}>Reaction Annotations</h5>
                <div className={"annotation-body"}>
                    <div className={"annotation-frame frame-margin-right"}>
                        <TableContainer className={"inner-container"}>
                            <Table size="small" stickyHeader aria-label="reaction table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="left" colSpan={2}>
                                            Details
                                        </TableCell>
                                        <TableCell align="left" colSpan={4}>
                                            Annotations
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        {columns.map((column) => (
                                            <TableCell key={column.id}> {column.label} </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {listOfReactions.map((row, index) => (
                                        <ReactionTableRow key={index}
                                                          row={row}
                                                          index={index}
                                                          handleRowClick={handleRowClick}
                                                          selectedRow={selectedRow}/>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                    <div className={"annotation-frame frame-margin-left"}>
                        <div className={"inner-container"}>
                            {listOfReactions.length > 0 &&
                            <ReactionDetailsContainer index={selectedRow}
                                                      rowInfo={listOfReactions[selectedRow]}
                                                      defaultReaction={previousListOfReactions[selectedRow]}/>}
                        </div>
                    </div>
                </div>
                <div className={"button-bar spaced-buttons"}>
                    <button className={"download-button finish-button"} onClick={handleGoToCompounds}> Compounds </button>
                    <button className={"download-button finish-button"} onClick={handleFinish}> Finish </button>
                </div>
            </div>
        )
    };

export default ReactionAnnotation;

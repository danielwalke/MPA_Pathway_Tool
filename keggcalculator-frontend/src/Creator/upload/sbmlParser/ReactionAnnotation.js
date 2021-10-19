/*
this component is a modal and responsible for showing all final information about the uploaded reactions from the selected sbml file
 */

import React, {useEffect, useState} from 'react';
import {useStyles} from "../../ModalStyles/ModalStyles";
import {useDispatch, useSelector} from "react-redux";
import "./SBML.css"
import {setReactionsAndCompoundsInStore} from "./GraphDrawer";
import clonedeep from "lodash/cloneDeep";
import "./finalReactionTable/RestoreIcon.css"
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@material-ui/core";

import ReactionDetailsContainer from "./finalReactionTable/ReactionDetailsContainer";

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

const ReactionAnnotation = () => {
        const dispatch = useDispatch()
        const state = useSelector(state => state)

        const [listOfReactions, setListOfReactions] = useState([]);
        const [selectedRow, setSelectedRow] = useState(0)
        const [previousListOfReactions, setPreviousListOfReactions] = useState([])

        useEffect(() => {
            setPreviousListOfReactions(clonedeep(state.general.listOfReactions))
            setListOfReactions(state.general.listOfReactions)
        }, [])

        useEffect(() => {
            // updates local store with current list of reactions
            setListOfReactions(state.general.listOfReactions)
        }, [state.general.listOfReactions])

        const handleFinish = () => {
            //set data for the Graph
            const data = setReactionsAndCompoundsInStore(state, state.general.listOfReactions, dispatch)
            dispatch({type: "SHOWREACTIONANNOTATION", payload: false})
            dispatch({type: "SETISANNOTATIONPURPOSE", payload: false})
            dispatch({type: "SETDATA", payload: data})
            dispatch({type: "SETLOADING", payload: false})
            dispatch({type: "SWITCHUPLOADMODAL"})
        }

        const handleGoToCompounds = () => {
            dispatch({type: "SHOWREACTIONANNOTATION", payload: false})
            dispatch({type: "SHOWCOMPOUNDANNOTATION", payload: true})
        }

        const columns = [
            {id: 'reactionID', label: 'ID', minWidth: 170},
            {id: 'reactionName', label: 'name', minWidth: 100},
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
                            <Table stickyHeader aria-label="reaction table">
                                <TableHead>
                                    <TableRow>
                                        {columns.map((column) => (
                                            <TableCell key={column.id}> {column.label} </TableCell>
                                        ))}
                                        <TableCell/>
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

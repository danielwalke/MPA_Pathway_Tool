import {addCompoundsToReactions} from "./ReactionCompoundsAdder";
import {useDispatch, useSelector} from "react-redux";
import {useStyles} from "../../ModalStyles/ModalStyles";
import React, {useEffect, useState} from "react";
import KeggCompoundAutoCompleteList from "./KeggCompoundAutoCompleteList";
import BiggCompoundAnnotation from "./BiggCompoundAnnotation";
import {FixedSizeList as List} from "react-window";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@material-ui/core";
import ReactionDetailsContainer from "./finalReactionTable/ReactionDetailsContainer";
import CompoundDetailsContainer from "./finalReactionTable/CompoundDetailsContainer";

const submit = (state, dispatch, compoundsForAnnotation) => {
    const newKeggCompounds = state.general.autoCompleteCompoundsList
    const newBiggCompounds = state.general.biggIdSelectionList
    const newCompoundsForAnnotation = compoundsForAnnotation

    console.log(state.general.autoCompleteCompoundsList)

    for (const [key, value] of Object.entries(newKeggCompounds)) {
        newCompoundsForAnnotation[key].keggId = value.substring(value.length-6)
        newCompoundsForAnnotation[key].keggName = value
        newCompoundsForAnnotation[key].biggId = newBiggCompounds[key]
    }

    //add additional information to each reaction
    const newListOfReactions = addCompoundsToReactions(state, state.general.listOfReactions, newCompoundsForAnnotation)

    dispatch({type: "SETLISTOFREACTIONS", payload: newListOfReactions})
    dispatch({type: "SETLOADING", payload: false})
    dispatch({type: "SHOWCOMPOUNDANNOTATION", payload: false})
    dispatch({type: "SHOWREACTIONANNOTATION", payload: true})
}

const CompoundTableRow = (props) => {

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

const CompoundAnnotation = () => {
    const dispatch = useDispatch()
    const state = useSelector(state => state)

    const [listOfSpecies, setListOfSpecies] = useState([])
    const [selectedRow, setSelectedRow] = useState(0)

    useEffect(() => {
        // updates local store with current list of reactions
        setListOfSpecies(state.general.listOfSpecies)
        // setListOfReactionsClone(state.general.listOfReactions)
    }, [state.general.listOfSpecies])

    const handleRowClick = (index) => {
        setSelectedRow(index)
    }

    //each row in the modal is virtualized with react-window -> each row is respective for an unannotated Compound

    const columns = [
        {id: 'compoundID', label: 'ID', minWidth: 170},
        {id: 'compoundName', label: 'name', minWidth: 100},
    ]

    return (
        <div className={"annotation-modal-content"}>
            <h5 className={"modal-header"}>Compound Annotations</h5>
            <div className={"annotation-body"}>
                <div className={"annotation-frame frame-margin-right"}>
                    <TableContainer className={"inner-container"}>
                        <Table stickyHeader aria-label="compound table">
                            <TableHead>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell key={column.id}> {column.label} </TableCell>
                                    ))}
                                    <TableCell/>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {listOfSpecies.map((row, index) => (
                                    <CompoundTableRow key={index}
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
                        {listOfSpecies.length > 0 &&
                        <CompoundDetailsContainer index={selectedRow}
                                                  listOfSpecies={listOfSpecies}/>}
                    </div>
                </div>
            </div>
            <div className={"button-bar button-right"}>
                <button
                    className={"download-button finish-button"}
                    onClick={() => submit(state, dispatch, listOfSpecies)}>
                    Finish
                </button>
            </div>
        </div>
    )

}

export default CompoundAnnotation

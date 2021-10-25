import {addCompoundsToReactions} from "../ReactionCompoundsAdder";
import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@material-ui/core";
import CompoundDetailsContainer from "./CompoundDetailsContainer";
import clonedeep from "lodash/cloneDeep";

const submit = (state, dispatch) => {
    const newListOfReactions = addCompoundsToReactions(state, state.general.listOfReactions, state.general.listOfSpecies)

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
    const [previousLisOfCompounds, setPreviousLisOfCompounds] = useState([])

    useEffect(() => {
        setPreviousLisOfCompounds(clonedeep(state.general.listOfSpecies))
    },[])

    useEffect(() => {
        // updates local store with current list of species
        setListOfSpecies(state.general.listOfSpecies)
    }, [state.general.listOfSpecies])

    const handleRowClick = (index) => {
        setSelectedRow(index)
    }

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
                                                  listOfSpecies={listOfSpecies}
                                                  defaultCompound={previousLisOfCompounds[selectedRow]}/>}
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

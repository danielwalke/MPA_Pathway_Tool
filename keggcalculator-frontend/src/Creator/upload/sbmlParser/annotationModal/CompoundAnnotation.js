import {addCompoundsToReactions} from "../ReactionCompoundsAdder";
import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel} from "@material-ui/core";
import CompoundDetailsContainer from "./CompoundDetailsContainer";
import clonedeep from "lodash/cloneDeep";
import {annotationIndicator} from "./AnnotationIndicator";
import SearchField from "./SearchField";
import {filterArray, getComparator, stableSort} from "./Sorting"

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
                props.handleRowClick(props.index, props.row.index)
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
                    {annotationIndicator(props.row.biggId)}
                </TableCell>
            </TableRow>
        </React.Fragment>
    )
}

const CompoundAnnotation = () => {
    const dispatch = useDispatch()
    const state = useSelector(state => state)

    const [listOfSpecies, setListOfSpecies] = useState([])
    const [tableArray, setTableArray] = useState([])
    const [selectedRow, setSelectedRow] = useState(0)
    const [listOfSpeciesIndex, setListOfSpeciesIndex] = useState(0)
    const [previousLisOfCompounds, setPreviousLisOfCompounds] = useState([])

    const [order, setOrder] = useState('asc')
    const [orderBy, setOrderBy] = useState('sbmlId')
    const [filterBy, setFilterBy] = useState('')

    const columns = [
        {id: 'sbmlId', label: 'ID', minWidth: 20},
        {id: 'sbmlName', label: 'name', minWidth: 100},
        {id: 'keggId', label: 'KEGG', minWidth: 10},
        {id: 'biggId', label: 'BIGG', minWidth: 10},
    ]

    useEffect(() => {
        setPreviousLisOfCompounds(clonedeep(state.general.listOfSpecies))
    },[])

    useEffect(() => {
        setListOfSpecies(state.general.listOfSpecies)
    }, [state.general.listOfSpecies])

    useEffect(() => {
        const filteredArray = filterArray(listOfSpecies, filterBy)
        const sortedArray = stableSort(filteredArray, getComparator(order, orderBy))
        setTableArray(sortedArray)

    }, [listOfSpecies, order, orderBy, filterBy])

    useEffect(() => {
        tableArray.length > 0 && setListOfSpeciesIndex(tableArray[0].index)
        setSelectedRow(0)
    }, [tableArray])

    const handleRowClick = (tableIndex, speciesIndex) => {
        setSelectedRow(tableIndex)
        setListOfSpeciesIndex(speciesIndex)
    }

    const handleRequestSort = (event, columnId) => {
        const isAsc = orderBy === columnId && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(columnId);
    };

    const createSortHandler = (columnId) => (event) => {
        handleRequestSort(event, columnId);
    };

    return (
        <div className={"annotation-modal-content"}>
            <h5 className={"modal-header"}>Compound Annotations</h5>
            <div className={"annotation-body"}>
                <div className={"annotation-frame frame-margin-right"}>
                    <div className={"inner-container"}>
                        <div className={"search-field-container"}>
                            <SearchField setFilterBy={setFilterBy}/>
                        </div>
                        {tableArray && <TableContainer className={"table-container"}>
                            <Table size="small" stickyHeader aria-label="compound table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="left" colSpan={2}>
                                            Details
                                        </TableCell>
                                        <TableCell align="left" colSpan={2}>
                                            Annotations
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        {columns.map((column) => (
                                            <TableCell key={column.id}
                                                       sortDirection={orderBy === column.id ? order : false}>
                                                <TableSortLabel
                                                    active={orderBy === column.id}
                                                    direction={orderBy === column.id ? order : 'asc'}
                                                    onClick={createSortHandler(column.id)}
                                                >
                                                    {column.label}
                                                </TableSortLabel>
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tableArray.map((row, tableIndex) => {
                                        return (
                                            <CompoundTableRow key={tableIndex}
                                                              row={row}
                                                              index={tableIndex}
                                                              handleRowClick={handleRowClick}
                                                              selectedRow={selectedRow}/>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>}
                    </div>
                </div>
                <div className={"annotation-frame frame-margin-left"}>
                    <div className={"inner-container"}>
                        {listOfSpecies.length > 0 &&
                        <CompoundDetailsContainer listOfSpeciesIndex={listOfSpeciesIndex}
                                                  listOfSpecies={listOfSpecies}
                                                  defaultCompound={previousLisOfCompounds[listOfSpeciesIndex]}/>}
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

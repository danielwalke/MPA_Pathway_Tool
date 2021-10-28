import {addCompoundsToReactions} from "../ReactionCompoundsAdder";
import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel} from "@material-ui/core";
import CompoundDetailsContainer from "./CompoundDetailsContainer";
import clonedeep from "lodash/cloneDeep";
import {annotationIndicator} from "./AnnotationIndicator";
import SearchField from "./SearchField";

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    console.log(order)
    console.log(orderBy)
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    console.log(stabilizedThis.map((el) => el[0]))
    return stabilizedThis.map((el) => el[0]);
}

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
                      selected={props.selectedRow === props.index}
                      tabIndex={-1}>
                <TableCell component="th" scope="row">
                    {props.row.sbmlId}
                </TableCell>
                <TableCell>
                    {props.row.sbmlName}
                </TableCell>
                <TableCell align={"center"}>
                    {annotationIndicator(props.row.keggId)}
                </TableCell >
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
    const [filteredList, setFilteredList] = useState([])
    const [selectedRow, setSelectedRow] = useState(0)
    const [previousLisOfCompounds, setPreviousLisOfCompounds] = useState([])

    const [order, setOrder] = useState('asc')
    const [orderBy, setOrderBy] = useState('sbmlId')

    const columns = [
        {id: 'sbmlId', label: 'ID', minWidth: 20},
        {id: 'sbmlName', label: 'name', minWidth: 100},
        {id: 'keggId', label: 'KEGG', minWidth: 10},
        {id: 'biggId', label: 'BIGG', minWidth: 10},
    ]

    useEffect(() => {
        setPreviousLisOfCompounds(clonedeep(state.general.listOfSpecies))
        setFilteredList([...state.general.listOfSpecies])
    },[])

    useEffect(() => {
        // updates local store with current list of species
        setListOfSpecies(state.general.listOfSpecies)
    }, [state.general.listOfSpecies])

    const handleRowClick = (index) => {
        setSelectedRow(index)
    }

    const handleRequestSort = (event, columnId) => {
        const isAsc = orderBy === columnId && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(columnId);
    };

    const createSortHandler = (columnId) => (event) => {
        console.log(event)
        handleRequestSort(event, columnId);
    };

    console.log(listOfSpecies)

    return (
        <div className={"annotation-modal-content"}>
            <h5 className={"modal-header"}>Compound Annotations</h5>
            <div className={"annotation-body"}>
                <div className={"annotation-frame frame-margin-right"}>
                    <div className={"inner-container"}>
                        <SearchField array={listOfSpecies} setFilterArray={setFilteredList}/>
                        <TableContainer>
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
                                    {stableSort(filteredList, getComparator(order, orderBy))
                                        .map((row, index) => {
                                            return (
                                                <CompoundTableRow key={index}
                                                                  row={row}
                                                                  index={index}
                                                                  handleRowClick={handleRowClick}
                                                                  selectedRow={selectedRow}/>
                                            )
                                        })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
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

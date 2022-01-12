/*
this component is a modal and responsible for showing all final information about the uploaded reactions from the selected sbml file
 */

import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {setReactionsAndCompoundsInStore} from "../../sbmlParser/GraphDrawer";
import clonedeep from "lodash/cloneDeep";
import "./RestoreIcon.css"
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, TableSortLabel
} from "@material-ui/core";

import ReactionDetailsContainer from "./ReactionDetailsContainer";
import {annotationIndicator} from "../AnnotationIndicator";
import SearchField from "../SearchField";
import {filterArray, getComparator, stableSort} from "../Sorting";

const ReactionTableRow = (props) => {

    return (
        <React.Fragment>
            <TableRow onClick={() => {
                props.handleRowClick(props.index, props.row.index)
            }}
                      sx={{'& > *': {borderBottom: 'unset'}}}
                      hover
                      selected={props.selectedRow === props.index}>
                {
                    props.annotateSbml &&
                    <TableCell component="th" scope="row">
                        {props.row.sbmlId}
                    </TableCell>
                }
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

        const [columns, setColumns] = useState([])

        const [listOfReactions, setListOfReactions] = useState([]);
        const [selectedRow, setSelectedRow] = useState(0)
        const [previousListOfReactions, setPreviousListOfReactions] = useState([])

        const [tableArray, setTableArray] = useState([])
        const [listOfReactionsIndex, setListOfReactionsIndex] = useState(0)
        const [order, setOrder] = useState('asc')
        const [orderBy, setOrderBy] = useState('sbmlId')
        const [filterBy, setFilterBy] = useState('')

        useEffect(() => {
            setPreviousListOfReactions(clonedeep(state.general.listOfReactions))

            const columns = [
                {id: 'sbmlName', label: 'name', minWidth: 10},
                {id: 'keggId', label: 'KEGG Reaction', minWidth: 10},
                {id: 'biggId', label: 'BIGG Reaction', minWidth: 10},
                {id: 'koNumbers', label: 'K Number', minWidth: 10},
                {id: 'ecNumbers', label: 'EC', minWidth: 10}
            ]
            if (state.general.annotateSbml) {
                columns.unshift({id: 'sbmlId', label: 'ID', minWidth: 10},)
            }
            setColumns(columns)
        }, [])

        useEffect(() => {
            // updates local store with current list of reactions
            setListOfReactions(state.general.listOfReactions)
        }, [state.general.listOfReactions])

        useEffect(() => {
            const filteredArray = filterArray(listOfReactions, filterBy)
            const sortedArray = stableSort(filteredArray, getComparator(order, orderBy))
            setTableArray(sortedArray)

        }, [listOfReactions, order, orderBy, filterBy])

        useEffect(() => {
            tableArray.length > 0 && setListOfReactionsIndex(tableArray[0].index)
            setSelectedRow(0)
        }, [tableArray])

        const handleFinish = () => {
            //set data for the Graph
            const data = setReactionsAndCompoundsInStore(state, state.general.listOfReactions, dispatch)
            dispatch({type: "SHOWREACTIONANNOTATION", payload: false})
            dispatch({type: "SHOWANNOTATIONTABLE", payload: false})
            dispatch({type: "SETDATA", payload: data})
            dispatch({type: "SET_LIST_OF_SPECIES_GLYPHS", payload: []})
            dispatch({type: "SET_LIST_OF_REACTION_GLYPHS", payload: []})
            dispatch({type: "SETLISTOFSPECIES", payload: []})
            dispatch({type: "SETLISTOFREACTIONS", payload: []})
            dispatch({type: "SETLOADING", payload: false})
            dispatch({type: "SWITCHUPLOADMODAL"})
        }

        const handleGoToCompounds = () => {
            dispatch({type: "SHOWREACTIONANNOTATION", payload: false})
            dispatch({type: "SHOWCOMPOUNDANNOTATION", payload: true})
        }

        const handleRowClick = (tableIndex, reactionIndex) => {
            setSelectedRow(tableIndex)
            setListOfReactionsIndex(reactionIndex)
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
                <h5 className={"modal-header"}>Reaction Annotations</h5>
                <div className={"annotation-body"}>
                    <div className={"annotation-frame frame-margin-right"}>
                        <div className={"inner-container"}>
                            <div className={"search-field-container"}>
                                <SearchField setFilterBy={setFilterBy}/>
                            </div>
                            {tableArray && columns.length > 0 && <TableContainer className={"table-container"}>
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
                                        {tableArray.map((row, tableIndex) => (
                                            <ReactionTableRow key={tableIndex}
                                                              row={row}
                                                              index={tableIndex}
                                                              handleRowClick={handleRowClick}
                                                              selectedRow={selectedRow}
                                                              annotateSbml={state.general.annotateSbml}
                                            />
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>}
                        </div>
                    </div>
                    <div className={"annotation-frame frame-margin-left"}>
                        <div className={"inner-container table-container"}>
                            {listOfReactions.length > 0 &&
                            <ReactionDetailsContainer
                                index={listOfReactionsIndex}
                                rowInfo={listOfReactions[listOfReactionsIndex]}
                                defaultReaction={previousListOfReactions[listOfReactionsIndex]}
                                annotateSbml={state.general.annotateSbml}/>
                            }
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

import React, {useEffect, useState} from "react";
import SearchField from "../../Creator/upload/annotationModal/SearchField";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel} from "@material-ui/core";
import {useSelector} from "react-redux";
import ResultTableRow from "./ResultTableRow";
import {exampleFluxData, exampleSmomentFluxData, fluxExample} from "./exampleData";
import {parseFluxTableArray} from "../services/resultTableServices";
import {filterArray, getComparator, stableSort} from "../../Creator/upload/annotationModal/sorting";

export function ResultTable() {

    const fluxState = useSelector(state => state.fluxAnalysis)
    const generalState = useSelector(state => state.general)
    const [fluxTableArray, setFluxTableArray] = useState([])

    const [order, setOrder] = useState('asc')
    const [orderBy, setOrderBy] = useState('reactionId')
    const [filterBy, setFilterBy] = useState('')

    const thinBorder = {'borderRight': '1px solid rgba(224, 224, 224, 1)'}
    const thickBorder = {'borderRight': '2px solid rgba(224, 224, 224, 1)'}

    const columns = [
        {id: 'reactionId', label: 'Reaction Id', minWidth: 100, align: 'left', style: thinBorder},
        {id: 'reactionAbbreviation', label: 'Reaction Abbreviation', minWidth: 10, align: 'left', style: thickBorder},
        {id: 'fbaFlux', label: 'FBA Flux (orig.)', minWidth: 10, align: 'center', style: thinBorder},
        {id: 'fbaFluxSmoment', label: 'FBA Flux (sMOMENT)', minWidth: 10, align: 'center', style: thickBorder},
        {id: 'fvaMin', label: 'FVA Min (orig.)', minWidth: 10, align: 'center', style: thinBorder},
        {id: 'fvaMinSmoment', label: 'FVA Min (sMOMENT)', minWidth: 10, align: 'center', style: thickBorder},
        {id: 'fvaMax', label: 'FVA Max (orig)', minWidth: 10, align: 'center', style: thinBorder},
        {id: 'fvaMaxSmoment', label: 'FVA Max (sMOMENT)', minWidth: 10, align: 'center', style: thickBorder}
    ]

    useEffect(() => {
        const newArray = parseFluxTableArray(generalState, fluxState)
        setFluxTableArray(newArray)
    },[])

    const handleRequestSort = (event, columnId) => {
        const isAsc = orderBy === columnId && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(columnId);
    };

    const createSortHandler = (columnId) => (event) => {
        handleRequestSort(event, columnId);
    };

    return(
        <div className={"modal-content"}>
            <h5 className={"modal-header"}>Flux Analysis Results</h5>
                <div className={"annotation-body"}>
                    <div className={"annotation-frame"}>
                    <div className={"inner-container"}>
                    <div className={"search-field-container"}>
                        <SearchField setFilterBy={setFilterBy}/>
                    </div>
                    <TableContainer className={"table-container "}>
                        <Table size="small" stickyHeader aria-label="compound table">
                            <TableHead>
                                <TableRow>
                                    {columns.map(column => (
                                        <TableCell
                                            key={column.id}
                                            align={column.align}
                                            style={column.style}
                                            sortDirection={orderBy === column.id ? order : false}
                                        >
                                            <TableSortLabel
                                                active={orderBy === column.id}
                                                direction={orderBy === column.id ? order : 'asc'}
                                                onClick={createSortHandler(column.id)}>
                                            {column.label}
                                            </TableSortLabel>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {fluxTableArray.length > 0 &&
                                    stableSort(filterArray(fluxTableArray, filterBy), getComparator(order, orderBy)).map((row, tableIndex) => {
                                        return (
                                            <ResultTableRow key={tableIndex}
                                                            row={row}
                                                            index={tableIndex}
                                            />
                                        )
                                    })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
                </div>
        </div>
    )
}

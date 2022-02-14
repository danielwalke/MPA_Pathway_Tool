import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import clonedeep from "lodash/cloneDeep";
import {filterArray, getComparator, stableSort} from "../sorting";
import SearchField from "../SearchField";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel} from "@material-ui/core";
import GeneDetailsContainer from "./GeneDetailsContainer";
import {annotationIndicator} from "../AnnotationIndicator";
import GeneAdder from "./GeneAdder";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import {cloneDeep} from "lodash";
import {ArrowBackIosNew} from "@mui/icons-material";
import {ArrowForwardIos} from "@material-ui/icons";

export function getGenesFromReactions (listOfReactions) {
    const genes = new Set()

    for (const reaction of listOfReactions) {
        if ("geneRule" in reaction) {
            reaction.geneRule.forEach(gene => {
                if ("gene" in gene) {
                    genes.add(gene.gene)
                }
            })
        }
    }

    return genes
}

function GeneTableRow(props) {

    return(
        <React.Fragment>
            <TableRow onClick={() => {
                props.handleRowClick(props.index, props.row.index)
            }}
                      sx={{'& > *': {borderBottom: 'unset'}}}
                      hover
                      selected={props.selectedRow === props.index}>
                <TableCell>
                    {props.row.id}
                </TableCell>
                <TableCell>
                    {annotationIndicator(props.row.uniprotAccession)}
                </TableCell>
                <TableCell>
                    <IconButton disabled={props.disableDelete} size="small" aria-label="delete"
                                onClick={() => props.handleDelete(props.row)}>
                        <DeleteIcon />
                    </IconButton>
                </TableCell>
            </TableRow>
        </React.Fragment>
    )
}

export function GeneAnnotation() {

    const [listOfGenes, setListOfGenes] = useState([])
    const [tableArray, setTableArray] = useState([])
    const [selectedRow, setSelectedRow] = useState(0)
    const [listOfGenesIndex, setListOfGenesIndex] = useState(0)
    const [previousLisOfGenes, setPreviousLisOfGenes] = useState([])
    const [genesFromReactions, setGenesFromReaction] = useState([])

    const [order, setOrder] = useState('asc')
    const [orderBy, setOrderBy] = useState('geneProductId')
    const [filterBy, setFilterBy] = useState('')

    const state = useSelector(state => state)
    const dispatch = useDispatch()

    const columns = [
        {id: 'id', label: 'gene product id', minWidth: 100},
        {id: 'uniprotAccession', label: 'UniProt Accession', minWidth: 10},
        {id: 'delete', label: "", minWidth: 10}
    ]

    useEffect(() => {
        setPreviousLisOfGenes(clonedeep(state.general.listOfGeneProducts))
        const newGenesFromReactions = getGenesFromReactions(state.general.listOfReactions)
        setGenesFromReaction([...newGenesFromReactions])
    }, [])

    useEffect(() => {
        setListOfGenes(state.general.listOfGeneProducts)
    }, [state.general.listOfGeneProducts])

    useEffect(() => {
        const filteredArray = filterArray(listOfGenes, filterBy)
        const sortedArray = stableSort(filteredArray, getComparator(order, orderBy))
        setTableArray(sortedArray)

    }, [listOfGenes, order, orderBy, filterBy])

    useEffect(() => {
        tableArray.length > 0 && setListOfGenesIndex(tableArray[0].index)
        setSelectedRow(0)
    }, [tableArray])

    const handleRowClick = (tableIndex, geneIndex) => {
        setSelectedRow(tableIndex)
        setListOfGenesIndex(geneIndex)
    }

    const handleRequestSort = (event, columnId) => {
        const isAsc = orderBy === columnId && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(columnId);
    };

    const createSortHandler = (columnId) => (event) => {
        handleRequestSort(event, columnId);
    };

    const goToCompounds = () => {
        dispatch({type: "SHOW_GENE_PRODUCT_ANNOTATION", payload: false})
        dispatch({type: "SHOWCOMPOUNDANNOTATION", payload: true})
    }

    const goToReactions = () => {
        dispatch({type: "SHOW_GENE_PRODUCT_ANNOTATION", payload: false})
        dispatch({type: "SHOWREACTIONANNOTATION", payload: true})
    }

    const handleDelete = (geneForDeletion) => {
        let newListOfGeneProducts = cloneDeep(state.general.listOfGeneProducts)
        let deleteIndex = newListOfGeneProducts.findIndex(gene => gene.index === geneForDeletion.index)
        if (deleteIndex !== -1) {
            newListOfGeneProducts.splice(deleteIndex, 1);
        }

        dispatch({type: "SET_LIST_OF_GENE_PRODUCTS", payload: newListOfGeneProducts})
    }

    return (
        <div className={"modal-content"}>
            <h5 className={"modal-header"}>Gene Product Annotation</h5>
            <div className={"annotation-body"}>
                <div className={"annotation-frame frame-margin-right"}>
                    <div className={"inner-container"}>
                        <div className={"search-field-container"}>
                            <SearchField setFilterBy={setFilterBy}/>
                        </div>
                        {tableArray && columns.length > 0 &&
                            <TableContainer className={"table-container"}>
                                <Table size="small" stickyHeader aria-label="compound table">
                                    <TableHead>
                                        <TableRow>
                                            {columns.map((column) => (
                                                <TableCell key={column.id}
                                                           sortDirection={orderBy === column.id ? order : false}>
                                                    {column.id !== 'delete' && <TableSortLabel
                                                        active={orderBy === column.id}
                                                        direction={orderBy === column.id ? order : 'asc'}
                                                        onClick={createSortHandler(column.id)}
                                                    >
                                                        {column.label}
                                                    </TableSortLabel>}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {tableArray.map((row, tableIndex) => {
                                            return (
                                                <GeneTableRow key={tableIndex}
                                                              row={row}
                                                              index={tableIndex}
                                                              handleRowClick={handleRowClick}
                                                              selectedRow={selectedRow}
                                                              handleDelete={handleDelete}
                                                              disableDelete={genesFromReactions.includes(row.id)}
                                                />
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        }
                    </div>
                </div>
                <div className={"gene-annotation"}>
                    <div className={"annotation-frame frame-margin-left frame-margin-bottom"}>
                        <div className={"inner-container"}>
                            {listOfGenes.length > 0 &&
                                <GeneDetailsContainer listOfGenesIndex={listOfGenesIndex}
                                                      listOfGenes={listOfGenes}
                                                      defaultGene={previousLisOfGenes[listOfGenesIndex]}
                                />}
                        </div>
                    </div>
                    <div className={"annotation-frame frame-margin-left frame-margin-top"}>
                        <div className={"inner-container"}>
                            <div className={"table-container"}>
                                <GeneAdder/>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div className={"button-bar spaced-buttons"}>
                <button className={"download-button circle-icon button-10rem"} style={{paddingRight: "1rem"}} onClick={goToCompounds}>
                    <ArrowBackIosNew style={{fontSize: "1rem"}}/> Compounds
                </button>
                <button className={"download-button circle-icon button-10rem"} style={{paddingLeft: "1rem"}} onClick={goToReactions}>
                    Reactions <ArrowForwardIos style={{fontSize: "1rem"}}/>
                </button>
            </div>
        </div>
    )

}

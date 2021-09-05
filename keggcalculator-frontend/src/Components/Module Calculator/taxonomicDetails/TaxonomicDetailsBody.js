import React, {useEffect, useState} from 'react';
import AddBoxIcon from '@material-ui/icons/AddBox';
import { FormControl, makeStyles, Select} from "@material-ui/core";
import {ToolTipBig} from "../../../Creator/main/user-interface/UserInterface";
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';

const TaxonomicDetailsBody = (props) => {
    const {data, classes} = props
    const [lines, setLines] = useState([])
    const [isExpanded, setIsExpanded] = useState(0)
    const [columnSets, setColumnSets] = useState([])
    const columnSetArray = []

    const filter = (filterValue, index) => {
        const newLines = data.split("\n")
        const filteredLines = newLines.filter((line, lineIndex) => {
            const entries = line.split("\t")
            if (lineIndex === 0) return true
            return entries[index] === filterValue || filterValue === ""
        })
        setLines(filteredLines)
    }

    const addColumnSets = (entries, indexLine) => {
        indexLine === 0 ? entries.forEach(() => columnSetArray.push(new Set())) :
            entries.forEach((entry, i) => {
                const columnSet = columnSetArray[i]
                if (entries[i]) {
                    columnSet.add(entries[i])
                }

            })
        return columnSetArray
    }

    const handleExpand = (indexQuery) => {
        const newLines = data.split("\n")
        const filteredLines = newLines.filter((line, indexLine) => {
            const entries = line.split("\t")
            const index = entries[0]
            const indexEntries = index.split(".")
            return (!index.includes(".") || indexQuery === indexEntries[0])
        })
        const lineIndex = newLines.findIndex(line => {
            const entriesLine = line.split("\t")
            const indexLine = entriesLine[0]
            return indexLine === indexQuery
        })
        setIsExpanded(lineIndex)
        setLines(filteredLines)
    }

    const shrink = () => {
        const newLines = data.split("\n")
        const filteredLines = newLines.filter((line, indexLine) => {
            const entries = line.split("\t")
            setColumnSets(addColumnSets(entries, indexLine))
            const index = entries[0]
            return (!index.includes("."))
        })
        setLines(filteredLines)
    }


    useEffect(() => {
        shrink()
    }, [props])

    return (
        <div className={classes.paper}>
            <div style={{width: "80vw", height: "90vh", overflow: "auto"}}>
                <table style={{margin:"5px 0"}}>
                    {lines.map((line, index) => <Line isFirst={index === 0} line={line} index={index}
                                                      handleExpand={handleExpand} columnSets={columnSets} shrink={shrink}
                                                      filter={filter}/>)}
                </table>
            </div>

        </div>

    );
};

export default TaxonomicDetailsBody;

const Line = (props) => {
    const {line, isFirst, index, handleExpand, columnSets, filter, shrink} = props
    const [entries, setEntries] = useState([""])
    const [isFilter, setIsFilter] = useState(false)
    const [entryIndex, setEntryIndex] = useState(0)
    const [isExpanded, setIsExpanded] = useState(false)


    const isHeader = (indexQuery) => {
        return !indexQuery.includes(".")
    }


    const showFilter = (i) => {
        setEntryIndex(i)
        setIsFilter(true)
        // setOpenPopover(true)
    }

    useEffect(() => {
        const newEntries = line.split("\t")
        setEntries(newEntries)
    }, [props])

    if (isFirst) {
        return (
            <tr>
                <th style={{border: "2px solid black"}} onClick={() => handleExpand(index)}>action</th>
                {entries.map((entry, i) => {
                    if (isFilter && i === entryIndex) {
                        return (<th style={{border: "2px solid rgb(150, 25, 130)", minWidth:"7vw"}}>
                            <FilterBody index={i} columnSets={columnSets} setIsFilter={setIsFilter} filter={filter}/>
                        </th>)
                    } else {
                        return (
                            <ToolTipBig title={`Filter ${entry}`} placement={"top"}>
                                <th onClick={() => showFilter(i)}
                                    style={{border: "2px solid rgb(150, 25, 130)", cursor: "pointer"}}>{entry}
                                </th>
                            </ToolTipBig>

                        )
                    }

                })}

            </tr>
        )
    } else {
        return (
            <tr>
                {isHeader(entries[0]) && !isExpanded && <td style={{border: "1px solid rgb(150, 25, 130)", cursor: "pointer"}}><AddBoxIcon
                    onClick={() => {
                        setIsExpanded(true)
                        handleExpand(entries[0])
                    }}/></td>}
                {isHeader(entries[0]) && isExpanded && <td style={{border: "1px solid rgb(150, 25, 130)", cursor: "pointer"}}><IndeterminateCheckBoxIcon
                    onClick={() => {
                        setIsExpanded(false)
                        shrink()
                    }}/></td>}
                {!isHeader(entries[0]) && <td style={{border: "1px solid rgb(150, 25, 130)", cursor: "pointer"}}> </td>}
                {entries.map(entry => {
                    return (
                        <td style={{border: "1px solid black"}}>{entry}</td>

                    )
                })}
            </tr>
        )
    }
}

const FilterBody = (props) => {
    const {index, columnSets, setIsFilter, filter} = props
    const [column, setColumn] = useState([])
    const [selectedValue, setSelectedValue] = useState("")

    useEffect(() => {
        setColumn(Array.from(columnSets[index]))
    }, [props])


    const handleChange = (event) => {
        const value = event.target.value
        setSelectedValue(value)
        if (value === "All") {
            filter("", index)
            setIsFilter(false)
            console.warn("CLOSE")
        } else {
            filter(value, index)
        }
    }

    const classes = makeStyles((theme) => ({
        root: {
            width: "auto"
        },
    }));

    return (
        <div>
            <FormControl style={{width: "auto"}}>
                <Select
                    className={classes.root}
                    native
                    value={selectedValue}
                    onChange={event => handleChange(event)}
                >
                    <option value="All">None</option>
                    {column && column.map(entry => {
                        return (
                            <option value={entry}>{entry}</option>
                        )
                    })}
                </Select>
            </FormControl>

        </div>
    )
}

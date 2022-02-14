import React, {useEffect, useState} from "react";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {Autocomplete} from "@material-ui/lab";
import {useDispatch, useSelector} from "react-redux";
import {CustomButton} from "../../../../Components/Home/Home";
import {IconButton} from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from "@material-ui/icons/Delete";
import {deleteObjectFromArray, findLowestUnusedIndex} from "../../../usefulFunctions/Arrays";

function GeneSelector(props) {

    const generalState = useSelector(state => state.general)

    return(
        <div style={{width: "30%"}}>
            <Autocomplete
                disabled={props.disabled}
                size={"small"}
                id={"geneSelector"}
                options={generalState.listOfGeneProducts.map(gene => gene.id)}
                noOptionsText={'I could\'t find this name'}
                value={props.newGene}
                onChange={(event, value) => {
                    props.setNewGene(value)
                }}
                renderInput={params => (
                    <TextField
                        value={props.newGene}
                        {...params}
                        label="gene ids"
                        variant="outlined"
                    />
                )}
            />
        </div>
    )
}

function RelationSelector(props) {

    return(
        <div style={{width: "30%"}}>
            <FormControl fullWidth variant="outlined" size={"small"}>
                <InputLabel id="add-gene-rule">add to gene rule</InputLabel>
                <Select
                    labelId="compound compartment"
                    value={props.relation}
                    onChange={(e) => {
                        props.setRelation(e.target.value)}
                    }
                >
                    {props.relationOptions.map(
                        (option, index) => <MenuItem key={index} value={option}> {option} </MenuItem>)}
                </Select>
            </FormControl>
        </div>
    )
}

function GeneRuleAdder(props) {

    const relationOptions = ["Gene", "OR Block", "AND Block"]

    return(
     <div className={"gene-rule-adder"}>
         <RelationSelector
             relation={props.relation}
             setRelation={props.setRelation}
             relationOptions={relationOptions}
         />
         <GeneSelector
             disabled={props.relation !== "Gene"}
             newGene={props.newGene}
             setNewGene={props.setNewGene}
         />
         {props.showAddButton &&
             <span style={{flex: "1 1 30%"}}>
                 <CustomButton onClick={() => props.handleAddition(0)}>Add Gene Rule</CustomButton>
             </span>
         }
     </div>
    )
}

function GeneRuleElement(props) {

    return (
        <div className={"gene-rule-el"}>
            <div className={"gene-rule-el-header"}>
                <p style={{margin: "0"}}>{props.header}</p>
                <span className={"gene-rule-header-el"}>
                    <IconButton size={"small"}
                               onClick={() => props.handleDelete(props.id)}>
                    <DeleteIcon/>
                </IconButton>
                </span>
                {props.header !== "None" &&
                    <span>
                        <IconButton size={"small"} className={"gene-rule-header-el"}
                                   onClick={() => props.handleAddition(props.id)}>
                        <AddCircleIcon/>
                    </IconButton>
                    </span>
                }
            </div>
            <div className={"gene-rule-el-body"}>
                {props.body}
            </div>
        </div>
    )
}

function traverseGeneRules(relation, childrenOfLowestParent, parentId, geneRule, handleDelete, handleAddition) {

    let body = []

    for (const child of childrenOfLowestParent) {
        if (child.hasOwnProperty("gene")) {
            body.push(
                <div className={"gene-rule-el-item"} key={child.id}>
                    <div>{child.gene}</div>
                    <IconButton size={"small"} onClick={() => handleDelete(child.id)}><DeleteIcon/></IconButton>
                </div>)
        } else {
            const childrenOfNextParent = geneRule.filter(nextChild => nextChild.parent === child.id)

            if (child.relation === "OR") {
                body.push(
                    traverseGeneRules("OR", childrenOfNextParent, child.id, geneRule, handleDelete, handleAddition))
            } else if (child.relation === "AND") {
                body.push(
                    traverseGeneRules("AND", childrenOfNextParent, child.id, geneRule, handleDelete, handleAddition))
            }
        }
    }

    return (<GeneRuleElement id={parentId} header={relation} body={body}
                             handleDelete={handleDelete} handleAddition={handleAddition}/>)
}

function generateTreeOfGeneRules(geneRule, handleDelete, handleAddition) {

    let lowestParentId = 1
    let lowestParentRelation
    const body = []

    const lowestParentElement = geneRule.find(parent => parent.id === 1)

    if (lowestParentElement.hasOwnProperty("gene")) {
        lowestParentRelation = "None"
        body.push(
            <div className={"gene-gene-rule-el-item"} key={lowestParentElement.id}>
                <div>{lowestParentElement.gene}</div>
                <IconButton size={"small"} onClick={() => handleDelete(1)}><DeleteIcon/></IconButton>
            </div>)

        return (
            <GeneRuleElement id={0} header={lowestParentRelation} body={body} handleDelete={handleDelete}
                             handleAddition={handleAddition}/>
        )
    } else {
        lowestParentRelation = lowestParentElement.relation
        const childrenOfLowestParent = geneRule.filter(child => child.parent === lowestParentId)

        return (
            traverseGeneRules(lowestParentRelation, childrenOfLowestParent, 1, geneRule, handleDelete, handleAddition))
    }
}

function getAllChildren(parentId, geneRule) {
    const listOfChildren = []

    for (const child of geneRule) {
        if (child.parent === parentId) {
            listOfChildren.push(child.id)
            listOfChildren.push(...getAllChildren(child.id, geneRule))
        }
    }

    return listOfChildren
}

export default function GeneRule(props) {

    const [geneRule, setGeneRule] = useState(null)

    const [relation, setRelation] = useState("Gene")
    const [newGene, setNewGene] = useState("")

    const dispatch = useDispatch()

    const handleDelete = (id) => {
        const newGeneRule = [...geneRule]
        const listOfChildren = getAllChildren(id, geneRule)
        for (const deleteId of [...listOfChildren, id]) {
            deleteObjectFromArray(newGeneRule, "id", deleteId)
        }
        setGeneRule(newGeneRule)
        updateListOfReactions(newGeneRule)
    }

    const handleAddition = (parent) => {
        const newIndex = findLowestUnusedIndex(geneRule, "id", 1)
        const newGeneRule = [...geneRule]
        if (relation === "Gene" && newGene !== "") {
            newGeneRule.push({id: newIndex, parent: parent, gene: newGene})
        } else if (relation === "AND Block") {
            newGeneRule.push({id: newIndex, parent: parent, relation: "AND"})
        } else if (relation === "OR Block") {
            newGeneRule.push({id: newIndex, parent: parent, relation: "OR"})
        }
        setGeneRule(newGeneRule)
        updateListOfReactions(newGeneRule)
    }

    const updateListOfReactions = (newGeneRule) => {
        if(props.listOfReactions[props.index].geneRule !== newGeneRule) {
            const newListOfReactions = props.listOfReactions
            newListOfReactions[props.index].geneRule = newGeneRule
            dispatch({type: "SETLISTOFREACTIONS", payload: newListOfReactions})
        }
    }

    useEffect(() => {
        setGeneRule([...props.listOfReactions[props.index].geneRule])
    }, [props.index])

    useEffect(() => {
        console.log(geneRule)
    },[geneRule])


    return (
        <div className={"detail-view"} style={{paddingLeft: "0", paddingRight: "0"}}>
            {geneRule && geneRule.length !== 0 ?
                generateTreeOfGeneRules(geneRule, handleDelete, handleAddition) :
                <div style={{textAlign: "center"}}>no gene rule</div>
            }
            <GeneRuleAdder
                relation={relation}
                setRelation={setRelation}
                newGene={newGene}
                setNewGene={setNewGene}
                handleAddition={handleAddition}
                showAddButton={!geneRule || geneRule.length === 0}
            />
        </div>
    )
}

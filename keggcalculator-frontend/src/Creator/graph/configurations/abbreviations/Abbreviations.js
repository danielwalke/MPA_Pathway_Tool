import {useDispatch, useSelector} from "react-redux";
import Modal from "@material-ui/core/Modal";
import React from "react";
import {makeStyles} from "@material-ui/core";
import "./Abbreviation.css"

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        fontFamily: "Roboto",
        border: '2px solid rgb(150, 25, 130)',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    }
}));

const Abbreviation = () => {
    const state = useSelector(state => state.graph)
    const dispatch = useDispatch()
    const classes = useStyles()
    const nodesSet = new Set()
    state.data.nodes.map(node => nodesSet.add(node.id))
    const nodes = Array.from(nodesSet)

    const abundantNodes = nodes.filter(node => {
        let isAbundant = false
        for (let i = 0; i < state.abundantCompounds.length; i++) {
            const comp = state.abundantCompounds[i]
            if (node.substring(node.length - 6, node.length) === comp.substring(comp.length - 6, comp.length)) {
                isAbundant = true;
                break;
            }
        }
        return isAbundant
    })

    const otherNodes = nodes.filter(node => !abundantNodes.includes(node))


    const handleAbbreviationChange = (e, node) => {
        const abbreviation = {node: node, abbreviation: e.target.value}
        dispatch({type: "SETABBREVIATION", payload: abbreviation})
    }

    const handleSubmitAbbreviation = (e, node, defValue) => {
        // const node = state.abbreviation.node
        const nodeAbbr = typeof state.abbreviation.abbreviation === "undefined" ? `${defValue}` : `${state.abbreviation.abbreviation}`
        if (e.target.name === "otherNodes") {
            if (typeof state.abbreviation.node !== "undefined") {
                state.abbreviationsObject[`${state.abbreviation.node}`] = nodeAbbr
            } else {
                state.abbreviationsObject[`${node}`] = nodeAbbr
            }
        } else {
            const filteredAbundantNodes = abundantNodes.filter(abundantNode => abundantNode.includes(node))
            filteredAbundantNodes.forEach(filteredNode => {
                state.abbreviationsObject[`${filteredNode}`] = nodeAbbr
            })
        }
        dispatch({type:"ADD_ABBREVIATION_TO_AUDIT_TRAIL", payload: state.abbreviationsObject})
        dispatch({type: "SETABBREVIATIONOBJECT", payload: state.abbreviationsObject})

    }

//set values for all clones and hide clones
    const body = (
        <div className={classes.paper} style={{width: "60vw", height: "90vh", overflow: "scroll"}}>
            <h3>Abbreviations</h3>
            {otherNodes.map(node => {
                const defValue = node.includes(";") ? node.split(";")[0] : node
                return (
                    <div key={node} className={"abbreviationContainer"}>
                        <div className={"abbreviation"}>
                            <input name={"otherNodes"} type={"text"}
                                   defaultValue={defValue}
                                   onChange={(e) => handleAbbreviationChange(e, node)}/>
                        </div>
                        <div className={"fullName"}>=> {node}</div>
                        <div className={"submitAbbreviation"}>
                            <button name={"otherNodes"} className={"downloadButton"}
                                    onClick={(e) => handleSubmitAbbreviation(e, node, defValue)}>Submit
                            </button>
                        </div>

                    </div>)
            })}
            {state.abundantCompounds.map(compound => {
                const defValue = compound.includes(";") ? compound.split(";")[0] : compound
                return (
                    <div key={compound} className={"abbreviationContainer"}>
                        <div className={"abbreviation"}>
                            <input name={"abundantNodes"} type={"text"}
                                   defaultValue={defValue}
                                   onChange={(e) => handleAbbreviationChange(e, compound)}/>
                        </div>
                        <div className={"fullName"}>=> {compound}</div>
                        <div className={"submitAbbreviation"}>
                            <button name={"abundantNodes"} className={"downloadButton"}
                                    onClick={(e) => handleSubmitAbbreviation(e, compound, defValue)}>Submit
                            </button>
                        </div>

                    </div>
                )
            })}
        </div>
    )
    return (
        <div>
            <Modal className={classes.modal} open={state.showAbbreviations}
                   onClose={() => dispatch({type: "SWITCHSHOWABBREVIATIONS"})}>
                {body}
            </Modal>
        </div>
    )
}

export default Abbreviation

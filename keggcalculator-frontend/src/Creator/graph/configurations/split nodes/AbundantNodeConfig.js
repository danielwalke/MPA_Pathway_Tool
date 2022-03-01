import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import Modal from "@material-ui/core/Modal";
import {makeStyles} from "@material-ui/core";
import Field from "../../../specReaction/substrates and products/Field";
import {isRequestValid} from "../../../request/RequestValidation";
import DeleteIcon from "@material-ui/icons/Delete";
import "./AbundantNodeConfig.css"
import {COMPOUND_NODE_COLOR} from "../../Constants"
import {ToolTipBig} from "../../../main/user-interface/UserInterface";
import {changePropsInListEl} from "../../../usefulFunctions/reactionArrayFunctions";

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        width: "60vw",
        backgroundColor: theme.palette.background.paper,
        fontFamily: "Roboto",
        border: '2px solid rgb(150, 25, 130)',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    }
}));

const AbundantNodeConfig = () => {
    const graphState = useSelector(state => state.graph)
    const generalState = useSelector(state => state.general)
    const dispatch = useDispatch()
    const classes = useStyles()

    const [autocompleteOptions, setAutocompleteOptions] = useState([])

    useEffect(() => {
        const options = []
        graphState.data.nodes.forEach(node => {
                if (node.symbolType === 'circle') {
                    options.push(node.id)
                }
            }
        )
        setAutocompleteOptions(options)
    },[])

    const filterAbundantCompounds = () => {
        const newNodes = [...graphState.data.nodes]
        const newLinks = [...graphState.data.links]
        const newReactionArray = [...generalState.reactionsInSelectArray]
        const data = {nodes: [], links: []}

        graphState.abundantCompounds.forEach(comp => {
            let origNodeX = 0
            let origNodeY = 0
            let splitNodeDist = 0

            const origNode = newNodes.find(node => comp === node.id)

            if (origNode) {
                origNodeX = origNode.x
                origNodeY = origNode.y
                splitNodeDist = 40
            }

            let index = 0
            newLinks.forEach(link => {
                let linkContainsCompound = link.source === comp || link.target === comp

                if (link.source === comp && !link.isReversibleLink) {
                    const newProps = {
                        id: `${index}__${link.source}`,
                        x: origNodeX,
                        y: origNodeY + splitNodeDist * index,
                        color: COMPOUND_NODE_COLOR,
                        opacity: 0.4,
                    }
                    newNodes.push(newProps)

                    const reaction = newReactionArray.find(reaction => reaction.reactionName === link.target)
                    reaction.substrates = changePropsInListEl(
                        reaction.substrates,
                        comp,
                        {x: newProps.x, y: newProps.y, name: newProps.id}
                    )

                } else if (link.target === comp && !link.isReversibleLink) {
                    const newProps = {
                        id: `${index}__${link.target}`,
                        x: origNodeX,
                        y: origNodeY + splitNodeDist * index,
                        color: COMPOUND_NODE_COLOR,
                        opacity: 0.4,
                    }
                    newNodes.push(newProps)

                    const reaction = newReactionArray.find(reaction => reaction.reactionName === link.source)
                    reaction.products = changePropsInListEl(
                        reaction.products,
                        comp,
                        {x: newProps.x, y: newProps.y, name: newProps.id}
                    )
                }

                // modify all links
                if (link.source === comp) {
                    link.source = `${index}__${link.source}`
                    link.opacity = 0.4
                } else if (link.target === comp) {
                    link.target = `${index}__${link.target}`
                    link.opacity = 0.4
                }

                !link.isReversibleLink && linkContainsCompound && index++
            })
        })

        data.links = newLinks
        data.nodes = newNodes.filter(node => !graphState.abundantCompounds.includes(node.id))

        console.log(data)
        console.log(newReactionArray)

        dispatch({type: "SETDATA", payload: data})
        dispatch({type: "SETREACTIONSINARRAY", payload: newReactionArray})
        dispatch({
            type: "ADD_SPLIT_NODES_TO_AUDIT_TRAIL", payload: graphState.abundantCompounds
        })

    }

    const handleAbundantCompoundsSubmit = () => {
        dispatch({type: "SWITCHSHOWABUNDANTNODECONFIG"})
        filterAbundantCompounds()
    }

    const body = (
        <div className={classes.paper}>
            <div style={{display: "grid", gridTemplateColumns: "8fr 2fr"}}>
                <Compound options={autocompleteOptions}/>
                <ToolTipBig title={"Select node for splitting"} placement={"right"}>
                    <button className={"addNode"} disabled={!isRequestValid(graphState.abundantCompound)}
                            onClick={() => dispatch({
                                type: "ADDABUNDANTCOMPOUND",
                                payload: graphState.abundantCompound
                            })}>Add
                    </button>
                </ToolTipBig>
            </div>
            <br/>
            chosen Compounds:
            <ul style={{listStyleType: "none"}}>{graphState.abundantCompounds.map((comp, index) => {
                return (
                    <li key={comp}>
                        <ToolTipBig title={"Unselect node for splitting"} placement={"right"}>
                            <DeleteIcon
                                onClick={() => dispatch({type: "SPLICEABUNDANTCOMPOUNDS", payload: index})}/>
                        </ToolTipBig>
                        {comp}
                    </li>
                )
            })}</ul>
            <div style={{display: "flex", justifyContent: "center"}}>
                <ToolTipBig title={"Submit splitting nodes"} placement={"right"}>
                    <button className={"submitNodes"} onClick={() => handleAbundantCompoundsSubmit()}>Submit</button>
                </ToolTipBig>
            </div>

        </div>
    )


    return (
        <div>
            <Modal style={{width: "60vw", marginLeft: "20vw"}} className={classes.modal}
                   open={graphState.showAbundantNodeConfig}
                   onClose={() => dispatch({type: "SWITCHSHOWABUNDANTNODECONFIG"})}>
                {body}
            </Modal>
        </div>
    )
}

export default AbundantNodeConfig


const Compound = ({options}) => {
    const graphState = useSelector(state => state.graph)
    return (<Field
        // className={"compound"}
        dispatchType={"SETABUNDANTCOMPOUND"}
        id={"Abundantompound"}
        boolean={true}
        dispatchTypeOptions={"SETABUNDANTCOMPOUNDOPTIONS"}
        options={options}
        compound={graphState.abundantCompound}/>)
}

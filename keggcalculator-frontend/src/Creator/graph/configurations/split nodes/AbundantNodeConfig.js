import React from "react";
import {useDispatch, useSelector} from "react-redux";
import Modal from "@material-ui/core/Modal";
import {makeStyles} from "@material-ui/core";
import Field from "../../../specReaction/substrates and products/Field";
import {isRequestValid} from "../../../request/RequestValidation";
import DeleteIcon from "@material-ui/icons/Delete";
import "./AbundantNodeConfig.css"
import {COMPOUND_NODE_COLOR} from "../../Constants"
import {ToolTipBig} from "../../../main/user-interface/UserInterface";

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
    const dispatch = useDispatch()
    const classes = useStyles()

    const filterAbundantCompounds = () => {
        let nodes = []
        let data = {}

        graphState.abundantCompounds.map(comp => {
            nodes = graphState.data.nodes
            let origNodeX = 0
            let origNodeY = 0
            let splitNodeDist = 0

            const origNode = nodes.filter(node => comp === node.id)[0]

            if (origNode) {
                origNodeX = nodes.filter(node => comp === node.id)[0].x
                origNodeY = nodes.filter(node => comp === node.id)[0].y
                splitNodeDist = 40
            }

            const abundantLinks = graphState.data.links.filter(
                link => link.source === comp || link.target === comp)

            let index = 0
            abundantLinks.map(link => {
                // add nodes for non reversed links
                if (!link.isReversibleLink) {
                    if (link.source === comp) {
                        nodes.push({id: `${index}__${link.source}`, color: COMPOUND_NODE_COLOR, opacity: 0.4, x: origNodeX, y: origNodeY+splitNodeDist*index})
                    } else {
                        nodes.push({id: `${index}__${link.target}`, color: COMPOUND_NODE_COLOR, opacity: 0.4, x: origNodeX, y: origNodeY+splitNodeDist*index})
                    }
                }

                // modify links
                if (link.source === comp) {
                    link.source = `${index}__${link.source}`
                    link.opacity = 0.4
                } else {
                    link.target = `${index}__${link.target}`
                    link.opacity = 0.4
                }

                !link.isReversibleLink && index ++
                return null
            })

            data.links = graphState.data.links
            return null;
        })

        data.nodes = nodes.filter(node => !graphState.abundantCompounds.includes(node.id))

        dispatch({type: "SETDATA", payload: data})
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
                <Compound/>
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


const Compound = () => {
    const graphState = useSelector(state => state.graph)
    return (<Field
        // className={"compound"}
        dispatchType={"SETABUNDANTCOMPOUND"}
        id={"Abundantompound"}
        boolean={true}
        dispatchTypeOptions={"SETABUNDANTCOMPOUNDOPTIONS"}
        options={graphState.data.nodes.map(node => node.id)}
        compound={graphState.abundantCompound}/>)
}

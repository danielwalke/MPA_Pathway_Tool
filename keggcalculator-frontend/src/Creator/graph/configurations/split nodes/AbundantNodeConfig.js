import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import Modal from "@material-ui/core/Modal";
import {makeStyles} from "@material-ui/core";
import Field from "../../../specReaction/substrates and products/Field";
import {isRequestValid} from "../../../request/RequestValidation";
import DeleteIcon from "@material-ui/icons/Delete";
import "./AbundantNodeConfig.css"

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
                const abundantLinks = graphState.data.links.filter(link => link.source === comp || link.target === comp)
                abundantLinks.map((link, index) => {
                    console.log(index)
                    if(link.source===comp){
                        nodes.push({id: `${index}__${link.source}`, color: "darkgreen", opacity: 0.4, x:0, y:0})
                    }else{
                        nodes.push({id: `${index}__${link.target}`, color: "darkgreen", opacity: 0.4, x:0, y:0})
                    }
                    return null
                })
                console.log(nodes)
                abundantLinks.map((link, index) => {
                    if(link.source===comp){
                        link.source = `${index}__${link.source}`
                        link.opacity = 0.4
                    }else{
                        link.target = `${index}__${link.target}`
                        link.opacity = 0.4
                    }
                    return null;
                })
                data.links = graphState.data.links
                return null;
            })
            data.nodes = nodes.filter(node => !graphState.abundantCompounds.includes(node.id))
            dispatch({type:"SETDATA", payload: data})

        }

        const handleAbundantCompoundsSubmit = () => {
            dispatch({type: "SWITCHSHOWABUNDANTNODECONFIG"})
            filterAbundantCompounds()
        }

        const body = (
            <div className={classes.paper}>
                <div style={{display:"grid", gridTemplateColumns: "8fr 2fr"}}>
                    <Compound/>
                    <button className={"addNode"} disabled={!isRequestValid(graphState.abundantCompound)}
                            onClick={() => dispatch({type: "ADDABUNDANTCOMPOUND", payload: graphState.abundantCompound})}>Add
                    </button>
                </div>
                <br/>
                chosen Compounds:
                <ul style={{listStyleType: "none"}}>{graphState.abundantCompounds.map((comp, index) => {
                    return (
                        <li key={comp}>
                            <DeleteIcon
                                onClick={() => dispatch({type: "SPLICEABUNDANTCOMPOUNDS", payload: index})}/>{comp}
                        </li>
                    )
                })}</ul>
                <div style={{display:"flex", justifyContent: "center"}}>
                    <button className={"submitNodes"} onClick={() => handleAbundantCompoundsSubmit()}>Submit</button>
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
    console.log(graphState.abundantCompoundOptions)
    return (<Field
        // className={"compound"}
        dispatchType={"SETABUNDANTCOMPOUND"}
        id={"Abundantompound"}
        boolean={true}
        dispatchTypeOptions={"SETABUNDANTCOMPOUNDOPTIONS"}
        options={graphState.data.nodes.map(node => node.id)}
        compound={graphState.abundantCompound}/>)
}
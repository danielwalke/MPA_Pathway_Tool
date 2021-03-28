import Product from "./Product";
import Reaction from "./Reaction";
import React from "react";
import Modal from "@material-ui/core/Modal";

import {makeStyles} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";

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

const NextReactionModal = () => {
    const state = useSelector(state => state.keggReaction)
    const dispatch= useDispatch()
    const classes = useStyles()
    const body = (
        <div className={classes.paper} style={{width:"40vw"}}>
            <Product className={"product"}/>
            <br/>
            <Reaction className={"reaction"}/>
        </div>
    )

    return(
        <Modal className={classes.modal} open={state.showNextReaction}
               onClose={() => dispatch({type: "SWITCHSHOWNEXTREACTION"})}>
            {body}
        </Modal>
    )
}

export default NextReactionModal
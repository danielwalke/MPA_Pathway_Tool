import React from "react";

import {graphReducer} from "../../../Creator/reducers/Graph";
import {Graph} from "react-d3-graph";
import {useDispatch, useSelector} from "react-redux";

import {handleSubmit} from "../../../Creator/keggReaction/substrate and products/SubmitHandler";
import clonedeep from "lodash/cloneDeep"
import Substrate from "../../../Creator/keggReaction/substrate and products/substrate/Substrate";
import Product from "../../../Creator/keggReaction/substrate and products/product/Product";
import Reaction from "../../../Creator/keggReaction/reaction/Reaction";
import Modal from "@material-ui/core/Modal";

import {makeStyles} from "@material-ui/core";

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

function FluxCreate(){
    const classes = useStyles()
    const state = useSelector(state => state.general)
    const dispatch = useDispatch()
    const body=(
        <div className={classes.paper} style={{width:"40vw"}}>
            <div>
                <Substrate className={"substrate"}/>
                <Product className={"product"}/>
                <Reaction className={"reaction"}/>
            </div>
        </div>
    )

    return(
        <Modal className={classes.modal} open={state.showKeggReaction}
               onClose={() => dispatch({type: "SWITCHSHOWKEGGREACTION"})}>
            {body}
        </Modal>

    )
}

export default FluxCreate;
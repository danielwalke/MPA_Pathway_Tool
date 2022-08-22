import CloseIcon from '@material-ui/icons/Close';
import React from "react";
import "./ReactionInfo.css"
import {useDispatch, useSelector} from "react-redux";
import Modal from "@material-ui/core/Modal";
import {makeStyles} from "@material-ui/core";
import ReactionCaption from "./ReactionCaption";
import KoAndEcLists from "./KoAndEcLists";
import HeatMap from "./HeatMap";

const ReactionInfo = () => {
    const dispatch = useDispatch()
    const state = {
        general: useSelector(state => state.general),
        graph: useSelector(state => state.graph),
        keggReaction: useSelector(state => state.keggReaction),
        specificReaction: useSelector(state => state.specificReaction),
        mpaProteins: useSelector(state => state.mpaProteins),
    }

    const handleClose = (event, dispatch) => {
        event.preventDefault()
        dispatch({type: "SETSHOWINFO", payload: false})
    }

    const useStyles = makeStyles((theme) => ({
        modal: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        paper: {
            backgroundColor: theme.palette.background.paper,
            fontFamily: "Arial" ,
            border: '2px solid rgb(150, 25, 130)',
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3),
        }
    }));

    const classes = useStyles()

    const body = (<div className={"infoWrapper"}>
        <button className={"closeInfo"} onClick={(event) => handleClose(event, dispatch)}><CloseIcon/></button>
        <h4 className={"headerInfo"} style={{top: 0, left: 0}}>You clicked on node {state.graph.chosenNode}!</h4>
        <div className={"svgInfo"}>
            <HeatMap/>
        </div>
        <div className={"koAndEcListContainer"}>
            <KoAndEcLists/>
        </div>
        <ReactionCaption className={"captionReaction"}/>
    </div>)
    return (
        <Modal className={classes.modal} open={state.graph.showInfo}
               onClose={() => dispatch({type: "SETSHOWINFO", payload: false})}>
            {body}
        </Modal>

    )
}

export default ReactionInfo

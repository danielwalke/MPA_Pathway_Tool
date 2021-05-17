import Modal from "@material-ui/core/Modal";
import React, {useState} from "react";
import {makeStyles} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {getStructureBody} from "./StuctureModalBody";

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


const StructureModal = () => {
    const generalState = useSelector(state => state.general)
    const state = useSelector(state => state.graph)
    const dispatch = useDispatch()
    const [isNcbiTaxonomy, setIsNcbiTaxonomy] = useState(true)
    let body;
    if(state.doubleClickNode.length>0){
         body = getStructureBody(state,dispatch, generalState,isNcbiTaxonomy, setIsNcbiTaxonomy)
    }

    return (
        <div>
            <Modal style={{width: "90vw", marginLeft: "5vw", maxHeight:"80vh", overflow:"auto", marginTop: "10vh"}} open={state.showStructure}
                   onClose={() => dispatch({type: "SWITCHSHOWSTRUCTURE"})}>

                {body}
            </Modal>
        </div>
    )
}

export default StructureModal
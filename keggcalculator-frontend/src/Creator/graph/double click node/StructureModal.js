import Modal from "@material-ui/core/Modal";
import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getStructureBody} from "./StuctureModalBody";


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
            <Modal style={{width: "70vw", marginLeft: "5vw", maxHeight:"80vh",height:"80vh",  marginTop: "10vh",overflow:"auto"}} open={state.showStructure}
                   onClose={() => dispatch({type: "SWITCHSHOWSTRUCTURE"})}>
                {body}
            </Modal>
        </div>
    )
}

export default StructureModal
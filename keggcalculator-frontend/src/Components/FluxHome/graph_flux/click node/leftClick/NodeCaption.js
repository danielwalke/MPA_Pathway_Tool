import React from "react";
import {useDispatch, useSelector} from "react-redux";
import "./slider.css"

const NodeCaption = (nodeId) =>{
    const dispatch = useDispatch()
    const state = {
        general: useSelector(state => state.general),
        graph: useSelector(state => state.graph),
        keggReaction: useSelector(state => state.keggReaction),
        specificReaction: useSelector(state => state.specificReaction),
        mpaProteins: useSelector(state => state.mpaProteins),
    }
    var caption = state.general.compoundId2Name[nodeId.node]


    return(
        <div className={"caption_container"}>
            {caption}
        </div>
    );
}

export default NodeCaption
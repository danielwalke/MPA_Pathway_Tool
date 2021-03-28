import TextField from "@material-ui/core/TextField";
import {handleAddTaxonomy} from "./SpecReactionFunctions";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import "./SpecTaxonomy.css"
import TaxonomicRank from "../graph/TaxonomicRank";

const SpecTaxonomy = () => {
    const dispatch = useDispatch()
    const generalState = useSelector(state => state.general)
    const specReactionState = useSelector(state => state.specificReaction)
    return (
        <div className={"taxonomyContainer"}>
            <div className={"taxonomicRank"}><TaxonomicRank /></div>
            <TextField
                placeholder={"lowest taxonomic rank"}
                size={"small"}
                className={"taxonomy"}
                label="lowest taxonmic rank"
                variant="outlined"
                id="Tax"
                onChange={(e) => dispatch({
                    type: "SETSPECTAXONOMY",
                    payload: e.target.value.toString()
                })}
            />
            <button className={"addTaxonomy"}
                    onClick={(e) => handleAddTaxonomy(e, dispatch, specReactionState, generalState)}>Add Taxonomy</button>

        </div>
    )

}

export default SpecTaxonomy
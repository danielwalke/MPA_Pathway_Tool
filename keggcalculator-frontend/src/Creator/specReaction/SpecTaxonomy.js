import TextField from "@material-ui/core/TextField";
import {handleAddTaxonomy} from "./SpecReactionFunctions";
import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import "./SpecTaxonomy.css"
import TaxonomicRank from "../graph/TaxonomicRank";
import TaxonomyNcbi from "../Taxonomy/TaxonomyNcbi";


const SpecTaxonomy = () => {
    const dispatch = useDispatch()
    const generalState = useSelector(state => state.general)
    const specReactionState = useSelector(state => state.specificReaction)
    const [isTaxonomyNcbi, setIsTaxonomyNcbi] = useState(true)
    return (
        <div className={"taxonomyContainer"}>
            <div className={"taxonomicRank"}><TaxonomicRank/>
            </div>
            <div className={"switch"}>
                <button className={"downloadButton"} style={{width: "100%"}}
                        onClick={() => setIsTaxonomyNcbi(!isTaxonomyNcbi)}>switch
                </button>
            </div>
            {!isTaxonomyNcbi ? <TextField
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
            /> : <TaxonomyNcbi taxonomy={specReactionState.specTaxonomy} dispatchTaxonomy={"SETSPECTAXONOMY"}/>}

            <button className={"addTaxonomy"}
                    onClick={(e) => handleAddTaxonomy(e, dispatch, specReactionState, generalState)}>Add Taxonomy
            </button>

        </div>
    )

}

export default SpecTaxonomy
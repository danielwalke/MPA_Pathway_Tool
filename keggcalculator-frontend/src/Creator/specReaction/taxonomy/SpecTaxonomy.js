import TextField from "@material-ui/core/TextField";
import {handleAddTaxonomy} from "../functions/SpecReactionFunctions";
import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import "./SpecTaxonomy.css"
import TaxonomicRank from "../../graph/double click node/TaxonomicRank";
import TaxonomyNcbi from "../../taxonomy/TaxonomyNcbi";
import {ToolTipBig} from "../../main/user-interface/UserInterface";


const SpecTaxonomy = () => {
    const dispatch = useDispatch()
    const generalState = useSelector(state => state.general)
    const specReactionState = useSelector(state => state.specificReaction)
    const [isTaxonomyNcbi, setIsTaxonomyNcbi] = useState(true)
    return (
        <div className={"taxonomyContainer"}>
            <div className={"taxonomicRank"}><TaxonomicRank/></div>
            <div className={"switch"}>
                <ToolTipBig
                    title={isTaxonomyNcbi ? "Choose your own taxonomic name" : `Choose taxonomic name from a list`}
                    placement={"right"}>
                    <button className={"download-button"} style={{width: "100%"}}
                            onClick={() => setIsTaxonomyNcbi(!isTaxonomyNcbi)}>switch
                    </button>
                </ToolTipBig>
            </div>
            {!isTaxonomyNcbi ?
                <ToolTipBig title={"Type in a taxonomic name"} placement={"left"}>
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
                    })}/>
                </ToolTipBig> :
                <TaxonomyNcbi taxonomy={specReactionState.specTaxonomy} dispatchTaxonomy={"SETSPECTAXONOMY"}/>}
            <ToolTipBig
                title={"Add taxonomic requirement to the reaction"}
                placement={"right"}>
                <button className={"addTaxonomy"}
                        onClick={(e) => handleAddTaxonomy(e, dispatch, specReactionState, generalState)}>Add Taxonomy
                </button>
            </ToolTipBig>
        </div>
    )

}

export default SpecTaxonomy

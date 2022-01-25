import React, {useEffect, useState} from "react";
import {ToolTipBig} from "../../../main/user-interface/UserInterface";
import TaxonomicRank from "../../double click node/TaxonomicRank";
import TextField from "@material-ui/core/TextField";
import TaxonomyNcbi from "../../../taxonomy/TaxonomyNcbi";
import {useDispatch, useSelector} from "react-redux";
import DeleteIcon from "@material-ui/icons/Delete";

export default function TaxonomySelector(props) {

    const [useNcbiTaxonomy, setUseNcbiTaxonomy] = useState(true)

    const generalState = useSelector(state => state.general)

    const dispatch = useDispatch()

    return(
        <div className={'taxonomy-selector-container'}>
            <div className={'taxonomy-selector-column'}>
                <p className={'taxonomy-selector-label'}>
                    {!props.reaction ? "Pathway Taxonomy" : props.reaction.reactionName}</p>
                <ToolTipBig
                    title={"toggle user defined taxonomy selection or selection from NCBI taxonomies"}
                    placement={"right"}>
                    <button className={"download-button button-centered"}
                            onClick={() => setUseNcbiTaxonomy(!useNcbiTaxonomy)}>
                        {useNcbiTaxonomy ? 'use own Taxonomy' : 'use NCBI Taxonomy'}
                    </button>
                </ToolTipBig>
            </div>

            <div className={'taxonomy-selector-column'}>
                <TaxonomicRank/>
                {!useNcbiTaxonomy ?
                    <UserTaxonomy /> :
                    <TaxonomyNcbi taxonomy={generalState.taxonomy} dispatchTaxonomy={"SETTAXONOMY"}/>
                }

                <ToolTipBig title={"Add taxonomic requirement for the complete pathway"} placement={"right"}>
                    <button className={"download-button button-centered"}
                            onClick={() => {
                                if (!props.reaction) {
                                    dispatch({type: "ADDPATHWAYTAXONOMY"})
                                } else {
                                    dispatch({type: "ADDTAXONOMY", payload: props.reaction.reactionName})
                                }
                            }}>
                        Submit Taxonomy
                    </button>
                </ToolTipBig>
            </div>

            <div className={'taxonomy-selector-column'}>
                <TaxaList taxaList={props.taxaList}/>
            </div>
        </div>
    )
}

function UserTaxonomy() {

    const dispatch = useDispatch()

    return(
        <ToolTipBig title={"Type in a taxonomic name for the chosen rank"} placement={"right"}>
            <TextField
                style={{width: "100%"}}
                placeholder={"lowest taxonomic rank"}
                size={"small"}
                className={"taxonomy"}
                label="user-defined Taxonomy"
                variant="outlined"
                id="Tax"
                onChange={(e) =>
                    dispatch({type: "SETTAXONOMY", payload: e.target.value.toString()})
                }
            />
        </ToolTipBig>
    )
}

function TaxaList(props) {

    const dispatch = useDispatch()

    return(
        <React.Fragment>
            <p className={'taxonomy-selector-label'}>Selected Taxonomies</p>
            <ul style={{listStyleType: 'none'}}>
                {props.taxaList.map((taxon, index) =>
                    <li className={'circle-icon'} key={taxon.concat(index.toString())}>
                        <ToolTipBig title={"Delete taxonomic requirement from complete pathway"} placement={"right"}>
                            <DeleteIcon
                                onClick={() => dispatch({type: "DELETEPATHWAYTAXONOMY", payload: taxon})}
                                style={{transform: "translate(0,4px)"}}/>
                        </ToolTipBig>
                        {taxon}
                    </li>)}
            </ul>
        </React.Fragment>
    )
}


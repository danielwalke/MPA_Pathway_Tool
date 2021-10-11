import Modal from "@material-ui/core/Modal";
import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import TextField from "@material-ui/core/TextField";
import DeleteIcon from "@material-ui/icons/Delete";
import TaxonomicRank from "../../double click node/TaxonomicRank";
import {getTaxaList} from "../../double click node/StuctureModalBody";
import TaxonomyNcbi from "../../../taxonomy/TaxonomyNcbi";
import {makeStyles} from "@material-ui/core";
import {ToolTipBig} from "../../../main/user-interface/UserInterface";

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: "white",
        fontFamily: "Roboto",
        border: '2px solid rgb(150, 25, 130)',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    }
}));

const PathwayTaxonomy = () => {
    const classes = useStyles()
    const graphState = useSelector(state => state.graph)
    const generalState = useSelector(state => state.general)
    const dispatch = useDispatch()
    const graphReactions = graphState.data.nodes.filter(node => node.symbolType === "diamond")
    const graphReactionNames = graphReactions.map(node => node.id)
    const reactions = generalState.reactionsInSelectArray.filter(reaction => graphReactionNames.includes(reaction.reactionName))
    const pathwayTaxonomySet = new Set()
    reactions.map(reaction => getTaxaList(reaction.taxa).map(taxon => pathwayTaxonomySet.add(taxon)))
    const pathwayTaxonomies = Array.from(pathwayTaxonomySet)
    const [isNcbiTaxonomy, setIsNcbiTaxonomy] = useState(true)

    const body = (
        <div className={classes.paper} style={{
            width: "80%",
            maxHeight: "60vh",
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%,-50%)",
            overflow: "auto"
        }}>
            <div style={{
                margin: "2px",
                padding: "3px",
                display: "grid",
                gridTemplateColumns: "3fr 3fr 2fr 2fr",
                gap: "2px",
                border: "2px solid black",
                borderRadius: "2px"
            }}>
                <div>
                    complete pathway
                </div>
                <div>
                    <TaxonomicRank/>
                    {!isNcbiTaxonomy ? <ToolTipBig title={"Type in a taxonomic name for the chosen rank"}
                                                   placement={"right"}><TextField
                            style={{width: "100%"}}
                            placeholder={"lowest taxonomic rank"}
                            size={"small"}
                            className={"taxonomy"}
                            label="taxonomy"
                            variant="outlined"
                            id="Tax"
                            onChange={(e) => dispatch({
                                type: "SETTAXONOMY",
                                payload: e.target.value.toString()
                            })}
                        /></ToolTipBig> :
                        <TaxonomyNcbi taxonomy={generalState.taxonomy} dispatchTaxonomy={"SETTAXONOMY"}/>}
                    <ToolTipBig
                        title={isNcbiTaxonomy ? "Choose your own taxonomic name" : `Choose taxonomic name from a list`}
                        placement={"right"}>
                        <button className={"download-button"} onClick={() => setIsNcbiTaxonomy(!isNcbiTaxonomy)}>Switch
                        </button>
                    </ToolTipBig>
                </div>
                <div>
                    <ToolTipBig title={"Add taxonomic requirement for the complete pathway"} placement={"right"}>
                        <button className={"download-button"} onClick={() => dispatch({type: "ADDPATHWAYTAXONOMY"})}>add
                            taxonomy to complete pathway
                        </button>
                    </ToolTipBig>
                </div>
                <div>
                    <div>chosen Taxonomy:</div>
                    <ul style={{listStyleType: "none"}}>
                        {pathwayTaxonomies.map((taxon, index) => <li key={taxon.concat(index.toString())}>
                            <ToolTipBig title={"Delete taxonomic requirement from complete pathway"}
                                        placement={"right"}>
                                <DeleteIcon
                                    onClick={() => dispatch({type: "DELETEPATHWAYTAXONOMY", payload: taxon})}
                                    style={{transform: "translate(0,4px)"}}/></ToolTipBig>{taxon}</li>)}
                    </ul>
                </div>
            </div>
            {reactions.map(reaction => {
                const reactionName = reaction.reactionName
                return (
                    <div style={{
                        margin: "px",
                        padding: "3px",
                        display: "grid",
                        gridTemplateColumns: "4fr 3fr 2fr 2fr",
                        gap: "2px",
                        border: "2px solid black",
                        borderRadius: "2px"
                    }}>
                        <div>{reactionName}</div>
                        <div>
                            <TaxonomicRank/>
                            {!isNcbiTaxonomy ?
                                <ToolTipBig title={"Type in a taxonomic name for the chosen rank"} placement={"right"}>
                                    <TextField
                                        style={{width: "100%"}}
                                        placeholder={"lowest taxonomic rank"}
                                        size={"small"}
                                        className={"taxonomy"}
                                        label="taxonomy"
                                        variant="outlined"
                                        id="TaxReaction"
                                        onChange={(e) => dispatch({
                                            type: "SETTAXONOMY",
                                            payload: e.target.value.toString()
                                        })}
                                    /></ToolTipBig> :
                                <TaxonomyNcbi taxonomy={generalState.taxonomy} dispatchTaxonomy={"SETTAXONOMY"}/>}
                            <ToolTipBig
                                title={isNcbiTaxonomy ? "Choose your own taxonomic name" : `Choose taxonomic name from a list`}
                                placement={"right"}>
                                <button className={"download-button"}
                                        onClick={() => setIsNcbiTaxonomy(!isNcbiTaxonomy)}>Switch
                                </button>
                            </ToolTipBig>
                        </div>
                        <div>
                            <ToolTipBig title={"Add taxonomic name for the chosen reaction"} placement={"right"}>
                                <button className={"download-button"} style={{width: "20vw"}}
                                        onClick={() => dispatch({type: "ADDTAXONOMY", payload: reactionName})}>Add
                                    taxonomy
                                </button>
                            </ToolTipBig>
                        </div>
                        <div style={{height: "100%", overflow: "auto"}}>
                            <div>chosen Taxonomy:</div>
                            <ul style={{listStyleType: "none"}}>
                                {getTaxaList(reaction.taxa).map((taxon, index) => <li
                                    key={taxon.concat(index.toString())}>
                                    <ToolTipBig title={"Delete taxonomic requirement from chosen reaction"}
                                                placement={"right"}><DeleteIcon
                                        key={taxon.concat(index.toString(), "delete")}
                                        onClick={() => dispatch({
                                            type: "DELETETAXONOMY",
                                            payload: {reactionName, taxon}
                                        })}
                                        style={{transform: "translate(0,4px)"}}/></ToolTipBig>{taxon}</li>)}
                            </ul>
                        </div>

                    </div>
                )

            })}

        </div>
    )

    return (
        <div>
            {/*style={{width: "80vw", overflow: "auto"}}*/}
            <Modal className={classes.modal}
                   open={graphState.showPathwayTaxonomy}
                   onClose={() => dispatch({type: "SWITCHSHOWPATHWAYTAXONOMY"})}>
                {body}
            </Modal>
        </div>
    )
}

export default PathwayTaxonomy

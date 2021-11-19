import React, {useEffect, useState} from "react";
import ReversibilityChange from "./ReversibilityChange";
import {handleSubmitDirection} from "./DirectionsChanger";
import {ToolTipBig} from "../../main/user-interface/UserInterface";
import TaxonomicRank from "./TaxonomicRank";
import {Checkbox, TextField} from "@material-ui/core";
import TaxonomyNcbi from "../../taxonomy/TaxonomyNcbi";
import {getTaxaList} from "./StuctureModalBody";
import DeleteIcon from "@material-ui/icons/Delete";
import {useDispatch, useSelector} from "react-redux";

export default function CreatorGraphReactionDetails({isNcbiTaxonomy, setIsNcbiTaxonomy, nodeId, reaction}) {

    const generalState = useSelector(state => state.general)
    const graphState = useSelector(state => state.graph)
    const dispatch = useDispatch()

    const [checkExchangeReaction, setCheckExchangeReaction] = useState(false)
    const reactionName = reaction.reactionName

    const handleClick = (e) => {
        setCheckExchangeReaction(!checkExchangeReaction)
    }

    useEffect(() => {
        if(reaction.exchangeReaction) {
            setCheckExchangeReaction(reaction.exchangeReaction)
        }
    },[])

    useEffect(() => {
        const reactionArray = generalState.reactionsInSelectArray
        const reactionObj = reactionArray.find(
            reac => reac.reactionId === reaction.reactionId)
        reactionObj.exchangeReaction = checkExchangeReaction
    }, [checkExchangeReaction])

    return(
        <div style={{display: "grid", gridAutoRows: "auto", width: "100%"}}>
            <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10vw"}}>
                <div>
                    <ReversibilityChange nodeId={nodeId}/>
                </div>
                <div>
                    <ToolTipBig title={"Change direction of chosen reaction"} placement={"right"}>
                        <button className={"download-button"} style={{width: "15vw"}}
                                onClick={() => handleSubmitDirection(graphState, dispatch, generalState)}>reverse
                            reaction
                        </button>
                    </ToolTipBig>
                </div>
            </div>

            <div>
                <Checkbox
                checked={checkExchangeReaction}
                onClick={handleClick}
            />
            exchange reaction
            </div>

            <div style={{margin: "2px"}}>
                <TaxonomicRank/>
                <div style={{display: "grid", gridTemplateColumns: "5fr 1fr"}}>
                    <div>{!isNcbiTaxonomy ?
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
                        /> :
                        <TaxonomyNcbi taxonomy={generalState.taxonomy}
                                      dispatchTaxonomy={"SETTAXONOMY"}/>}
                    </div>
                    <div>
                        <ToolTipBig
                            title={isNcbiTaxonomy ? "Choose your own taxonomic name" : `Choose taxonomic name from a list`}
                            placement={"right"}>
                            <button className={"download-button"} style={{height: "100%"}}
                                    onClick={() => setIsNcbiTaxonomy(!isNcbiTaxonomy)}>Switch
                            </button>
                        </ToolTipBig>
                    </div>
                </div>
                <ToolTipBig title={"Add taxonomic requirement to reaction"} placement={"right"}>
                    <button className={"download-button"} style={{width: "20vw"}}
                            onClick={() => dispatch({type: "ADDTAXONOMY", payload: reactionName})}>Add
                        taxonomy
                    </button>
                </ToolTipBig>
            </div>
            <div><p style={{fontWeight: "bold"}}>chosen taxonomic constraints:</p></div>
            <div>
                <ul style={{listStyleType: "none"}}>
                    {getTaxaList(reaction.taxa).map((taxon, index) => <li
                        key={taxon.concat(index.toString())}>
                        <ToolTipBig title={"Delete taxonomic requirement from reaction"} placement={"left"}>
                            <DeleteIcon
                                onClick={() => dispatch({
                                    type: "DELETETAXONOMY",
                                    payload: {reactionName, taxon}
                                })}
                                style={{
                                    transform: "translate(0,4px)",
                                    cursor: "pointer"
                                }}/>
                        </ToolTipBig>{taxon}
                    </li>)}
                </ul>
            </div>
            <div><img style={{maxWidth: "75vw"}} src={`https://www.genome.jp/Fig/reaction/${nodeId}.gif`}
                      alt={graphState.doubleClickNode}/></div>
        </div>
    )
}



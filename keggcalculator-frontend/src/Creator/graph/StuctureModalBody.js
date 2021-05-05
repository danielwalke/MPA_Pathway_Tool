import {handleSubmitDirection} from "./DirectionsChanger";
import React from "react";
import TextField from "@material-ui/core/TextField";
import DeleteIcon from "@material-ui/icons/Delete";
import "./StructureModalBody.css"
import clonedeep from "lodash/cloneDeep";
import TaxonomicRank from "./TaxonomicRank";
import ReversibilityChange from "./ReversibilityChange";

export const getTaxaList = (reactionTaxa) => {
    const taxaList = []
    for (const reactionTaxon in reactionTaxa) {
        if (reactionTaxa.hasOwnProperty(reactionTaxon)) {
            taxaList.push(`${reactionTaxa[reactionTaxon]}:${reactionTaxon}`)
        }
    }
    return taxaList
}

export const getStructureBody = (state, dispatch, generalState) => {
    const compound = typeof state.data.nodes.filter(node => node.id === state.doubleClickNode)[0] === "undefined" ? {} : state.data.nodes.filter(node => node.id === state.doubleClickNode)[0]
    const compoundClone = clonedeep(compound)
    const nodeId = state.doubleClickNode.substring(state.doubleClickNode.length - 6, state.doubleClickNode.length)
    const reaction = nodeId.match(/[R,U]/) ? generalState.reactionsInSelectArray.filter(r => r.reactionName === state.doubleClickNode)[0] : {}
    const reactionName = nodeId.match(/[R,U]/) ? reaction.reactionName : {}

    const body = (<div className={"structureBodyContainer"} style={{backgroundColor: "white", maxWidth: "95vw"}}>
        <div className={"nodeLabel"}>{compound.id}</div>
        <div className={"keyCompoundChoice"}>
            <div>key-Compound?</div>
            <button className={"downloadButton"} style={{width: "5vw"}} onClick={(e) => handleIsKeyCompound(e)}>Yes
            </button>
            <button className={"downloadButton"} style={{width: "5vw"}} onClick={(e) => handleIsNotKeyCompound(e)}>No
            </button>
        </div>
        <div className={"details"}>
            {nodeId.match(/[C]/) &&
            <img src={`https://www.genome.jp/Fig/compound/${nodeId}.gif`} alt={state.doubleClickNode}/>}
            {nodeId.match(/[G]/) &&
            <img src={`https://www.genome.jp/Fig/glycan/${nodeId}.gif`} alt={state.doubleClickNode}/>}
            {nodeId.match(/[R,U]/) && (
                <div>
                    <button className={"downloadButton"} style={{width: "15vw"}}
                            onClick={() => handleSubmitDirection(state, dispatch, generalState)}>revert direction
                    </button>
                    <ReversibilityChange nodeId={nodeId}/>
                    <br/>
                    <div style={{margin:"2px"}}><TaxonomicRank/>
                        <TextField
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
                        />
                        <button className={"downloadButton"} style={{width: "20vw"}}
                                onClick={() => dispatch({type: "ADDTAXONOMY", payload: reactionName})}>Add taxonomy
                        </button></div>

                    <div>chosen Taxonomy:</div>
                    <ul style={{listStyleType: "none"}}>
                        {getTaxaList(reaction.taxa).map((taxon, index) => <li key={taxon.concat(index.toString())}>
                            <DeleteIcon
                                onClick={() => dispatch({type: "DELETETAXONOMY", payload: {reactionName, taxon}})}
                                style={{transform: "translate(0,4px)"}}/>{taxon}</li>)}
                    </ul>
                    <img src={`https://www.genome.jp/Fig/reaction/${nodeId}.gif`}
                         alt={state.doubleClickNode}/>
                </div>
            )}
        </div>
    </div>)

    const handleIsKeyCompound = (e) => {
        e.preventDefault()
        const otherNodes = state.data.nodes.filter(node => node.id !== compound.id)
        compound.opacity = 1
        otherNodes.push(compound)
        const compoundIsTarget = state.data.links.filter(link => link.target === compound.id)
        compoundIsTarget.map(link => link.opacity = 1)
        const compoundIsSource = state.data.links.filter(link => link.source === compound.id)
        compoundIsSource.map(link => link.opacity = 1)
        const otherLinks = state.data.links.filter(link => (link.source !== compound.id && link.target !== compound.id))
        compoundIsTarget.map(link => otherLinks.push(link))
        compoundIsSource.map(link => otherLinks.push(link))
        const data = {nodes: otherNodes, links: otherLinks}
        dispatch({type: "SETDATA", payload: data})
    }

    const handleIsNotKeyCompound = (e) => {
        e.preventDefault()
        const otherNodes = state.data.nodes.filter(node => node.id !== compound.id)
        const compoundIsTarget = state.data.links.filter(link => link.target === compound.id)
        compoundIsTarget.map(link => link.opacity = 0.4)
        const compoundIsSource = state.data.links.filter(link => link.source === compound.id)
        compoundIsSource.map(link => link.opacity = 0.4)
        const otherLinks = state.data.links.filter(link => (link.source !== compound.id && link.target !== compound.id))
        compoundIsTarget.map(link => otherLinks.push(link))
        compoundIsSource.map(link => otherLinks.push(link))
        compound.opacity = 0.4
        otherNodes.push(compound)
        const data = {nodes: otherNodes, links: otherLinks}
        dispatch({type: "SETDATA", payload: data})
    }
    return body;
}
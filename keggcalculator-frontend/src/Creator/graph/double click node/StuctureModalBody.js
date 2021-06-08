import {handleSubmitDirection} from "./DirectionsChanger";
import React from "react";
import TextField from "@material-ui/core/TextField";
import DeleteIcon from "@material-ui/icons/Delete";
import "./StructureModalBody.css"
import TaxonomicRank from "./TaxonomicRank";
import ReversibilityChange from "./ReversibilityChange";
import TaxonomyNcbi from "../../taxonomy/TaxonomyNcbi";
import KeyCompoundChanger from "./KeyCompoundChanger";

export const getTaxaList = (reactionTaxa) => {
    const taxaList = []
    for (const reactionTaxon in reactionTaxa) {
        if (reactionTaxa.hasOwnProperty(reactionTaxon)) {
            taxaList.push(`${reactionTaxa[reactionTaxon]}:${reactionTaxon}`)
        }
    }
    return taxaList
}

export const getStructureBody = (state, dispatch, generalState, isNcbiTaxonomy, setIsNcbiTaxonomy) => {
    const compound = typeof state.data.nodes.filter(node => node.id === state.doubleClickNode)[0] === "undefined" ? {} : state.data.nodes.filter(node => node.id === state.doubleClickNode)[0]
    const nodeId = state.doubleClickNode.substring(state.doubleClickNode.length - 6, state.doubleClickNode.length)
    const reaction = nodeId.match(/[R,U]/) ? generalState.reactionsInSelectArray.filter(r => r.reactionName === state.doubleClickNode)[0] : {}
    const reactionName = nodeId.match(/[R,U]/) ? reaction.reactionName : {}

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

    const body = (<div className={"structureBodyContainer"} style={{backgroundColor: "white", width:"75vw",overflow:"auto", maxHeight:"80vh",height:"80vh"}}>
        <div className={"nodeLabel"}><h3 style={{padding: "2px"}}>ID: {compound.id}</h3></div>
        <div className={"keyCompoundChoice"}>
            <KeyCompoundChanger compound={compound} handleIsNotKeyCompound={handleIsNotKeyCompound}
                                handleIsKeyCompound={handleIsKeyCompound}/>
        </div>
        <div className={"details"}>
            {nodeId.match(/[C]/) &&
            <img style={{maxWidth:"75vw"}} src={`https://www.genome.jp/Fig/compound/${nodeId}.gif`} alt={state.doubleClickNode}/>}
            {nodeId.match(/[G]/) &&
            <img style={{maxWidth:"75vw"}} src={`https://www.genome.jp/Fig/glycan/${nodeId}.gif`} alt={state.doubleClickNode}/>}
            {nodeId.match(/[R,U]/) && (
                <div style={{display: "grid", gridAutoRows: "auto"}}>
                    <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10vw"}}>
                        <div><ReversibilityChange nodeId={nodeId}/></div>
                        <div>
                            <button className={"downloadButton"} style={{width: "15vw"}}
                                    onClick={() => handleSubmitDirection(state, dispatch, generalState)}>reverse
                                reaction
                            </button>
                        </div>
                    </div>
                    <div style={{margin: "2px"}}><TaxonomicRank/>
                        <div style={{display:"grid", gridTemplateColumns:"5fr 1fr"}}>
                            <div>{!isNcbiTaxonomy ? <TextField
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
                                <TaxonomyNcbi taxonomy={generalState.taxonomy} dispatchTaxonomy={"SETTAXONOMY"}/>}</div>
                            <div>
                                <button className={"downloadButton"} style={{height:"100%"}}
                                        onClick={() => setIsNcbiTaxonomy(!isNcbiTaxonomy)}>Switch
                                </button>
                            </div>
                        </div>
                        <button className={"downloadButton"} style={{width: "20vw"}}
                                onClick={() => dispatch({type: "ADDTAXONOMY", payload: reactionName})}>Add taxonomy
                        </button>
                    </div>
                    <div><p style={{fontWeight:"bold"}}>chosen taxonomic constraints:</p></div>
                    <div>
                        <ul style={{listStyleType: "none"}}>
                            {getTaxaList(reaction.taxa).map((taxon, index) => <li key={taxon.concat(index.toString())}>
                                <DeleteIcon
                                    onClick={() => dispatch({type: "DELETETAXONOMY", payload: {reactionName, taxon}})}
                                    style={{transform: "translate(0,4px)"}}/>{taxon}</li>)}
                        </ul>
                    </div>
                    <div><img style={{maxWidth:"75vw"}} src={`https://www.genome.jp/Fig/reaction/${nodeId}.gif`}
                              alt={state.doubleClickNode}/></div>
                </div>
            )}
        </div>
    </div>)


    return body;
}
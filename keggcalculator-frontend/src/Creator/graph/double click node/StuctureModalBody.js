import React from "react";
import "./StructureModalBody.css"
import KeyCompoundChanger from "./KeyCompoundChanger";
import {NOT_KEY_COMPOUND_OPACITY} from "../Constants";
import LabelPositionChanger from "./LabelPositionChanger";
import CreatorGraphReactionDetails from "./CreatorGraphReactionDetails";
import CreatorGraphComponentCompartment from "./CreatorGraphComponentCompartment";
import {updateCompoundInAdjacentReactions} from "../click node/leftClick/AddExchangeReaction";

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
    const compound = !state.data.nodes.filter(node => node.id === state.doubleClickNode)[0] ?
        {} : state.data.nodes.filter(node => node.id === state.doubleClickNode)[0]

    const nodeId = state.doubleClickNode.substring(state.doubleClickNode.length - 6, state.doubleClickNode.length)
    const reaction = nodeId.match(/[R,U]/) ?
        generalState.reactionsInSelectArray.filter(r => r.reactionName === state.doubleClickNode)[0] : {}

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

        updateReactionArray(compound.opacity)

        dispatch({type: "SETDATA", payload: data})
    }

    const handleIsNotKeyCompound = (e) => {
        e.preventDefault()
        const otherNodes = state.data.nodes.filter(node => node.id !== compound.id)
        const compoundIsTarget = state.data.links.filter(link => link.target === compound.id)
        compoundIsTarget.map(link => link.opacity = NOT_KEY_COMPOUND_OPACITY)
        const compoundIsSource = state.data.links.filter(link => link.source === compound.id)
        compoundIsSource.map(link => link.opacity = NOT_KEY_COMPOUND_OPACITY)
        const otherLinks = state.data.links.filter(link => (link.source !== compound.id && link.target !== compound.id))
        compoundIsTarget.map(link => otherLinks.push(link))
        compoundIsSource.map(link => otherLinks.push(link))
        compound.opacity = NOT_KEY_COMPOUND_OPACITY
        otherNodes.push(compound)
        const data = {nodes: otherNodes, links: otherLinks}

        updateReactionArray(NOT_KEY_COMPOUND_OPACITY)

        dispatch({type: "SETDATA", payload: data})
    }

    const updateReactionArray = (opacityValue) => {
        const newReactionsInSelectArray = updateCompoundInAdjacentReactions(compound.id, state, generalState, "opacity", opacityValue)
        dispatch({type: 'SETREACTIONSINARRAY', payload: newReactionsInSelectArray})
    }

    const body = (
        <div className={"structureBodyContainer"}>
            <div >
                <h3 style={{padding: "2px"}}>
                    ID: {compound.id}
                </h3>
            </div>

            <div style={{width: "100%"}}>
                <KeyCompoundChanger compound={compound}
                                    handleIsNotKeyCompound={handleIsNotKeyCompound}
                                    handleIsKeyCompound={handleIsKeyCompound}/>
                <LabelPositionChanger compound={compound}/>
            </div>

            <div style={{width: "100%"}}>
                {nodeId.match(/[C]/) &&
                    <div>
                        <CreatorGraphComponentCompartment compoundId={state.doubleClickNode}/>
                        <img style={{maxWidth: "75vw"}} src={`https://www.genome.jp/Fig/compound/${nodeId}.gif`}
                             alt={state.doubleClickNode}/>
                    </div>
                }

                {nodeId.match(/[G]/) &&
                    <div>
                        <CreatorGraphComponentCompartment compoundId={state.doubleClickNode}/>
                        <img style={{maxWidth: "75vw"}} src={`https://www.genome.jp/Fig/glycan/${nodeId}.gif`}
                             alt={state.doubleClickNode}/>
                    </div>
                }

                {nodeId.match(/[R,U]/) &&
                <CreatorGraphReactionDetails
                    isNcbiTaxonomy={isNcbiTaxonomy} setIsNcbiTaxonomy={setIsNcbiTaxonomy} nodeId={nodeId}
                    reaction={reaction}/>}
            </div>
        </div>
    )


    return body;
}

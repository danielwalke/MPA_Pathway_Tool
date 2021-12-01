import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getKeggId} from "../../../../Flux Analysis/services/CreateFbaGraphData";
import {checkAndGenerateNewReactionId} from "../../../specReaction/functions/SpecReactionFunctions";
import {handleJSONGraphUpload} from "../../../upload/json upload/ModuleUploadFunctionsJSON";
import "../../../download/DownloadGraph.css"
import {handleSubmitKeggReaction} from "../../../keggReaction/substrate and products/substrate/SubmitHandling";

export function removeSplitIndex(nodeId) {
    /**
     * Splits nodeId at "__" and returns the original node name
     */
    const splitArray = nodeId.includes("__") ? nodeId.split("__") : [nodeId]
    return splitArray[splitArray.length-1]
}

export function findRandomCompoundObj(compoundNodeId, graphState, generalState) {
    /**
     * Randomly fetches a compoundObj from reactionsInSelectArray, to extract information like biggId and abbreviation
     */

    const link = graphState.data.links.find(
        link => link.source === compoundNodeId || link.target === compoundNodeId)
    const reactionNodeId = link.source === compoundNodeId ? link.target : link.source
    const reactionObj = generalState.reactionsInSelectArray.find(
        reaction => reaction.reactionId === getKeggId(reactionNodeId))

    return [...reactionObj.substrates, ...reactionObj.products].find(
        compound => removeSplitIndex(compound.name) === removeSplitIndex(compoundNodeId))
}

export default function AddExchangeReaction() {

    const dispatch = useDispatch()

    const keggState = useSelector(state => state.keggReaction)
    const generalState = useSelector(state => state.general)
    const graphState = useSelector(state => state.graph)
    const [substrateName, setSubstrateName] = useState("")
    const [compoundObj, setCompoundObj] = useState({})
    const [compoundObjForReaction, setCompoundObjForReaction] = useState({})
    const [hasExchangeReaction, setHasExchangeReaction] = useState(false)

    useEffect(() => {
        // get selected node Id
        if (keggState.substrate) setSubstrateName(keggState.substrate)
    },[keggState.substrate])

    useEffect(() => {
        // retrieve the compound data object from the array of reactions and write a new compound Obj for exchange reaction
        if (substrateName) {
            const substrateNode = graphState.data.nodes.find(node => node.id === substrateName)

            if (substrateNode) {
                const compoundObj = findRandomCompoundObj(substrateName, graphState, generalState)
                setCompoundObj(compoundObj)
                console.log(compoundObj)

                const substrateObj = {
                    abbreviation: compoundObj.abbreviation,
                    name: compoundObj.name,
                    opacity: 1,
                    stoichiometry: 1,
                    x: (substrateNode.x).toString(),
                    y: (substrateNode.y).toString()
                }
                setCompoundObjForReaction(substrateObj)
            }
        }
    },[substrateName])

    useEffect(() => {
        // check if an exchange reaction exists for this compound (for button enabling)
        if (compoundObj.hasOwnProperty("name")) {
            for (const reaction of generalState.reactionsInSelectArray) {
                if (reaction.exchangeReaction) {
                    const exchangeCompound = reaction.substrates[0]
                    const compoundId = getKeggId(compoundObj.name)

                    if (exchangeCompound && exchangeCompound.name.endsWith(compoundId)) {
                        setHasExchangeReaction(true)
                        break;
                    }
                }
            }
        }

    },[compoundObj, generalState.reactionsInSelectArray.length])

    const addExchangeReaction = () => {
        const compoundId = getKeggId(substrateName)
        const reactionId = checkAndGenerateNewReactionId(generalState.reactionsInSelectArray)
        const x = String(parseInt(compoundObjForReaction.x) + 4)
        const y = compoundObjForReaction.y
        const exchangeReaction = {
            lowerBound: -1000.0,
            upperBound: 1000.0,
            abbreviation: "EX_" + compoundId,
            ecNumbersString: [],
            isForwardReaction: true,
            koNumbersString: [],
            opacity: 1,
            products: [],
            reactionId: reactionId,
            reactionName: "Exchange " + reactionId,
            reversible: true,
            stochiometryProductsString: {},
            stochiometrySubstratesString: {},
            substrates: [compoundObjForReaction],
            taxa: [],
            x: x.toString(),
            y: y.toString(),
            exchangeReaction: true
        }

        exchangeReaction.stochiometryProductsString[compoundId] = 1

        const state = {
            graphState: graphState,
            keggState: keggState,
            generalState: generalState
        }

        handleSubmitKeggReaction(state, dispatch, exchangeReaction)
    }

    return(
        <div style={{display: "flex", justifyContent: "center"}}>
            <button
                className={"download-button button-7rem"}
                style={{height: "2.5rem"}}
                disabled={!compoundObjForReaction.hasOwnProperty("name") ||
                !compoundObj.hasOwnProperty("name") || hasExchangeReaction}
                onClick={() => {addExchangeReaction()}}>
                Add Exchange Reaction
            </button>
        </div>
    )
}

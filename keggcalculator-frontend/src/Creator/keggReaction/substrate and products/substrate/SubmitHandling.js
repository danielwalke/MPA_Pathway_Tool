import {handleJSONGraphUpload} from "../../../upload/json upload/ModuleUploadFunctionsJSON";
import {NOT_KEY_COMPOUND_OPACITY} from "../../../graph/Constants";

const setCoordinatesFromGraphData = (compoundArr, graphNodes) => {
    compoundArr.forEach(compound => {
        const compoundNode = graphNodes.find(node => node.id === compound.name)
        compound.x = compoundNode ? compoundNode.x : 0.0
        compound.y = compoundNode ? compoundNode.y : 0.0
    })
}

export const handleSubmitKeggReaction = (state, dispatch, reaction) => {
    // refresh positions of reactions in reactionsInSelectArray
    const addedReaction = reaction ? reaction : getJSONReaction(state)

    const nodes = state.graphState.data.nodes
    const reactionsInSelectArrayWithCoordinates = [...state.generalState.reactionsInSelectArray, addedReaction].map(
        reaction => {
            const reactionNode = nodes.find(node => node.id === reaction.reactionName)
            if (!reaction.exchangeReaction) {
                reaction.x = reactionNode ? reactionNode.x : 0.0
                reaction.y = reactionNode ? reactionNode.y : 0.0
            }

            setCoordinatesFromGraphData(reaction.substrates, nodes)
            setCoordinatesFromGraphData(reaction.products, nodes)

            return reaction
        }
    )
    const data = handleJSONGraphUpload(reactionsInSelectArrayWithCoordinates, dispatch, state.graphState)
    dispatch({type: "ADDREACTIONSTOARRAY", payload: reactionsInSelectArrayWithCoordinates})
    dispatch({type: "ADD_REACTION_TO_AUDIT_TRAIL", payload: addedReaction})
    dispatch({type: "SETDATA", payload: data})
}

const getKEGGID = (string) => string.substring(string.length - 6, string.length)

const getJSONReaction = (state) => {
    const reactionArray = state.keggState.reactions
    // transforms everything to kegg ids
    state.keggState.reaction = getKEGGID(state.keggState.reaction)
    state.keggState.substrate = getKEGGID(state.keggState.substrate)
    state.keggState.product = getKEGGID(state.keggState.product)
    // searches for reaction in reaction array
    const reaction = getReaction(state.keggState.reaction, reactionArray)
    const substrateId = state.keggState.substrate

    console.log(reaction)

    reaction.substrates = isSubstrateIdInStochiometrySubstrates(reaction, substrateId) ?
        getCompounds(reaction.stochiometrySubstratesString, state.generalState.compoundId2Name, state)
        : getCompounds(reaction.stochiometryProductsString, state.generalState.compoundId2Name, state)
    reaction.products = isSubstrateIdInStochiometrySubstrates(reaction, substrateId) ?
        getCompounds(reaction.stochiometryProductsString, state.generalState.compoundId2Name, state)
        : getCompounds(reaction.stochiometrySubstratesString, state.generalState.compoundId2Name, state)
    reaction.reversible = false
    reaction.opacity = 1
    reaction.x = 0
    reaction.y = 0
    console.log(reaction)
    return reaction
}

const isSubstrateIdInStochiometrySubstrates = (reaction, substrateId) => Object.keys(reaction.stochiometrySubstratesString).includes(substrateId)

const getReaction = (reactionID, reactionArray) => reactionArray.find(reaction => reaction.reactionId === reactionID)

const getCompoundName = (compoundUId, compoundIdToName) => compoundIdToName[compoundUId]

const getCompounds = (stoichiometryCompounds, compoundIdToName, state) => {
    const compounds = []
    addCompounds(compounds, stoichiometryCompounds, compoundIdToName, state)
    return compounds
}

const addCompounds = (compounds, stoichiometryCompounds, compoundIdToName, state) => {
    for (const compoundId of Object.keys(stoichiometryCompounds)) {
        const stoichiometry = stoichiometryCompounds[compoundId]
        const compound = {}
        compound.x = 0
        compound.y = 0
        compound.name = getCompoundName(compoundId, compoundIdToName)
        compound.opacity = getOpacity(state, compoundId)
        compound.abbreviation = getCompoundName(compoundId, compoundIdToName)
        compound.stoichiometry = stoichiometry
        compounds.push(compound)
    }
}

const getOpacity = (state, compoundId) => {
    return (state.keggState.substrate === compoundId || state.keggState.product === compoundId) ? 1 : NOT_KEY_COMPOUND_OPACITY
}

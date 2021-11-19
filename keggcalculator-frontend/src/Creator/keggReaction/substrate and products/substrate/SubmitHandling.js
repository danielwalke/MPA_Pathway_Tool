import {handleJSONGraphUpload} from "../../../upload/json upload/ModuleUploadFunctionsJSON";
import {NOT_KEY_COMPOUND_OPACITY} from "../../../graph/Constants";

export const handleSubmitKeggReaction = (state, dispatch) => {
    const data = handleJSONGraphUpload([...state.generalState.keggReactions, getJSONReaction(state)], dispatch, state.graphState)
    console.log(data.nodes.filter(node => node.symbolType !== "circle"))
    dispatch({type: "ADD_REACTION_TO_AUDIT_TRAIL", payload: getJSONReaction(state)})
    dispatch({type: "SETDATA", payload: data})
}

const getKEGGID = (string) => string.substring(string.length - 6, string.length)

const getJSONReaction = (state) => {
    const reactionArray = state.generalState.reactionsInSelectArray
    // transforms everything to kegg ids
    state.keggState.reaction = getKEGGID(state.keggState.reaction)
    state.keggState.substrate = getKEGGID(state.keggState.substrate)
    state.keggState.product = getKEGGID(state.keggState.product)
    // searches for reaction in reaction array
    const reaction = getReaction(state.keggState.reaction, reactionArray)
    const substrateId = state.keggState.substrate

    reaction.substrates = isSubstrateIdInStochiometrySubstrates(reaction, substrateId) ? getCompounds(reaction.stochiometrySubstratesString, state.generalState.compoundId2Name, state)
        : getCompounds(reaction.stochiometryProductsString, state.generalState.compoundId2Name, state)
    reaction.products = isSubstrateIdInStochiometrySubstrates(reaction, substrateId) ? getCompounds(reaction.stochiometryProductsString, state.generalState.compoundId2Name, state)
        : getCompounds(reaction.stochiometrySubstratesString, state.generalState.compoundId2Name, state)
    reaction.reversible = false
    reaction.opacity = 1
    reaction.x = 0
    reaction.y = 0
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

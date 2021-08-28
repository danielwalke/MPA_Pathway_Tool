import {getStochiometryProductsString, getStochiometrySubstratesString} from "../functions/SpecReactionFunctions";
import {getLengthMinusNFirstChars, getNLastChars} from "../../usefulFunctions/Strings";
import {handleJSONGraphUpload} from "../../upload/json upload/ModuleUploadFunctionsJSON";
import {NOT_KEY_COMPOUND_OPACITY} from "../../graph/Constants";

const addReactionDetails = (reaction, specReactionStates) => {
    const reactionName = specReactionStates.specReaction
    reaction.reactionId = getNLastChars(reactionName, 6)
    reaction.reactionName = reactionName
    reaction.koNumbersString = specReactionStates.specKoNumbers
    reaction.ecNumbersString = specReactionStates.ecNumbers
    reaction.stochiometrySubstratesString = getStochiometrySubstratesString(specReactionStates)
    reaction.stochiometryProductsString = getStochiometryProductsString(specReactionStates)
    reaction.taxa = specReactionStates.specTaxonomies
    reaction.isForwardReaction = true
    reaction.reversible = false
    reaction.opacity = 1
    reaction.x = 0
    reaction.y = 0
    reaction.abbreviation = getLengthMinusNFirstChars(reactionName, 6)
    reaction.substrates = getSubstrates(specReactionStates.specSubstrates,getStochiometrySubstratesString(specReactionStates))
    reaction.products = getSubstrates(specReactionStates.specProducts,getStochiometryProductsString(specReactionStates))
}

const getSubstrates = (compounds, stoichiometryCompoundsObject) =>{
    return compounds.map((compound, index) =>{
        return(
            {
                x:0,
                y:0,
                name: compound,
                abbreviation: getLengthMinusNFirstChars(compound, 6),
                opacity: index===0? 1:NOT_KEY_COMPOUND_OPACITY,
                stochiometry:stoichiometryCompoundsObject[getNLastChars(compound,6)]
            }
        )
    })
}

export const handleSpecSubmit = (e, graphStates, specReactionStates, dispatch, generalState) => {
    e.preventDefault();
    const reaction = {}
    addReactionDetails(reaction, specReactionStates)
    const data = handleJSONGraphUpload([...generalState.keggReactions, reaction],dispatch, graphStates)
    dispatch({type:"ADD_USER_REACTION_TO_AUDIT_TRAIL", payload: reaction})
    dispatch({type:"SETDATA", payload: data})
    dispatch({type:"ADDREACTIONSTOARRAY",payload:[reaction]})
    dispatch({type: "RESETSPECIFICREACTION"})
}

import {getStochiometryProductsString, getStochiometrySubstratesString} from "../functions/SpecReactionFunctions";

export const handleSpecSubmit = (e, graphStates, specReactionStates, dispatch) => {
    e.preventDefault();
    const data = graphStates.data;
    const reaction = specReactionStates.specReaction
    data.nodes.push({id: reaction, symbolType: "diamond", color: "black", opacity: 1, x: 0, y: 0})
    for (let i = 0; i < specReactionStates.specSubstrates.length; i++) {
        const subst = specReactionStates.specSubstrates[i]
        if (i === 0) {
            data.nodes.push({id: subst, color: "darkgreen", opacity: 1, x: 0, y: 0})
            data.links.push({source: subst, target: reaction, opacity: 1,isReversibleLink: false })
        } else {
            data.nodes.push({id: subst, color: "darkgreen", opacity: 0.4, x: 0, y: 0})
            data.links.push({source: subst, target: reaction, opacity: 0.4,isReversibleLink: false})
        }
    }
    for (let i = 0; i < specReactionStates.specProducts.length; i++) {
        const prod = specReactionStates.specProducts[i]
        if (i === 0) {
            data.nodes.push({id: prod, color: "darkgreen", opacity: 1, x: 0, y: 0})
            data.links.push({source: reaction, target: prod, opacity: 1,isReversibleLink: false})
        } else {
            data.nodes.push({id: prod, color: "darkgreen", opacity: 0.4, x: 0, y: 0})
            data.links.push({source: reaction, target: prod, opacity: 0.4,isReversibleLink: false})
        }
    }
    // specReactionStates.specTaxonomies = specReactionStates.specTaxonomies.length === 0 ? [""] : specReactionStates.specTaxonomies
    dispatch({type: "SETDATA", payload: data})
    dispatch({type: "RESETSPECIFICREACTION"})
    dispatch({
        type: "ADDREACTIONSTOARRAY",
        payload: [{
            reactionId: reaction.substring(reaction.length - 6, reaction.length),
            reactionName: reaction,
            koNumbersString: specReactionStates.specKoNumbers,
            ecNumbersString: specReactionStates.ecNumbers,
            stochiometrySubstratesString: getStochiometrySubstratesString(specReactionStates),
            stochiometryProductsString: getStochiometryProductsString(specReactionStates),
            taxa: specReactionStates.specTaxonomies,
            isForwardReaction: true
        }]
    })
}
import {requestGenerator} from "../../request/RequestGenerator";
import clonedeep from "lodash/cloneDeep"
import {handleSubmitKeggReaction} from "./substrate/SubmitHandling";
const productUrl = "http://127.0.0.1/keggcreator/reactiondatabysubstrate"

const getReverseReaction = (reactions) =>{
    reactions.forEach(reaction => {
        const stoichiometryProductsClone = clonedeep(reaction.stochiometryProductsString)
        const stoichiometrySubstratesClone = clonedeep(reaction.stochiometrySubstratesString)
        reaction.stochiometrySubstratesString = stoichiometryProductsClone
        reaction.stochiometryProductsString = stoichiometrySubstratesClone
    })
    return reactions
}

export const handleSubmit = (substrateId) => {
    //handle requests
    const requestPromise = requestGenerator("POST", productUrl, {substrateId: substrateId}, "", "")
        .then(response => {
            const productList = []
            const prodReactionsMap = new Map();
            response.data.productSortedReactionsRev.forEach(object => {
                const reverseReactions = getReverseReaction(object.reactions)
                prodReactionsMap.set(object.product.compoundId, reverseReactions)
                productList.push(object.product)
            })
            response.data.productSortedReactions.forEach(object => {
                prodReactionsMap.set(object.product.compoundId, object.reactions)
                productList.push(object.product)
            })
            return (
                {productList, prodReactionsMap}
            )
        })
    return (
        requestPromise
    )
}

export const handleSubmitProduct = (productId, keggState) => {
    const productReactionsMap = keggState.productReactionMap
    const reactionList = []
    for (const [key, values] of productReactionsMap.entries()) {
        if (productId === key) {
            values.map(value => {
                if(value.taxonomies.length===0){
                    value.taxonomies = [""]
                }
                value.isForwardReaction = true
                value.reactionName = value.reactionName.concat(" " + value.reactionId)
                reactionList.push(value)
                return null
            })
        }
    }
    return (reactionList)
}


export const handleSubmitReaction = (state, dispatch) => {
    handleSubmitKeggReaction(state, dispatch)
}
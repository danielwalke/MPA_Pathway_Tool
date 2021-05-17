import {requestGenerator} from "../../request/RequestGenerator";
const productUrl = "http://127.0.0.1/keggcreator/reactiondatabysubstrate"

export const handleSubmit = (substrateId, graphState, keggState, dispatch) => {
    //handle requests
    const requestPromise = requestGenerator("POST", productUrl, {substrateId: substrateId}, "", "")
        .then(response => {
            const productList = []
            const prodReactionsMap = new Map();
            response.data.productSortedReactionsRev.map(object => {
                prodReactionsMap.set(object.product.compoundId, object.reactions)
                productList.push(object.product)
                return null
            })
            response.data.productSortedReactions.map(object => {
                prodReactionsMap.set(object.product.compoundId, object.reactions)
                productList.push(object.product)
                return null
            })
            return (
                {productList, prodReactionsMap}
            )
        })
    //graph
    let newData = {
            nodes: [...graphState.data.nodes, {id: keggState.substrate, color: "darkgreen",opacity:1, x: 0,y:0}],
            links: graphState.data.links
        }


    dispatch({type: "SETDATA", payload: newData})

    return (
        requestPromise
    )
}

export const handleSubmitProduct = (productId, graphState, keggState, dispatch) => {
    const productReactionsMap = keggState.productReactionMap
    //graph

    let newData = {
        nodes: [...graphState.data.nodes, {id: keggState.product, color: "darkgreen",opacity:1, x: 0,y:0}],
        links: graphState.data.links
    }
    dispatch({type: "SETDATA", payload: newData})

    //get reactions for chosen product
    const reactionList = []
    for (const [key, values] of productReactionsMap.entries()) {
        if (productId === key) {
            values.map(value => {
                if(value.taxonomies.length===0){
                    value.taxonomies = [""]
                }
                value.reactionName = value.reactionName.concat(" " + value.reactionId)
                reactionList.push(value)
                return null
            })
        }
    }
    return (reactionList)
}

const handleSideCompounds = (state, dispatch, substrateLink, productLink) => {
    //id and stochiometric coeff
    const sideNodes = []
    const sideLinks = []
    const reactionId = substrateLink.target.substring(substrateLink.target.length - 6, substrateLink.target.length)
    const mainSubstrateId = substrateLink.source.substring(substrateLink.source.length - 6, substrateLink.source.length)
    const mainProductId = productLink.target.substring(productLink.target.length - 6, productLink.target.length)
    const chosenReaction = state.generalState.reactionsInSelectArray.filter(reaction => reaction.reactionId === reactionId)[0]
    const substrateIdScs = chosenReaction.stochiometrySubstratesString
    const productIdScs = chosenReaction.stochiometryProductsString
    const substrateIds = Object.keys(substrateIdScs)
    const productIds = Object.keys(productIdScs)
    if (substrateIds.includes(mainSubstrateId)) {     //if substrate list contains substrate => true substrate otherwise reactions is reversed
        const sideSubstrateIds = substrateIds.filter(id => id !== mainSubstrateId) //removes exisiting main node id
        const sideProductIds = productIds.filter(id => id !== mainProductId)
        for (let key of state.generalState.compMap.keys()) { //keys are compound with compound id -> "Compound CXXXXX"
            if (sideSubstrateIds.includes(key.substring(key.length - 6, key.length))) { //find compounds for sideSubstrateIds
                sideNodes.push({id: key, color: "darkgreen", opacity: 0.4, x: 0,y:0}) //push side compounds as nodes
                sideLinks.push({source: key, target: substrateLink.target,opacity: 0.4,isReversibleLink: false}) //push link with: side compound as source and reaction as target
            }
            if (sideProductIds.includes(key.substring(key.length - 6, key.length))) {
                sideNodes.push({id: key, color: "darkgreen", opacity: 0.4, x: 0,y:0}) //push side compounds as nodes
                sideLinks.push({source: substrateLink.target, target: key,opacity: 0.4,isReversibleLink: false}) //push link with: reaction as source and side compound as target
            }
        }
    } else {
        const sideProductIds = substrateIds.filter(id => id !== mainProductId)
        const sideSubstrateIds = productIds.filter(id => id !== mainSubstrateId)
        for (let key of state.generalState.compMap.keys()) {
            if (sideProductIds.includes(key.substring(key.length - 6, key.length))) {
                sideNodes.push({id: key, color: "darkgreen", opacity: 0.4, x: 0,y:0}) //push side compounds as nodes
                sideLinks.push({source: substrateLink.target, target: key,opacity: 0.4, isEssential: true,isReversibleLink: false}) //push link with: reaction as source and side compound as target
            }
            if (sideSubstrateIds.includes(key.substring(key.length - 6, key.length))) {
                sideNodes.push({id: key, color: "darkgreen", opacity: 0.4, x: 0,y:0}) //push side compounds as nodes
                sideLinks.push({source: key, target: substrateLink.target,opacity: 0.4, isEssential: true,isReversibleLink: false})
            }
        }
    }
    return {sideNodes, sideLinks}
}

export const handleSubmitReaction = (state, dispatch) => {
    const reactionLinkSubstrate = {
        source: state.keggState.substrate,
        target: state.keggState.reaction,
        opacity: 1,
        isReversibleLink: false //important for checking which link should considered in download
    }
    const reactionLinkProduct = {
        source: state.keggState.reaction,
        target: state.keggState.product,
        opacity: 1,
        isReversibleLink: false //important for checking which link should considered in download
    }
    const {sideNodes, sideLinks} = handleSideCompounds(state, dispatch, reactionLinkSubstrate, reactionLinkProduct)
    const nodes = [];
    const links = [];
    nodes.push({id: state.keggState.reaction, symbolType: "diamond" ,color: "black",opacity:1, x: 0,y:0,reversible: false})
    links.push(reactionLinkSubstrate)
    links.push(reactionLinkProduct)
    sideNodes.map(sideNode => nodes.push(sideNode))
    sideLinks.map(sideLink => links.push(sideLink))
    nodes.map(node => state.graphState.data.nodes.push(node))
    links.map(link => state.graphState.data.links.push(link))
    dispatch({type: "SETDATA", payload: state.graphState.data})
}
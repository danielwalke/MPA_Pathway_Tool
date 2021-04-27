import {getCompoundId} from "../upload/sbmlParser/SbmlReader/ReaderFunctions";

export const getStochiometrySubstratesString = (state) => {
    const object = {}
    state.specSubstrates.map((substrate, index) => {
        const substrateId = substrate.substring(substrate.length-6, substrate.length)
        object[`${substrateId}`] = state.specSubstratesCoeff[index].toString()
        return null
    })
    return object;
}

export const getStochiometryProductsString = (state) =>{
    const object = {}
    state.specProducts.map((product, index) => {
        const productId = product.substring(product.length-6, product.length)
        object[`${productId}`] = state.specProductsCoeff[index].toString()
        return null
    })
    return object;
}

export const getReaction = (state) => {
    let substrateSide = "";
    state.specSubstrates.map((substrate, index) => {
        substrateSide = substrateSide.concat(state.specSubstratesCoeff[index].toString(), " ", substrate.toString())
        if (index !== state.specSubstrates.length - 1) {
            substrateSide = substrateSide.concat(" + ")
        } else {
            substrateSide = substrateSide.concat(" -> ")
        }
        return null
    })
    let productSide = "";
    state.specProducts.map((product, index) => {
        productSide = productSide.concat(state.specProductsCoeff[index].toString(), " ", product.toString())
        if (index !== state.specProducts.length - 1) {
            productSide = productSide.concat(" + ")
        }
        return null
    })
    let reaction = substrateSide.concat(productSide)
    return reaction;
}


export const handleAddSubstrate = (e, dispatch, state, index) => {
    e.preventDefault()
    dispatch({type: "ADDSPECIFICSUBSTRATE", payload: state.specSubstrate.concat(" " + getCompoundId(index))})
    dispatch({type: "ADDSPECIFICSUBSTRATECOEFF", payload: state.specSubstrateCoeff})
}

export const handleAddProduct = (e, dispatch, state, index) => {
    e.preventDefault()
    dispatch({type: "ADDSPECIFICPRODUCT", payload: state.specProduct.concat(" " + getCompoundId(index))})
    dispatch({type: "ADDSPECIFICPRODUCTCOEFF", payload: state.specProductCoeff})
}


export const getUserReactionId = (reactionLength) => {
    if (reactionLength < 10) {
        return "0000".concat(reactionLength.toString());
    } else if (reactionLength >= 10 && reactionLength < 100) {
        return "000".concat(reactionLength.toString());
    } else if (reactionLength >= 100 && reactionLength < 1000) {
        return "00".concat(reactionLength.toString())
    } else if (reactionLength >= 1000 && reactionLength < 10000) {
        return "0".concat(reactionLength.toString())
    } else if (reactionLength >= 10000 && reactionLength < 100000) {
        return reactionLength.toString()
    } else {
        console.log("ERROR: reaction out of range")
    }
}

export const handleAddTaxonomy = (e, dispatch, state, generalState) => {
    e.preventDefault()
    dispatch({type: "ADDSPECTAXONOMY", payload: {taxonomicRank: generalState.taxonomicRank, taxon: state.specTaxonomy}})
}
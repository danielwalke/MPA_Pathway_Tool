const defaultState = {
    specSubstrate: "",
    specOptionsSubstrate: [],
    specOptionsProduct: [],
    specProduct: "",
    specSubstrates: [],
    specProducts: [],
    specSubstrateCoeff: "",
    specProductCoeff: "",
    specSubstratesCoeff: [],
    specProductsCoeff: [],
    specReaction: "",
    specKoNumber: "",
    specEcNumber: "",
    specKoNumbers: [],
    specTaxonomy: "",
    specTaxonomies: {},
    ecNumbers: [],
    showReactionDetails: false,
    isSpecificCompoundInputSubstrate: false,
    isSpecificCompoundInputProduct: false
}

export const specificReactionReducer = (state = defaultState, action) => {
    const {type, payload} = action;
    switch (type) {
        case "SETSPECIFICSUBSTRATE":
            return {...state, specSubstrate: payload}
        case "SETSPECIFICOPTIONSSUBSTRATE":
            return {...state, specOptionsSubstrate: payload}
        case "SETSPECIFICOPTIONSPRODUCT":
            return {...state, specOptionsProduct: payload}
        case "SETSPECIFICPRODUCT":
            return {...state, specProduct: payload}
        case "ADDSPECIFICSUBSTRATE":
            return {...state, specSubstrates: [...state.specSubstrates, payload]}
        case "SPLICESUBSTRATES":
            state.specSubstrates.splice(payload, 1)
            state.specSubstratesCoeff.splice(payload, 1)
            return {...state, specSubstrates: state.specSubstrates, specSubstratesCoeff: state.specSubstratesCoeff}
        case "ADDSPECIFICSUBSTRATECOEFF":
            return {...state, specSubstratesCoeff: [...state.specSubstratesCoeff, payload]}
        case "SETSPECIFICSUBSTRATECOEFF":
            return {...state, specSubstrateCoeff: payload}
        case "SETSPECIFICPRODUCTCOEFF":
            return {...state, specProductCoeff: payload}
        case "ADDSPECIFICPRODUCT":
            return {...state, specProducts: [...state.specProducts, payload]}
        case "SPLICEPRODUCTS":
            state.specProducts.splice(payload, 1)
            state.specProductsCoeff.splice(payload, 1)
            return {...state, specProducts: state.specProducts, specProductsCoeff: state.specProductsCoeff}
        case "ADDSPECIFICPRODUCTCOEFF":
            return {...state, specProductsCoeff: [...state.specProductsCoeff, payload]}
        case "SETSPECIFICREACTION":
            return {...state, specReaction: payload}
        case "SETKONUMBER":
            return {...state, specKoNumber: payload}
        case "SETECNUMBER":
            return {...state, specEcNumber: payload}
        case "ADDKONUMBER":
            return {...state, specKoNumbers: [...state.specKoNumbers, payload]}
        case "SPLICEKONUMBERS":
            state.specKoNumbers.splice(payload, 1)
            return {...state, specKoNumbers: state.specKoNumbers}
        case "SETSPECTAXONOMY":
            return {...state, specTaxonomy: payload}
        case "ADDSPECTAXONOMY":
            state.specTaxonomies[`${payload.taxon}`] = payload.taxonomicRank
            return {...state, specTaxonomies: state.specTaxonomies}
        case "SPLICETAXONOMIES":
            const taxon = payload.split(":")[1]
            delete state.specTaxonomies[`${taxon}`]
            return {...state, specTaxonomies: state.specTaxonomies}
        case "SETECNUMBERS":
            return {...state, ecNumbers: payload}
        case "SPLICEECNUMBERS":
            state.ecNumbers.splice(payload, 1)
            return {...state, ecNumbers: state.ecNumbers}
        case "RESETSPECIFICREACTION":
            return {
                ...state,
                specSubstrate: "",
                specProduct: "",
                specSubstrates: [],
                specProducts: [],
                specSubstrateCoeff: "",
                specProductCoeff: "",
                specSubstratesCoeff: [],
                specProductsCoeff: [],
                specReaction: "",
                specKoNumber: "",
                specEcNumber: "",
                specKoNumbers: [],
                ecNumbers: [],
                specTaxonomy: "",
                specTaxonomies: []
            }
        case "SWITCHSHOWREACTIONDETAILS":
            return {...state, showReactionDetails: !state.showReactionDetails}
        case "SWITCHISSPECCOMPOUNDINPUTSUBSTRATE":
            return {...state, isSpecificCompoundInputSubstrate: !state.isSpecificCompoundInputSubstrate}
        case "SWITCHISSPECCOMPOUNDINPUTPRODUCT":
            return {...state, isSpecificCompoundInputProduct: !state.isSpecificCompoundInputProduct}
        default:
            return state;
    }
}

const defaultState = {
    substrate: "",//keggReaction
    options: [],//keggReaction
    products: [],//keggReaction
    productReactionMap: new Map(),//keggReaction
    product: "",//keggReaction
    reactions: [],//keggReaction
    reaction: "",//keggReaction
    showNextReaction: false, //shows NextReactionModal in KeggReaction
    showEcModal: false,
    ecNumberSet: [],
    ecNumberRequest: "",
    ecNumbersRequest: [],
    ecNumbersRequestText: "",
    ecToReactionObject: {},
    reactionOfEc: "",
    compoundId2Name: {},
    showKoModal: false,
    koNumberSet: [],
    koNumberRequest: "",
    koNumbersRequest: [],
    koNumbersRequestText: "",
    koToReactionObject: {},
    reactionOfKo: "",
    sbmlCompound: "",
    sbmlCompounds: [],
    sbmlSpecies: [],
    showSbmlKeggConverter: false,
    annotatedSbmlSpecies: [],
    sbmlObject: {}
}

export const keggReactionReducer = (state = defaultState, action) => {
    const {type, payload} = action;
    switch (type) {
        case "SETCOMPOUNDLIST":
            return {...state, compoundList: payload};
        case "SETSUBSTRATE":
            return {...state, substrate: payload};
        case "SETOPTIONS":
            return {...state, options: payload};
        case "SETCOMPMAP":
            return {...state, compMap: payload};
        case "SWITCHLOADING":
            return {...state, loading: !state.loading};
        case "SETPRODUCTS":
            return {...state, products: payload};
        case "SETPRODUCTREACTIONMAP":
            return {...state, productReactionMap: payload}
        case "SETPRODUCT":
            return {...state, product: payload}
        case "SETREACTIONS":
            return {...state, reactions: payload}
        case "SETREACTION":
            return {...state, reaction: payload}
        case "SWITCHSHOWNEXTREACTION":
            return {...state, showNextReaction: !state.showNextReaction}
        case "SWITCHSHOWECMODAL":
            return {...state, showEcModal: !state.showEcModal}
        case "SETECNUMBERSET":
            return {...state, ecNumberSet: payload}
        case "SETECNUMBERREQUEST":
            return {...state, ecNumberRequest: payload}
        case "ADDECNUMBERREQUEST":
            return {...state, ecNumbersRequest: [...state.ecNumbersRequest, payload]}
        case "SETECNUMBERSREQUESTTEXT":
            return {...state, ecNumbersRequestText: payload}
        case "SETECNUMBERSREQUEST":
            const ecNumberList = []
            if (payload.includes(";")) {
                const ecNumbers = payload.split(";")
                ecNumbers.map(ec => ecNumberList.push(ec))
            } else {
                ecNumberList.push(payload)
            }
            return {...state, ecNumbersRequest: ecNumberList}
        case "SPLICEECNUMBERSREQUEST":
            state.ecNumbersRequest.splice(payload, 1)
            return {...state, ecNumbersRequest: state.ecNumbersRequest}
        case "SETECTOREACTIONOBJECT":
            return {...state, ecToReactionObject: payload}
        case "SETREACTIONOFEC":
            return {...state, reactionOfEc: payload}
        case "SETCOMPOUNDID2NAME":
            return {...state, compoundId2Name: payload}
        case "SWITCHSHOWKOMODAL":
            return {...state, showKoModal: !state.showKoModal}
        case "SETKONUMBERSET":
            return {...state, koNumberSet: payload}
        case "SETKONUMBERREQUEST":
            return {...state, koNumberRequest: payload}
        case "ADDKONUMBERREQUEST":
            return {...state, koNumbersRequest: [...state.koNumbersRequest, payload]}
        case "SPLICEKONUMBERSREQUEST":
            state.koNumbersRequest.splice(payload, 1)
            return {...state, koNumbersRequest: state.koNumbersRequest}
        case "SETKONUMBERSREQUESTTEXT":
            return {...state, koNumbersRequestText: payload}
        case "SETKONUMBERSREQUEST":
            const koNumberList = []
            if (payload.includes(";")) {
                const koNumbers = payload.split(";")
                koNumbers.map(ko => koNumberList.push(ko))
            } else {
                koNumberList.push(payload)
            }
            return {...state, koNumbersRequest: koNumberList}
        case "SETKOTOREACTIONOBJECT":
            return {...state, koToReactionObject: payload}
        case "SETREACTIONOFKO":
            return {...state, reactionOfKo: payload}
        case "SETSBMLCOMPOUND":
            return {...state, sbmlCompound: payload}
        case "ADDSBMLCOMPOUND":
            return {...state, sbmlCompounds: [...state.sbmlCompounds, {id: payload, compound: state.sbmlCompound}]}
        case "SETSBMLSPECIES":
            return {...state, sbmlSpecies: payload}
        case "SWITCHSHOWSBMLKEGGCONVERTER":
            return {...state, showSbmlKeggConverter: !state.showSbmlKeggConverter}
        case "SETANNOTATEDSPECIESLIST":
            return {...state, annotatedSbmlSpecies: payload}
        case "SETSBMLOBJECT":
            return {...state, sbmlObject: payload}
        default:
            return state;
    }
}

const defaultState = {
    reactionSbmlIds: {},
    reactionSbmlNames:[],
    ecNumbers:[],
    koNumbers:[],
    substrates:[],
    products:[]

}

export const sbmlReducer = (state = defaultState, action) => {
    const {type, payload} = action;
    switch (type) {
        case "SET_REACTION_SBML_ID":
            return {...state, reactionSbmlIds: payload}
        case "SET_REACTION_SBML_NAMES":
            return {...state, reactionSbmlNames: payload}
        case "SET_EC_NUMBERS":
            return {...state, ecNumbers: payload}
        case "SET_KO_NUMBERS":
            return {...state,koNumbers: payload}
        case "SET_SUBSTRATES":
            return {...state, substrates: payload}
        case "SET_PRODUCTS":
            return {...state, products: payload}
        default:
            return state;
    }
}

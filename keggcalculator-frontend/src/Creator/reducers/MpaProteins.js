const defaultState = {
    proteinSet: new Set(),
    chosenQuants: [],
    minQuantUserReaction3: 0,
    maxQuantUserReaction3: 0,
    midQuantUserReaction3: 0,
    sampleNames: [],
    mpaFileName: "",
    maxQuantUser3: 0,
    midQuantUser3: 0,
    minQuantUser3: 0
}

export const mpaProteinReducer = (state = defaultState, action) => {
    const {type, payload} = action;
    switch (type) {
        case "SETPROTEINSET":
            return {...state, proteinSet: payload}
        case "SETCHOSENQUANTS":
            return {...state, chosenQuants: payload}
        case "SETMAXQUANTUSER3":
            return {...state, maxQuantUser3: payload}
        case "SETMINQUANTUSERREACTION3":
            return {...state, minQuantUserReaction3: payload}
        case "SETMIDQUANTUSERREACTION3":
            return {...state, midQuantUserReaction3: payload}
        case "SETMAXQUANTUSERREACTION3":
            return {...state, maxQuantUserReaction3: payload}
        case "SETMIDQUANTUSER3":
            return {...state, midQuantUser3: payload}
        case "SETMINQUANTUSER3":
            return {...state, minQuantUser3: payload}
        case "SETSAMPLENAMES":
            return {...state, sampleNames: payload}
        case "SETMPAFILENAME":
            return {...state, mpaFileName: payload}
        default:
            return state;
    }
}

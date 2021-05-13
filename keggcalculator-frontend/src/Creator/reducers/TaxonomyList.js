const defaultState = {
    taxonomyNcbiList: [],
}

export const taxonomyReducer = (state = defaultState, action) => {
    const {type, payload} = action;
    switch (type) {
        case "SET_TAXONOMY_NCBI_LIST":
            return {...state, taxonomyNcbiList: payload}
        default:
            return state;
    }
}

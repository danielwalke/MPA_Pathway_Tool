const defaultState = {
    data: {//graph
        nodes: [],
        links: [],
    },
}

export const fluxAnalysisReducer = (state = defaultState, action) => {
    const {type, payload} = action;
    switch (type) {
        case "SET_FLUX_GRAPH":
            return {...state, data: payload}
        default:
            return state;
    }
}

const defaultState = {
    data: {//graph
        nodes: [],
        links: [],
    },
    showGraphModal: false,
    graphModalInput: {},
    selectedNode: {},
    flux: null
}

export const fluxAnalysisReducer = (state = defaultState, action) => {
    const {type, payload} = action;
    switch (type) {
        case "SET_FLUX_GRAPH":
            return {...state, data: payload}
        case "SHOW_GRAPH_MODAL":
            return {...state, showGraphModal: payload}
        case "SET_GRAPH_MODAl_INPUT":
            return {...state, graphModalInput: payload}
        case "SET_SELECTED_NODE":
            return {...state, selectedNode: payload}
        case "SET_FBA_RESULTS":
            return {...state, flux: payload}
        default:
            return state;
    }
}
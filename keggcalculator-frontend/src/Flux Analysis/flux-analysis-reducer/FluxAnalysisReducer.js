const defaultState = {
    data: {//graph
        nodes: [],
        links: [],
    },
    showGraphModal: false,
    graphModalInput: {},
    selectedNode: {},
    showSMomentFlux: false,
    flux: null,
    sMomentFlux: null
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
        case "TOGGLE_FBA_RESULTS":
            return {...state, showSMomentFlux: !state.showSMomentFlux}
        case "SET_FBA_RESULTS":
            return {...state, flux: payload}
        case "SET_SMOMENT_FBA_RESULTS":
            return {...state, sMomentFlux: payload}
        default:
            return state;
    }
}

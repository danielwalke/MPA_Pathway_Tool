const defaultState = {
    exclusionNodeList: [],
    communityNodes: 0,
    isModalOpen: false,
    nodeId: undefined

}

export const communityReducer = (state = defaultState, action) => {
    const {type, payload} = action;
    switch (type) {
        case "ADD_NODE_TO_EXCLUSION_LIST":
            return {...state, exclusionNodeList: [...state.exclusionNodeList, payload]}
        case "SET_NUMBER_OF_COMMUNITY_NODES":
            return {...state, communityNodes: payload}
        case "SWITCH_IS_COMMUNITY_MODAL_OPEN":
            return{ ...state, isModalOpen: !state.isModalOpen}
        case "SET_COMMUNITY_NODE_ID":
            return {...state, nodeId: payload}
        default:
            return state;
    }
}

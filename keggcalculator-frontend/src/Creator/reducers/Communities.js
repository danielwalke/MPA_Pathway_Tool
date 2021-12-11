const defaultState = {
    exclusionNodeList: [],
    communityNodes: 0

}

export const communityReducer = (state = defaultState, action) => {
    const {type, payload} = action;
    switch (type) {
        case "ADD_NODE_TO_EXCLUSION_LIST":
            return {...state, exclusionNodeList: [...state.exclusionNodeList, payload]}
        case "SET_NUMBER_OF_COMMUNITY_NODES":
            return {...state, communityNodes: payload}
        default:
            return state;
    }
}

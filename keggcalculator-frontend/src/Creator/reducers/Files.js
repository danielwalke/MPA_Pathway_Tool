const defaultState = {
    experimentalDataFile: null,//new File([], ""),
    pathwayFile: null
    }

export const fileReducer = (state = defaultState, action) => {
    const {type, payload} = action;
    switch (type) {
        case "SET_EXPERIMENTAL_DATA_FILE":
            return {
                ...state, experimentalDataFile: payload
            }
        case "SET_PATHWAY_FILE":
            return {
                ...state, pathwayFile: payload
            }
        default:
            return state;
    }
}

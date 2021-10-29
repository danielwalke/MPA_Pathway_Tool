const defaultState = {
    new_data : {
        nodes : [],
        links : [],
    },
    new_dataLinks: [],
    isModulesImport: false,

}

export const fbaReducer = (state = defaultState, action) => {
    const {type, payload} = action;
    switch (type) {
        case "SETNEWDATA":
            return {...state, new_data: payload}
        case "SETNEWDATALINKS":
            return {...state, new_dataLinks: payload}
        case "SWITCHISMODULESIMPORT":
            return {...state, isModulesImport: !state.isModulesImport}

        default:
            return state;

    }
}
const defaultState = {
    new_data_backup : {
        nodes : [],
        links : [],
    },
    new_dataLinks: [],
    isModulesImport: false,
    objectiveCoeffecientUpdated: [],

}

export const fbaReducer = (state = defaultState, action) => {
    const {type, payload} = action;
    switch (type) {
        case "SETNEWDATA":
            return {...state, new_data_backup: payload}
        case "SETNEWDATALINKS":
            return {...state, new_dataLinks: payload}
        case "SWITCHISMODULESIMPORT":
            return {...state, isModulesImport: !state.isModulesImport}
        case "SETOBJECTIVECOEFFECIENTUPDATE":
            payload.map(reaction => state.objectiveCoeffecientUpdated.push(reaction))
            return {...state, objectiveCoeffecientUpdated: state.objectiveCoeffecientUpdated}

        default:
            return state;

    }
}
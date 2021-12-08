const defaultState = {
    new_data_backup : {
        nodes : [],
        links : [],
    },
    new_dataLinks: [],
    isModulesImport: false,
    objectiveCoeffecientUpdated: [],
    data_circular: {
        nodes : [],
        links : [],
    },
    deleteNodeCircular: "",
    showDeleteModalCircular: false,
    fbaValues: [],

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
        case "SETDATACIRCULAR":
            return {...state, data_circular: payload}
        case "SETDELETENODECIRCULAR":
            return {...state, deleteNodeCircular: payload}
        case "SWITCHDELETEMODALCIRCULAR":
            return {...state, showDeleteModal: !state.showDeleteModal}
        case "SETFBAVALUES":
            return {...state, fbaValues: payload}
        default:
            return state;

    }
}
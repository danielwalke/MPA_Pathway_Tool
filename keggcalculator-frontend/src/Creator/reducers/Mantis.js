const defaultState = {
    mantisFileName: "",
    uuId: "",
    errorMessage: "",
    jobMessage: "",
    downloadLink: "",
    mantisFile: undefined
}

export const mantisReducer = (state = defaultState, action) => {
    const {type, payload} = action;
    switch (type) {
        case "SET_MANTIS_FILE_NAME":
            return {...state, mantisFileName: payload}
        case "SET_MANTIS_UUID":
            return {...state, uuId: payload}
        case "SET_ERROR_MESSAGE":
            return {...state, errorMessage: payload}
        case "SET_MANTIS_JOB_MESSAGE":
            return {...state, jobMessage: payload}
        case "SET_MANTIS_DOWNLOAD_LINK":
            return {...state, downloadLink: payload}
        case "SET_MANTIS_FILE":
            return {...state, mantisFile: payload}
        default:
            return state;
    }
}

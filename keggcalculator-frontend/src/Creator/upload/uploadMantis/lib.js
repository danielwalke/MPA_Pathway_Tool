import {requestGenerator} from "../../../Request Generator/RequestGenerator";
import * as RequestURL from "../../../App Configurations/RequestURLCollection";

export const onMantisFileChange = (files, dispatch) => {
    dispatch({type: "SET_MANTIS_FILE_NAME", payload: files[0].name})
    dispatch({type: "SET_MANTIS_FILE", payload: files[0]})
    dispatch({type: "SETLOADING", payload: false})
}

export const startMantisJob = (dispatch, state) =>{
    let body = {jobID: "", mantisFile: state.mantisFileName, message: "", downloadLink: ""};
    requestGenerator("POST", RequestURL.endpoint_startMantis, "", "", body).then(response => {
        if (response.status === 200) {
            const {jobID, message} = response.data;
            dispatch({type: "SET_MANTIS_UUID", payload: jobID})
            const header = {
                "Content-Type": "multipart/form-data",
                "type": "formData",
                "Transfer-Encoding": "chunked"
            };
            console.log(jobID)
            const formData = new FormData();
            formData.append("Content-Type", "multipart/form-data");
            formData.append("uploaded_file", state.mantisFile);
            dispatch({type:"SET_MANTIS_JOB_MESSAGE", payload: message})
            requestGenerator("POST", RequestURL.endpoint_uploadMantisFile, {jobID: jobID}, header, formData).then(response => {
                if (response.status !== 200) {
                    dispatch({type: "SET_ERROR_MESSAGE", payload: "Failed uploading mpa file"})
                }
            });
            if (state.errorMessage.length===0) { //empty error message
                fetchStatus(jobID, dispatch)
            }
        } else {
            dispatch({type: "SET_ERROR_MESSAGE", payload: "Failed fetching uuid"})
        }
    })
}


const fetchStatus = (jobID, dispatch) => {
    requestGenerator("GET", RequestURL.endpoint_mantisJobStatus, {jobid: jobID}, "", "").then(response => {
        if (response.status === 200) {
            const {message} = response.data;
            console.log(message)
            if (message === "finished") {
                dispatch({type:"SET_MANTIS_JOB_MESSAGE", payload: message})
                dispatch({type:"SET_MANTIS_DOWNLOAD_LINK", payload: `${RequestURL.endpoint_downloadMantisResults}/${jobID}`})
                dispatch({type:"SETLOADING", payload: false})
            } else if (message === "failed") {
                dispatch({type: "SET_ERROR_MESSAGE", payload: message})
            } else {
                setTimeout(() => fetchStatus(jobID, dispatch), 5000)
            }
        }
    });
};
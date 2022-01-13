import {requestGenerator} from "../../Creator/request/RequestGenerator";
import * as RequestUrl from "../../App Configurations/RequestURLCollection";

export async function startFBAJob(dispatch, networkObj) {
    let body = {
        jobId: "",
        networkName: "Käsekuchen",
        message: "",
        fbaSolution: ""
    }
    try {
        const jobMetaData = await requestGenerator("POST", RequestUrl.endpoint_startFba, "", "", body)

        if (jobMetaData.status !== 200) {
            throw 'Error while creating fba job.'
        }

        const {jobId} = jobMetaData.data
        const header = {
            "Content-Type": "multipart/form-data",
            "type": "formData",
            "Transfer-Encoding": "chunked"
        }

        const formData = new FormData()
        formData.append("Content-Type", "multipart/form-data")
        formData.append("network", JSON.stringify(networkObj))

        const upload = await requestGenerator(
            "POST", RequestUrl.endpoint_uploadNetwork, {jobId: jobId}, header, formData)

        if (upload.status !== 200) {
            throw 'Error while uploading network data.'
        }

        const status = await fetchStatus(jobId, RequestUrl.endpoint_fbaStatus)

        if (status) {
            return status.fbaSolution
        } else {
        //    TODO: stop execution
        }

    } catch (e) {
        console.error(e)
    }
}

async function fetchStatus(jobId, endpoint) {

    while (true) {
        const status = await requestGenerator("GET", endpoint, {jobId: jobId}, "", "")

        if (status.status === 200) {
            if (status.data.message === "finished") {
                return status.data
            } else if (status.data.message === "failed") {
                console.log('Job failed')
                break;
            } else {
                await sleep(5000)
            }
        } else {
            throw 'Error while requesting fba job status.'
            // break;
        }
    }
}

function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

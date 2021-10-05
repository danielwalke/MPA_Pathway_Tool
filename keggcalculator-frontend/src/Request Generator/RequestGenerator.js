import axios from "axios";
import {host, portNumber} from "../App Configurations/SystemSettings";

export const requestGenerator = (httpmethod, endpoint, params, header, body) => {
    return axios({
        method: httpmethod,
        url: endpoint,
        params: params,
        header: header,
        data: body,
        validateStatus:  (status) => {
            return status>=200 && status<300;
        },
        proxy: {
            host: host,
            port: portNumber
        }
    })
}
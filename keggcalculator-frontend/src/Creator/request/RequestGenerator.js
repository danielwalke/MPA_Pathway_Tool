import axios from "axios";

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
            host: "http://127.0.0.1",
            port: 80
        }
    })
}
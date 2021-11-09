import {parseDummyRequestArray} from "./ParseRequestArray";
import {requestGenerator} from "../../Creator/request/RequestGenerator";
import {endpoint_getDummyFBAData} from "../../App Configurations/RequestURLCollection";

export async function getDummyFluxData(reactionsInSelectArray) {
    const requestObj = parseDummyRequestArray(reactionsInSelectArray)

    const response = await requestGenerator("POST", endpoint_getDummyFBAData, {"dummyFBA": requestObj}, "")

    return response
}

import {requestGenerator} from "../../request/RequestGenerator";
import {endpoint_getTaxonomyIdList} from "../../../App Configurations/RequestURLCollection";

export async function requestTaxonomiesForReactions(reactionsInSelectArray) {

    const taxonomyUrl = endpoint_getTaxonomyIdList
    const taxonomiesForRequest = []

    reactionsInSelectArray.forEach(reaction => {
        for (const taxon of Object.entries(reaction.taxa)) {
            const requestListObj = {
                reactionId: reaction.reactionId,
                name: taxon[0],
                rank: taxon[1]
            }
            taxonomiesForRequest.push(requestListObj)
        }}
    )

    try {
        let response = await requestGenerator("POST", taxonomyUrl, {taxonomyList: {"taxonomyList": taxonomiesForRequest}}, "")

        return response.data
    } catch (e) {
        window.alert("couldn't fetch taxonomies")
        return []
    }

}

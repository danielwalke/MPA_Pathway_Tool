
export function parseRequestArray(reactionsInSelectArray) {

    const requestObj = {}

    return requestObj;
}

export function parseDummyRequestArray(reactionsInSelectArray) {

    const requestObj = {
        "FBAObj": {
            "reactionList":[]
        }
    }

    reactionsInSelectArray.forEach(reaction => {
        requestObj.FBAObj.reactionList.push({"reactionId": reaction.reactionId})
    })

    return requestObj;
}

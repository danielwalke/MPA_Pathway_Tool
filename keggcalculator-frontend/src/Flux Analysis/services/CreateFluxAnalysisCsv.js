
export function createFluxAnalysisCsv(fluxAnalysisResponse) {
    let output = "reactionId;FVA_min;FVA_max;FBA\n"

    for (const reaction of fluxAnalysisResponse) {
        const reactionId = Object.getOwnPropertyNames(reaction)
        const row =
            `${reactionId};${reaction[reactionId].minFlux};${reaction[reactionId].maxFlux};${reaction[reactionId].fbaSolution}\n`
        output = output.concat(row)
    }

    console.log(output)

    return new Blob(new Array(output.trim()), {type: "text/plain;charset=utf-8"});
}

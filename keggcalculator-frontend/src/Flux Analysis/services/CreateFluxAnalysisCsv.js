
export function createFluxAnalysisCsv(fluxAnalysisResponse) {
    let output = "reactionId;FVA_min;FVA_max;FBA\n"

    for (const [key, value] of fluxAnalysisResponse.entries()) {
        const row =
            `${key};${value.minFlux};${value.maxFlux};${value.fbaSolution}\n`
        output = output.concat(row)
    }

    return new Blob(new Array(output.trim()), {type: "text/plain;charset=utf-8"});
}

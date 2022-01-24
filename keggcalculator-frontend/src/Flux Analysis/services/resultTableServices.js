import {exampleFluxData, exampleSmomentFluxData, fluxExample} from "../flux-analysis-user-interface/exampleData";

export function parseFluxTableArray(generalState, fluxState) {

    const tableArray = []

    const exampleFlux = fluxExample(exampleFluxData)
    const exampleSmomentFlux = fluxExample(exampleSmomentFluxData)

    let index = 0

    fluxState.flux.forEach((value, key) => {

        const abbreviation = generalState.reactionsInSelectArray.find(reaction => reaction.reactionId === key).abbreviation

        const tableObject = {
            index: index,
            reactionId: key,
            reactionAbbreviation: abbreviation,
            fbaFlux: value.fbaSolution,
            fvaMax: value.maxFlux,
            fvaMin: value.minFlux,
            fbaFluxSmoment: null,
            fvaMaxSmoment: null,
            fvaMinSmoment: null
        }

        if (fluxState.sMomentFlux.size > 0) {

            const smomentFluxObject = fluxState.sMomentFlux.get(key)

            tableObject.fbaFluxSmoment = smomentFluxObject.fbaSolution
            tableObject.fvaMaxSmoment = smomentFluxObject.maxFlux
            tableObject.fvaMinSmoment = smomentFluxObject.minFlux
        }

        tableArray.push(tableObject)
        index++
    })

    console.log(tableArray)
    return tableArray;
}

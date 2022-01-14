import {filterProteomeData, getAllIdentifiersInNetwork} from "../../Creator/data-mapping/Sample";

export function parseProteinData(reactionArray, proteinState) {
    const identifiers = getAllIdentifiersInNetwork(reactionArray)
    return filterProteomeData(Array.from(proteinState.proteinSet), identifiers)
}

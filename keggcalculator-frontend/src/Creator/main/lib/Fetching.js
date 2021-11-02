import {requestGenerator} from "../../request/RequestGenerator";
import {
    endpoint_getCompoundList,
    endpoint_getEcNumberList,
    endpoint_getKoNumberList,
    endpoint_getModuleList, endpoint_getReactionList
} from "../../../App Configurations/RequestURLCollection";
import {getCompName} from "../../keggReaction/substrate and products/substrate/CompName";

const setEcNumbersInStore = (ecNumbers, dispatch) =>dispatch({type: "SETECNUMBERSET", payload: ecNumbers.data })

const queryEcNumbers = dispatch => requestGenerator("GET", endpoint_getEcNumberList, "", "").then(ecNumbers => setEcNumbersInStore(ecNumbers, dispatch))

const setKoNumbersInStore = (koNumbers, dispatch) => dispatch({type: "SETKONUMBERSET", payload: koNumbers.data})

const queryKoNumbers = dispatch =>  requestGenerator("GET", endpoint_getKoNumberList, "", "").then(koNumbers => setKoNumbersInStore(koNumbers, dispatch))

const setKeggModulesInStore = (keggModules, dispatch) => dispatch({type: "SETMODULELIST", payload: keggModules.data})

const queryKeggModules = dispatch => requestGenerator("GET", endpoint_getModuleList, "", "").then(keggModules => setKeggModulesInStore(keggModules, dispatch))

const setKeggReactionsInStore = (keggReactions, dispatch) => dispatch({type: "SETKEGGREACTIONS", payload: keggReactions.data})

const queryKeggReactions = dispatch => requestGenerator("GET", endpoint_getReactionList, "", "").then(keggReactions => setKeggReactionsInStore(keggReactions, dispatch))

const setKeggCompoundsInStore = async (compoundNameToIdMap, compoundIdToName, dispatch) =>{
    await dispatch({type: "SETCOMPMAP", payload: compoundNameToIdMap})
    await dispatch({type: "SETCOMPOUNDID2NAME", payload: compoundIdToName})
    await dispatch({type: "SETOPTIONS", payload: getCompName(compoundNameToIdMap)})
    await dispatch({type: "SETLOADING", payload: false})
}

const getKeggCompoundNameToIdMap = keggCompounds => {
    const keggCompoundNameToIdMap = new Map()
    keggCompounds.data.forEach((comp) => keggCompoundNameToIdMap.set(comp.compoundName.concat(" ").concat(comp.compoundId), comp.compoundId))
    return keggCompoundNameToIdMap
}

const getKeggCompoundIdToName = keggCompounds => {
    const keggCompoundIdToName = {}
    keggCompounds.data.forEach((comp) => keggCompoundIdToName[`${comp.compoundId}`] = comp.compoundName.concat(" ").concat(comp.compoundId))
    return keggCompoundIdToName
}

const queryKeggCompounds = async dispatch => {
    const keggCompounds =  await requestGenerator("GET", endpoint_getCompoundList, "", "")
    const keggCompoundNameToIdMap = getKeggCompoundNameToIdMap(keggCompounds)
    const keggCompoundIdToName = getKeggCompoundIdToName(keggCompounds)
    await setKeggCompoundsInStore(keggCompoundNameToIdMap, keggCompoundIdToName, dispatch)
}

export const queryKeggInformation = async(dispatch) => {
    await queryKeggCompounds(dispatch)
    queryEcNumbers(dispatch)
    queryKoNumbers(dispatch)
    queryKeggModules(dispatch)
    queryKeggReactions(dispatch)
}

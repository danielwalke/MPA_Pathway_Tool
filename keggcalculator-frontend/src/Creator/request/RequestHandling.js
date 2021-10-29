import {requestGenerator} from "./RequestGenerator";
import {getCompName} from "../keggReaction/substrate and products/substrate/CompName";
import {endpoint_getCompoundList} from "../../App Configurations/RequestURLCollection";

export const compoundUrl = endpoint_getCompoundList; //URL for receiving compound list

export const handleSetCompoundList = (dispatch) =>{
    const compMap = new Map()
    const compoundId2Name = {}
    requestGenerator("GET", compoundUrl, "", "").then(response => {
        response.data.map((comp) => {
            compMap.set(comp.compoundName.concat(" ").concat(comp.compoundId), comp.compoundId) //creates a map with names of compounds and their id
            compoundId2Name[`${comp.compoundId}`]= comp.compoundName.concat(" ").concat(comp.compoundId)
            return null
        })
        return (
            {compMap, compoundId2Name}
        )
    }).then(({compMap}) => {
        dispatch({type: "SETCOMPMAP", payload: compMap})
        dispatch({type: "SETCOMPOUNDID2NAME", payload: compoundId2Name})
        dispatch({type: "SETOPTIONS", payload: getCompName(compMap)})
        dispatch({type:"SETLOADING", payload:false})
    })
}
import clonedeep from "lodash/cloneDeep";
import {taxonomicRanks} from "../main/Main";

const defaultState = {
    compoundList: [],//mount?
    compMap: new Map(),//mount
    loading: false,//general
    reactionsInSelectArray: [],//all reactions
    showKeggReaction: false,
    showSpecificReaction: false,
    showUserInfo: false,
    showModuleList: false,
    module: "",
    moduleList: [],
    downloadModal: false,
    uploadModal: false,
    multiReactionModal: false,
    nodeConfigurationModal: false,
    taxonomy: "",
    taxonomies: [],
    taxonomicRank: ""
}

export const generalReducer = (state = defaultState, action) => {
    const {type, payload} = action;
    switch (type) {
        case "SETCOMPOUNDLIST":
            return {...state, compoundList: payload};
        case "SETCOMPMAP":
            return {...state, compMap: payload};
        case "SWITCHLOADING":
            return {...state, loading: !state.loading};
        case "SETLOADING":
            return {...state, loading: payload}
        case "ADDREACTIONSTOARRAY":
            payload.map(reaction => state.reactionsInSelectArray.push(reaction))
            return {...state, reactionsInSelectArray: state.reactionsInSelectArray}
        case "SWITCHSHOWSPECIFICREACTION":
            return {...state, showSpecificReaction: !state.showSpecificReaction}
        case "SWITCHSHOWKEGGREACTION":
            return {...state, showKeggReaction: !state.showKeggReaction}
        case "SWITCHSHOWUSERINFO":
            return {...state, showUserInfo: !state.showUserInfo}
        case "SWITCHSHOWMODULELIST":
            return {...state, showModuleList: !state.showModuleList}
        case "SETMODULE":
            return {...state, module: payload}
        case "SETMODULELIST":
            return {...state, moduleList: payload}
        case "SWITCHDOWNLOADMODAL":
            return {...state, downloadModal: !state.downloadModal}
        case "SWITCHUPLOADMODAL":
            return {...state, uploadModal: !state.uploadModal}
        case "SWITCHMULTIREACTIONMODAL":
            return {...state, multiReactionModal: !state.multiReactionModal}
        case "SWITCHNODECONFIGURATIONMODAL":
            return {...state, nodeConfigurationModal: !state.nodeConfigurationModal}
        case "SETTAXONOMY":
            return {...state, taxonomy: payload}
        case "ADDTAXONOMY":
            const reactionsClone = clonedeep(state.reactionsInSelectArray)
            const reactions = reactionsClone.map(reaction => {
                if (reaction.reactionName === payload) {
                    console.log(reaction)
                    reaction.taxa[`${state.taxonomy}`] = state.taxonomicRank
                    // reaction.taxonomies.push(`${state.taxonomicRank}:${state.taxonomy}`)
                }
                return reaction
            })
            return {...state, reactionsInSelectArray: reactions}
        case "DELETETAXONOMY": {
            const taxon = payload.taxon.split(":")[1]
            const reactionsClone = clonedeep(state.reactionsInSelectArray)
            const reactions = reactionsClone.map(reaction => {
                if (reaction.reactionName === payload.reactionName) {
                    delete reaction.taxa[`${taxon}`]
                    // reaction.taxonomies.splice(payload.index, 1)
                }
                return reaction
            })
            return {...state, reactionsInSelectArray: reactions}
        }
        case "ADDPATHWAYTAXONOMY": {
            const reactionsClone = clonedeep(state.reactionsInSelectArray)
            const reactions = reactionsClone.map(reaction => {
                reaction.taxa[`${state.taxonomy}`] = state.taxonomicRank
                // reaction.taxonomies.push(`${state.taxonomicRank}:${state.taxonomy}`)
                return reaction
            })
            return {...state, reactionsInSelectArray: reactions}
        }
        case "DELETEPATHWAYTAXONOMY": {
            const taxon = payload.split(":")[1]
            const reactionsClone = clonedeep(state.reactionsInSelectArray)
            const reactions = reactionsClone.map(reaction => { //iterate over all reactions
                delete reaction.taxa[`${taxon}`]
                // reaction.taxonomies = reaction.taxonomies.filter(taxonomy => taxonomy !== payload)
                return reaction
            })
            return {...state, reactionsInSelectArray: reactions}
        }
        case "SETTAXONOMICRANK":
            return {...state, taxonomicRank: payload}
        default:
            return state;
    }
}

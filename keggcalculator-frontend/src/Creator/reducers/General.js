import clonedeep from "lodash/cloneDeep";

const defaultState = {
    compoundList: [],//mount?
    compMap: new Map(),//mount
    loading: false,//general
    reactionsInSelectArray: [],//all reactions
    keggReactions: [],
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
    taxonomicRank: "",
    showSpecialProteinsModal: false,
    specialProteinName: "",
    specialProteinKoNumbers: [],
    specialProteinEcNumbers: [],
    specialProteins: [],
    headerHeight: 0,
    compoundId2Name: {},
    reactions: [],
    listOfSpecies: [], /*from sbml [     {
                sbmlId: sbmlId,
                sbmlName: sbmlName,
                keggId: keggId,
                keggName: keggName
            }]*/
    listOfReactions: [], /*
    [{
                sbmlId: sbmlId,
                sbmlName: sbmlName,
                keggId: keggId,
                ecNumbers: ecNumbers,
                koNumbers:koNumbers,
                substrates: substrates,
                products: products
            }]
    */
    isMissingAnnotations: false, //boolean, which checks whether there are unannotated compounds in the given sbml file
    isAnnotationPurpose: false, //boolean, which checks whether the user intents to make annotation for the compounds in the given sbml-file
    annotation: "",
    moduleFileNameSbml: "",
    isShowingReactionTable: false, //shows final table with all reactions in the sbml file
    showMultipleKeggReactionModal: false, //show modal for chosing multiple reactions from KEGG
    addLinkModal: false, //modal for adding new links useful for signaling pathway
    listOfReactionGlyphs: [], //positons of nodes in sbml file
    taxonomicNames: [], //taxonomic names received from server after submitting taxonomic rank
    mappingStart: "", //start time of mapping
    mappingEnd: "" //end time of mapping

}

export const generalReducer = (state = defaultState, action) => {
    const {type, payload} = action;
    switch (type) {
        case "SETCOMPOUNDID2NAME":
            return {...state, compoundId2Name: payload}
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
        case "SETREACTIONSINARRAY":
            return {...state, reactionsInSelectArray: payload}
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
                const reactionTaxa = clonedeep(reaction.taxa)
                if (reaction.reactionName === payload) {
                    reactionTaxa[`${state.taxonomy}`] = state.taxonomicRank
                    reaction.taxa = reactionTaxa
                    // reaction.taxonomies.push(`${state.taxonomicRank}:${state.taxonomy}`)
                } else {
                    reaction.taxa = reactionTaxa
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
        case "SWITCHSHOWSPECIALPROTEINSMODAL":
            return {...state, showSpecialProteinsModal: !state.showSpecialProteinsModal}
        case "SETSPECIALPROTEINNAME":
            return {...state, specialProteinName: payload}
        case "SETSPECIALPROTEINKONUMBERS":
            const koNumbers = payload.split(";")
            return {...state, specialProteinKoNumbers: koNumbers}
        case "SETSPECIALPROTEINECNUMBERS":
            const ecNumbers = payload.split(";")
            return {...state, specialProteinEcNumbers: ecNumbers}
        case "ADDSPECIALPROTEIN":
            return {
                ...state,
                specialProteins: [...state.specialProteins, {
                    name: state.specialProteinName,
                    koNumbers: state.specialProteinKoNumbers,
                    ecNumbers: state.specialProteinEcNumbers
                }]
            }
        case "SETHEADERHEIGHT":
            return {...state, headerHeight: payload}
        case "SETKEGGREACTIONS":
            return {...state, reactions: payload}
        case "SETLISTOFSPECIES":
            return {...state, listOfSpecies: payload}
        case "SETLISTOFREACTIONS":
            return {...state, listOfReactions: payload}
        case "SETISMISSINGANNOTATIONS":
            return {...state, isMissingAnnotations: payload}
        case "SETANNOTATION":
            return {...state, annotation: payload}
        case "SETMODULEFILENAMESBML":
            return {...state, moduleFileNameSbml: payload}
        case "SETISANNOTATIONPURPOSE":
            return {...state, isAnnotationPurpose: payload}
        case "SETISSHOWINGREACTIONTABLE":
            return {...state, isShowingReactionTable: payload}
        case "SWITCHSHOWMULTIPLEKEGGREACTIONS":
            return {...state, showMultipleKeggReactionModal: !state.showMultipleKeggReactionModal}
        case "SWITCHSHOWADDLINKMODAL":
            return {...state, addLinkModal: !state.addLinkModal}
        case "SET_LIST_OF_REACTION_GLYPHS":
            return {...state, listOfReactionGlyphs: payload}
        case "ADD_KEGG_REACTION":
            return {...state, keggReactions: [...state.keggReactions, payload]}
        case "SET_KEGG_REACTION":
            return {...state, keggReactions: payload}
        case "SET_TAXONOMIC_NAMES":
            return {...state, taxonomicNames: payload}
        case "SET_MAPPING_START_TIME":
            return {...state, mappingStart: payload}
        case "SET_MAPPING_END_TIME":
            return {...state, mappingEnd: payload}
        default:
            return state;
    }
}

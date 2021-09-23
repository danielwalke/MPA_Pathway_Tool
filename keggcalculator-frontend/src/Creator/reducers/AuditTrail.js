import {getCurrentDateMinute} from "../usefulFunctions/Date"

const defaultState = {
    // upload
    uploadExperimentalData: [],
    uploadPathway: [],
    // help
    requestedHelp: [],
    //nodeModifications
    nodeModifications: [],
    abbreviations: [],
    splitNodes: [],
    mergeNodes: [],
    addedTaxonomy: [],
    align: [],
    //kegg reactions
    substrate: [],
    product: [],
    reaction: [],
    //user reactions
    userSubstrate: [],
    userProduct: [],
    userReaction: [],
    //import reactions
    keggModule: [],
    ecNumbers: [],
    kNumbers: [],
    reactionNumbers: [],
    //download
    csv: [],
    json: [],
    sbml: [],
    svg: [],
    data: [],
    stoichiometricMatrix: []

}

export const auditTrailReducer = (state = defaultState, action) => {
    const {type, payload} = action;
    switch (type) {
        case "ADD_EXPERIMENTAL_DATA_TO_AUDIT_TRAIL":
            return {
                ...state, uploadExperimentalData: [...state.uploadExperimentalData, {
                    time: getCurrentDateMinute(),
                    data: payload //fileName
                }]
            }
        case "ADD_PATHWAY_TO_AUDIT_TRAIL":
            return {
                ...state, uploadPathway: [...state.uploadPathway, {
                    time: getCurrentDateMinute(),
                    data: payload //fileName
                }]
            }
        case "ADD_HELP_TO_AUDIT_TRAIL":
            return {
                ...state, requestedHelp: [...state.requestedHelp, {
                    time: getCurrentDateMinute()
                }]
            }
        case "ADD_NODE_MODIFICATION_TO_AUDIT_TRAIL":
            return {
                ...state, nodeModifications: [...state.nodeModifications, {
                    time: getCurrentDateMinute(),
                    data: payload //node modification
                }]
            }
        case "ADD_ABBREVIATION_TO_AUDIT_TRAIL":
            return {
                ...state, abbreviations: [...state.abbreviations, {
                    time: getCurrentDateMinute(),
                    data: payload //abbreviation
                }]
            }
        case "ADD_SPLIT_NODES_TO_AUDIT_TRAIL":
            return {
                ...state, splitNodes: [...state.splitNodes, {
                    time: getCurrentDateMinute(),
                    data: payload //splitted node
                }]
            }
        case "ADD_MERGE_NODES_TO_AUDIT_TRAIL":
            return {
                ...state, mergeNodes: [...state.mergeNodes, {
                    time: getCurrentDateMinute(),
                    data: payload //merged node
                }]
            }
        case "ADD_ADDED_TAXONOMY_TO_AUDIT_TRAIL":
            return {
                ...state, addedTaxonomy: [...state.addedTaxonomy, {
                    time: getCurrentDateMinute(),
                    data: payload //taxonomy
                }]
            }
        case "ADD_ALIGN_TO_AUDIT_TRAIL":
            return {
                ...state, align: [...state.mergeNodes, {
                    time: getCurrentDateMinute()
                }]
            }
        case "ADD_SUBSTRATE_TO_AUDIT_TRAIL":
            return {
                ...state, substrate: [...state.substrate, {
                    time: getCurrentDateMinute(),
                    data: payload //substrateName
                }]
            }
        case "ADD_PRODUCT_TO_AUDIT_TRAIL":
            return {
                ...state, product: [...state.product, {
                    time: getCurrentDateMinute(),
                    data: payload //productName
                }]
            }
        case "ADD_REACTION_TO_AUDIT_TRAIL":
            return {
                ...state, reaction: [...state.reaction, {
                    time: getCurrentDateMinute(),
                    data: payload //reactionName
                }]
            }
        case "ADD_USER_SUBSTRATE_TO_AUDIT_TRAIL":
            return {
                ...state, userSubstrate: [...state.userSubstrate, {
                    time: getCurrentDateMinute(),
                    data: payload //substrateName
                }]
            }
        case "ADD_USER_PRODUCT_TO_AUDIT_TRAIL":
            return {
                ...state, userProduct: [...state.userProduct, {
                    time: getCurrentDateMinute(),
                    data: payload //productName
                }]
            }
        case "ADD_USER_REACTION_TO_AUDIT_TRAIL":
            return {
                ...state, userReaction: [...state.userReaction, {
                    time: getCurrentDateMinute(),
                    data: payload //reactionName
                }]
            }
        case "ADD_KEGG_MODULE_TO_AUDIT_TRAIL":
            return {
                ...state, keggModule: [...state.keggModule, {
                    time: getCurrentDateMinute(),
                    data: payload //moduleName
                }]
            }
        case "ADD_EC_NUMBERS_TO_AUDIT_TRAIL":
            return {
                ...state, ecNumbers: [...state.ecNumbers, {
                    time: getCurrentDateMinute(),
                    data: payload //moduleName
                }]
            }
        case "ADD_KO_NUMBERS_TO_AUDIT_TRAIL":
            return {
                ...state, kNumbers: [...state.kNumbers, {
                    time: getCurrentDateMinute(),
                    data: payload //moduleName
                }]
            }
        case "ADD_REACTION_NUMBERS_TO_AUDIT_TRAIL":
            return {
                ...state, reactionNumbers: [...state.reactionNumbers, {
                    time: getCurrentDateMinute(),
                    data: payload //moduleName
                }]
            }
        case "ADD_CSV_DOWNLOAD_TO_AUDIT_TRAIL":
            return {
                ...state, csv: [...state.csv, {
                    time: getCurrentDateMinute()
                }]
            }
        case "ADD_JSON_DOWNLOAD_TO_AUDIT_TRAIL":
            return {
                ...state, json: [...state.json, {
                    time: getCurrentDateMinute()
                }]
            }
        case "ADD_SBML_DOWNLOAD_TO_AUDIT_TRAIL":
            return {
                ...state, sbml: [...state.sbml, {
                    time: getCurrentDateMinute()
                }]
            }
        case "ADD_SVG_DOWNLOAD_TO_AUDIT_TRAIL":
            return {
                ...state, svg: [...state.svg, {
                    time: getCurrentDateMinute()
                }]
            }
        case "ADD_DATA_DOWNLOAD_TO_AUDIT_TRAIL":
            return {
                ...state, data: [...state.data, {
                    time: getCurrentDateMinute()
                }]
            }
        case "ADD_MATRIX_DOWNLOAD_TO_AUDIT_TRAIL":
            return {
                ...state, stoichiometricMatrix: [...state.stoichiometricMatrix, {
                    time: getCurrentDateMinute()
                }]
            }
        default:
            return state;
    }
}


const defaultState = {
    data: {//graph
        nodes: [],
        links: [],
    },
    chosenNode: "",//graphClick
    showInfo: false,//graphClick
    dataLinks: [],
    svgHeight: window.innerHeight * 0.8,
    moduleFileName: "",
    showDeleteModal: false,
    deleteNode: "",
    doubleClickNode: "",
    showStructure: false,
    showAbbreviations: false,
    abbreviation: {},
    abbreviations: [],
    abbreviationsObject: {},
    isModuleImport: false,
    isForceDisabled: true,
    showAbundantNodeConfig: false,
    abundantCompoundOptions: [],
    abundantCompound: "",
    abundantCompounds: [],
    isForwardDirection: true,
    moduleFileNameJson: "",
    moduleFileNameSbml: "",
    showPathwayTaxonomy: false,
    x: "",
    y: "",
    oldData: {nodes:[],links:[]},
    chosenCompound: {id:"", x:0,y:0, opacity:1, reversible: true,symbolType:"circle", color:"#FF8000"},
    showNodeCoordinatesModal: false,
     showMergeNodesModal : false,
    mergeNode:"",
    mergeNodes: [],
    mergeNodesName: "",
    nodeModificationModal: false,
    nodeSize: 150,
    compoundNodeColor: "#FF8000",
    fbaSolution: [],
}

export const graphReducer = (state = defaultState, action) => {
    const {type, payload} = action;
    switch (type) {
        case "SETDATA":
            return {...state, data: payload}
        case "SETSHOWINFO":
            return {...state, showInfo: payload}
        case "SETCHOSENNODE":
            return {...state, chosenNode: payload}
        case "SETCHOSENQUANTS":
            return {...state, chosenQuants: payload}
        case "SETDATALINKS":
            return {...state, dataLinks: payload}
        case "ADDSVGHEIGHT":
            return {...state, svgHeight: state.svgHeight + payload}
        case "REDUCESVGHEIGHT":
            return {...state, svgHeight: state.svgHeight - payload}
        case "SETMODULEFILENAME":
            return {...state, moduleFileName: payload}
        case "SETMODULEFILENAMEJSON":
            return {...state, moduleFileNameJson: payload}
        case "SETMODULEFILENAMESBML":
            return {...state, moduleFileNameSbml: payload}
        case "SWITCHDELETEMODAL":
            return {...state, showDeleteModal: !state.showDeleteModal}
        case "SETDELETENODE":
            return {...state, deleteNode: payload}
        case "SETDOUBLECLICKEDNODE":
            return {...state, doubleClickNode: payload}
        case "SWITCHSHOWSTRUCTURE":
            return {...state, showStructure: !state.showStructure}
        case "SWITCHSHOWABBREVIATIONS":
            return {...state, showAbbreviations: !state.showAbbreviations}
        case "SETABBREVIATION":
            return {...state, abbreviation: payload}
        case "ADDABBREVIATION":
            state.abbreviations.push(payload)
            return {...state, abbreviations: state.abbreviations}
        case "SETABBREVIATIONOBJECT":
            return {...state, abbreviationsObject: payload}
        case "SWITCHISMODULEIMPORT":
            return {...state, isModuleImport: !state.isModuleImport}
        case "SWITCHDISABLEFORCE":
            return {...state, isForceDisabled: !state.isForceDisabled}
        case "SWITCHSHOWABUNDANTNODECONFIG":
            return {...state, showAbundantNodeConfig: !state.showAbundantNodeConfig}
        case "SETABUNDANTCOMPOUND":
            return {...state, abundantCompound: payload}
        case "SETABUNDANTCOMPOUNDOPTIONS":
            return {...state, abundantCompoundOptions: payload}
        case "ADDABUNDANTCOMPOUND":
            return {...state, abundantCompounds: [...state.abundantCompounds, payload]}
        case "SPLICEABUNDANTCOMPOUNDS":
            state.abundantCompounds.splice(payload, 1)
            return {...state, abundantCompounds: state.abundantCompounds}
        case "SWITCHISFORWARDDIRECTION":
            return {...state, isForwardDirection: !state.isForwardDirection}
        case "SWITCHSHOWPATHWAYTAXONOMY":
            return {...state, showPathwayTaxonomy: !state.showPathwayTaxonomy}
        case "SETX":
            return {...state, x: payload}
        case "SETCHOSENCOMPOUND":
            return {...state, chosenCompound: payload}
        case "SETOLDDATA":
            return {...state, oldData: payload}
        case "SETY":
            return {...state, y: payload}
        case "SWITCHSHOWNODECOORDINATESMODAL":
            return {...state, showNodeCoordinatesModal: !state.showNodeCoordinatesModal}
        case "SWITCHSHOWMERGENODESMODAL":
            return {...state, showMergeNodesModal: !state.showMergeNodesModal}
        case "SETMERGENODE":
            return {...state, mergeNode: payload}
        case "ADDMERGENODE":
            return {...state, mergeNodes: [...state.mergeNodes, state.mergeNode], mergeNode: ""}
        case "SPLICEMERGENODES":
            return {...state, mergeNodes: state.mergeNodes.filter(node => node !== payload)}
        case "EMPTY_MERGE_NODES":
            return {...state, mergeNodes: []}
        case "SETMERGENODESNAME":
            return {...state, mergeNodesName: payload}
        case "SWITCH_NODE_MODIFICATION_MODAL":
            return {...state, nodeModificationModal: !state.nodeModificationModal}
        case"SET_NODE_SIZE":
            return {...state, nodeSize: payload}
        case "SET_COMPOUND_NODE_COLOR":
            return {...state, compoundNodeColor: payload}
        case "SET_FLUX":
            return {...state, fbaSolution: payload}
        default:
            return state;
    }
}

import {combineReducers} from "redux";
import {mpaProteinReducer} from "../MpaProteins";
import {specificReactionReducer} from "../SpecificReaction";
import {generalReducer} from "../General";
import {keggReactionReducer} from "../KeggReaction";
import {graphReducer} from "../Graph";
import {auditTrailReducer} from "../AuditTrail";
import {fileReducer} from "../Files";

export const allReducers = combineReducers({
    general: generalReducer,
    keggReaction: keggReactionReducer,
    graph: graphReducer,
    specificReaction: specificReactionReducer,
    mpaProteins: mpaProteinReducer,
    auditTrail: auditTrailReducer,
    files: fileReducer
})

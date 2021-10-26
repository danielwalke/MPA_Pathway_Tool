import {host, portNumber} from "./SystemSettings";

export const endpoint_fetchUUID = host + ":" + portNumber + "/keggcalculator/startJob";

export const endpoint_uploadMPAFile = host + ":" + portNumber + "/keggcalculator/csvMPA";

export const endpoint_uploadModuleFiles = host + ":" + portNumber + "/keggcalculator/csvModule";

export const endpoint_status = host + ":" + portNumber + "/keggcalculator/status";

export const endpoint_download_unmatched_proteins = host + ":" + portNumber + "/keggcalculator/downloadunmatchedproteins";

export const endpoint_download = host + ":" + portNumber + "/keggcalculator/download";

export const endpoint_getCompoundList = host + ":" + portNumber + "/keggcreator/compoundlist";

export const endpoint_getReactionAndProduct =  host + ":" + portNumber + "/keggcreator/reactiondatabysubstrate";
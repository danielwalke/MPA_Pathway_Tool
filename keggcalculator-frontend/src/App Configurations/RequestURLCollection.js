import {host, portNumber} from "./SystemSettings";

export const endpoint_fetchUUID = host + "/keggcalculator/startJob";

export const endpoint_uploadMPAFile = host +"/keggcalculator/csvMPA";

export const endpoint_uploadModuleFiles = host + "/keggcalculator/csvModule";

export const endpoint_status = host +"/keggcalculator/status";

export const endpoint_download_unmatched_proteins = host + "/keggcalculator/downloadunmatchedproteins";

export const endpoint_download = host +  "/keggcalculator/download";

export const endpoint_download_details = host +  "/keggcalculator/downloadDetails";

export const endpoint_getCompoundList = host +"/keggcreator/compoundlist";

export const endpoint_getReactionAndProduct = host +"/keggcreator/reactiondatabysubstrate";

export const endpoint_getTaxonomyIdList = host + "/keggcreator/taxonomyIdList";

export const endpoint_getReactionUrl = host + "/keggcreator/getreaction";

export const endpoint_getReactionsByEcList = host +"/keggcreator/getreactionlistbyeclist";

export const endpoint_getReactionsByKoList = host + "/keggcreator/getreactionlistbykolist";

export const endpoint_getModule = host + "/keggcreator/module";

export const endpoint_getReactionsBySubstrate = host +  "/keggcreator/reactiondatabysubstrate";

export const endpoint_getModuleList = host + "/keggcreator/modulelist";

export const endpoint_getEcNumberList = host +  "/keggcreator/ecnumberlist";

export const endpoint_getKoNumberList = host +  "/keggcreator/konumberlist";

export const endpoint_getReactionList = host +"/keggcreator/reactions";

export const endpoint_getTaxonomyList = host +  "/keggcreator/taxonomylist";

export const endpoint_TaxonomyById = host +  "/keggcreator/taxonomy";

export const endpoint_getTaxonomicNames = host +  "/keggcreator/taxonomicNames";

export const endpoint_getFilteredTaxonomicNames = host + "/keggcreator/filteredtaxonomicNames";

export const endpoint_getTaxonomicDetails = host +  "/keggcalculator/detailedContent";

export const endpoint_getDependencies = host + "/keggcreator/dependencies";

export const endpoint_uploadMantisFile = host + "/keggcreator/csvMantis";

export const endpoint_startMantis = host + "/keggcreator/startMantis";

export const endpoint_mantisJobStatus = host + "/keggcreator/statusMantis";

export const endpoint_downloadMantisResults = host + "/keggcreator/downloadMantis";

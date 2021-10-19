import {host, portNumber} from "./SystemSettings";

export const endpoint_fetchUUID = host + ":" + portNumber + "/keggcalculator/startJob";

export const endpoint_uploadMPAFile = host + ":" + portNumber + "/keggcalculator/csvMPA";

export const endpoint_uploadModuleFiles = host + ":" + portNumber + "/keggcalculator/csvModule";

export const endpoint_status = host + ":" + portNumber + "/keggcalculator/status";

export const endpoint_download_unmatched_proteins = host + ":" + portNumber + "/keggcalculator/downloadunmatchedproteins";

export const endpoint_download = host + ":" + portNumber + "/keggcalculator/download";

export const endpoint_download_details = host + ":" + portNumber + "/keggcalculator/downloadDetails";

export const endpoint_getCompoundList = host + ":" + portNumber + "/keggcreator/compoundlist";

export const endpoint_getReactionAndProduct = host + ":" + portNumber + "/keggcreator/reactiondatabysubstrate";

export const endpoint_getTaxonomyIdList = host + ":" + portNumber + "/keggcreator/taxonomyIdList";

export const endpoint_getReactionUrl = host + ":" + portNumber + "/keggcreator/getreaction";

export const endpoint_getReactionsByEcList = host + ":" + portNumber + "/keggcreator/getreactionlistbyeclist";

export const endpoint_getReactionsByKoList = host + ":" + portNumber + "/keggcreator/getreactionlistbykolist";

export const endpoint_getModule = host + ":" + portNumber + "/keggcreator/module";

export const endpoint_getReactionsBySubstrate = host + ":" + portNumber + "/keggcreator/reactiondatabysubstrate";

export const endpoint_getModuleList = host + ":" + portNumber + "/keggcreator/modulelist";

export const endpoint_getEcNumberList = host + ":" + portNumber + "/keggcreator/ecnumberlist";

export const endpoint_getKoNumberList = host + ":" + portNumber + "/keggcreator/konumberlist";

export const endpoint_getReactionList = host + ":" + portNumber + "/keggcreator/reactions";

export const endpoint_getTaxonomyList = host + ":" + portNumber + "/keggcreator/taxonomylist";

export const endpoint_TaxonomyById = host + ":" + portNumber + "/keggcreator/taxonomy";

export const endpoint_getTaxonomicNames = host + ":" + portNumber + "/keggcreator/taxonomicNames";

export const endpoint_getFilteredTaxonomicNames = host + ":" + portNumber + "/keggcreator/filteredtaxonomicNames";

export const endpoint_getTaxonomicDetails = host + ":" + portNumber + "/keggcalculator/detailedContent";

export const endpoint_getBiggCompoundList = host + ":" + portNumber + "/keggcreator/biggcompoundlist";

export const endpoint_getKegg2BiggCompoundList = host + ":" + portNumber + "/keggcreator/kegg2biggmap";

export const endpoint_getReactionsFromCompounds = host + ":" + portNumber + "/keggcreator/reactiondatabycompounds";

export const endpoint_getFilteredReactionNames = host + ":" + portNumber + "/keggcreator/filteredreactions";

export const endpoint_getBiggReactionNames = host + ":" + portNumber + "/keggcreator/getbiggreactions";

export const endpoint_getKeggReactionNames = host + ":" + portNumber + "/keggcreator/keggreactionsfromidandname";

export const endpoint_getFilteredEcNumberList = host + ":" + portNumber + "/keggcreator/filteredecnumberlist";

export const endpoint_getFilteredKNumberList = host + ":" + portNumber + "/keggcreator/filteredknumberlist";

export const endpoint_getFilteredCompoundList = host + ":" + portNumber + "/keggcreator/filteredcompoundlist";

export const endpoint_getFilteredBiggCompoundList = host + ":" + portNumber + "/keggcreator/filteredbiggcompoundlist";

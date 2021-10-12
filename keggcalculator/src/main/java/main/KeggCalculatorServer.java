package main;

import static spark.Spark.before;
import static spark.Spark.exception;
import static spark.Spark.get;
import static spark.Spark.options;
import static spark.Spark.port;
import static spark.Spark.post;
import static spark.Spark.staticFileLocation;
import static spark.Spark.webSocketIdleTimeoutMillis;

import java.io.File;
import java.util.HashMap;
import java.util.HashSet;

import bigg.model.BiggCompound;
import constants.KeggCalculatorConstants;
import model.KeggCompound;
import model.KeggDataObject;
import model.KeggECObject;
import model.KeggKOObject;
import model.KeggReaction;
import model.KeggReactionObject;
import rest.KeggHandleRequests;
import services.KeggCalculatorService;
import services.KeggCreatorService;

/**
 * 
 * starts Rest- server
 *
 */
public class KeggCalculatorServer {

	private KeggDataObject keggData;

	public void setKeggData(KeggDataObject keggData) {
		this.keggData = keggData;
	}

	// starts server
	public static void main(String[] args) {
		setupRESTServer();
	}

	// clones kegg- Data
	public synchronized KeggDataObject cloneKeggData() {
		return this.keggData.cloneData();
	}

	// REST- server
	public static void setupRESTServer() {

		// Calculator
		KeggCalculatorService calculator = new KeggCalculatorService();

		File dl = new File(KeggCalculatorConstants.DOWNLOAD_DIR);
		if (!dl.exists())
			dl.mkdir();
		File ul = new File(KeggCalculatorConstants.UPLOAD_DIR);
		if (!ul.exists())
			ul.mkdir();
		File tmp = new File(KeggCalculatorConstants.UPLOAD_TEMP_DIR);
		if (!tmp.exists())
			tmp.mkdir();

		// module- creator
		KeggCreatorService creator = new KeggCreatorService();
		creator.initRequestMap();
		creator.parseKeggData();
		creator.parseNcbiTaxonomy();

		File downloadDir = new File(KeggCalculatorConstants.DOWNLOAD_DIR + "modules/");
		if (!downloadDir.exists())
			downloadDir.mkdir();
		// TODO: put dist folder from angular project in the static folder, and test if
		// the website is available
		staticFileLocation("web");

		// is this enough to prevent timeouts?
		webSocketIdleTimeoutMillis(5 * 60 * 1000);

		// define the Port
		port(80);

		exception(Exception.class, (exception, request, response) -> {
			exception.printStackTrace();
		});

		// TODO: check, deals with access contro request headers (cors allow all)
		options("/*", (request, response) -> {
			String accessControlRequestHeaders = request.headers("Access-Control-Request-Headers");
			if (accessControlRequestHeaders != null) {
				response.header("Access-Control-Allow-Headers", accessControlRequestHeaders);
			}
			String accessControlRequestMethod = request.headers("Access-Control-Request-Method");
			if (accessControlRequestMethod != null) {
				response.header("Access-Control-Allow-Methods", accessControlRequestMethod);
			}
			return "OK";
		});

		before((request, response) -> response.header("Access-Control-Allow-Origin", "*"));

		// to test server health
		get("/hello", (req, res) -> "Hello World!!");

		/*
		 * Calculator endpoints
		 */

		post("/keggcalculator/startJob", (req, res) -> {
			creator.requestAccess.get("startJob").add(KeggCreatorService.getAccessDate());
			return KeggHandleRequests.startJob(req, res, calculator, creator);
		});

		post("/keggcalculator/csvMPA", (req, res) -> {
			creator.requestAccess.get("csvMPA").add(KeggCreatorService.getAccessDate());
			return KeggHandleRequests.handleCSVMPA(req, res, calculator, req.queryParams("jobid"));
		});

		post("/keggcalculator/csvModule", (req, res) -> {
			creator.requestAccess.get("csvModule").add(KeggCreatorService.getAccessDate());
			return KeggHandleRequests.handleCSVModule(req, res, calculator, req.queryParams("jobid"));
		});

		// the download link
		get("/keggcalculator/status", (req, res) -> {
			creator.requestAccess.get("status").add(KeggCreatorService.getAccessDate());
			return KeggHandleRequests.status(req, res, calculator, req.queryParams("jobid"));
		});
		
		

		get("/keggcalculator/download/:name", (req, res) -> {
			creator.requestAccess.get("download").add(KeggCreatorService.getAccessDate());
			// UUID jobID = UUID.fromString(req.queryParams("jobid"));
			return KeggHandleRequests.download(req, res, calculator, req.params("name"));
		});
		
		get("/keggcalculator/downloadDetails/:name", (req, res) -> {
			creator.requestAccess.get("downloadDetails").add(KeggCreatorService.getAccessDate());
			// UUID jobID = UUID.fromString(req.queryParams("jobid"));
			return KeggHandleRequests.downloadDetails(req, res, calculator, req.params("name"));
		});
		
		post("/keggcalculator/detailedContent", (req, res) -> {
			//TODO: Delete files
			creator.requestAccess.get("detailedContent").add(KeggCreatorService.getAccessDate());
			// UUID jobID = UUID.fromString(req.queryParams("jobid"));
			return KeggHandleRequests.getDetailedContent(req, res, calculator, req.queryParams("jobId"));
		});

		get("/keggcalculator/downloadunmatchedproteins/:name", (req, res) -> {
			creator.requestAccess.get("downloadunmatchedproteins").add(KeggCreatorService.getAccessDate());
			// UUID jobID = UUID.fromString(req.queryParams("jobid"));
			return KeggHandleRequests.downloadUnmatchedroteins(req, res, calculator, req.params("name"));
		});

		/*
		 * Module creator endpoints
		 */

		/**
		 * returns list of compounds
		 */
		get("/keggcreator/compoundlist", (req, res) -> {
			creator.requestAccess.get("compoundlist").add(KeggCreatorService.getAccessDate());
			try {
				HashSet<KeggCompound> substrateSet = creator.getSubstrateSet();
				res.status(201);
				return creator.gson.toJson(substrateSet);
			} catch (Exception e) {
				// this is an unexpected exception!
				res.status(500);
				return "{\"message\":\"internal server error\"}";
			}
		});
		
		/**
		 * returns list of bigg compounds
		 */
		get("/keggcreator/biggcompoundlist", (req, res) -> {
//			creator.requestAccess.get("biggcompoundlist").add(KeggCreatorService.getAccessDate());
			try {
				HashSet<BiggCompound> BiggSubstrateSet = creator.getBiggSubstrateSet();
				res.status(201);
				return creator.gson.toJson(BiggSubstrateSet);
			} catch (Exception e) {
				// this is an unexpected exception!
				res.status(500);
				return "{\"message\":\"internal server error\"}";
			}
		});
		
		get("/keggcreator/kegg2biggmap", (req, res) -> {
//			creator.requestAccess.get("biggcompoundlist").add(KeggCreatorService.getAccessDate());
			try {
				HashMap<String, HashMap<String, HashSet<String>>> BiggSubstrateSet = creator.getKegg2BiggCompoundMap();
				res.status(201);
				System.out.println("Hello");
				return creator.gson.toJson(BiggSubstrateSet);
			} catch (Exception e) {
				// this is an unexpected exception!
				res.status(500);
				return "{\"message\":\"internal server error\"}";
			}
		});

		/**
		 * returns list of modules in KEGG database
		 */
		get("/keggcreator/modulelist", (req, res) -> {
			try {
				creator.requestAccess.get("modulelist").add(KeggCreatorService.getAccessDate());
				HashSet<String> moduleSet = creator.getModuleSet();
				res.status(201);
				return creator.gson.toJson(moduleSet);
			} catch (Exception e) {
				// this is an unexpected exception!
				res.status(500);
				return "{\"message\":\"internal server error\"}";
			}
		});

		post("/keggcreator/module", (req, res) -> {
//			calculator.gson.fromJson(req.body(), KeggCalculatorJobJSON.class)
			// TODO: Exception handling --> compound not found
			// --> input: one compound (substrate)
			// --> output: all reactions/following products for this compound
			// --> transform to json
			// TODO: request input substrate, return all possible reactions and products
			try {
				creator.requestAccess.get("module").add(KeggCreatorService.getAccessDate());
				res.status(201);
				return KeggHandleRequests.getModuleFile(req, res, creator, req.queryParams("moduleId"));
			} catch (Exception e) {
				res.status(500);
				return "{\"message\":\"internal server error\"}";
			}
		});

		post("/keggcreator/reactiondatabysubstrate", (req, res) -> {
//			calculator.gson.fromJson(req.body(), KeggCalculatorJobJSON.class)
			// TODO: Exception handling --> compound not found
			// --> input: one compound (substrate)
			// --> output: all reactions/following products for this compound
			// --> transform to json
			// TODO: request input substrate, return all possible reactions and products
			try {
				creator.requestAccess.get("reactiondatabysubstrate").add(KeggCreatorService.getAccessDate());
				res.status(201);
				return KeggHandleRequests.reactionDataBySubstrate(req, res, creator, req.queryParams("substrateId"));
			} catch (Exception e) {
				res.status(500);
				return "{\"message\":\"internal server error\"}";
			}
		});
		
		post("/keggcreator/reactiondatabycompounds", (req, res) -> {
			try {
				System.out.println("yo");
				res.status(201);
				if (req.queryParams("compoundIds").length() == 0) {
					return "[]";
				} else {
					return KeggHandleRequests.reactionDataByCompounds(creator, req.queryParams("compoundIds"));

				}				
			} catch (Exception e) {
				res.status(500);
				return "{\"message\":\"internal server error\"}";
			}
		});

		/**
		 * returns pathway absed on given substrate and product -> incomplete
		 */
		post("/keggcreator/pathwaysearch", (req, res) -> {

			// TODO: Exception handling --> product/substrate not found
			// --> input: substrate+product
			// --> output: list of pathways (pathways need to be formatted like KeggCreator
			// input, ie as module)
			// --> csv or json??
//			Json that contains CSV files??
//			[
//			"pw1": "CSVCONTENT --> 1,2,3,4\nlala,2,43,\n"
//		    "pw2": ....
//		    ]
			// TODO: do pathway search, return pathways
			// TODO: filter list in case of too many pathways?
			// TODO: OR only return shortest pathway, shortest X pathways?
			try {
				res.status(201);
				return KeggHandleRequests.pathwaySearch(req, res, creator.cloneKeggData(),
						req.queryParams("substrateId"), req.queryParams("productId"));
			} catch (Exception e) {
				res.status(500);
				return "{\"message\":\"internal server error\"}";
			}
		});

		/**
		 * returns list of K-numbers
		 */
		get("/keggcreator/konumberlist", (req, res) -> {

			creator.requestAccess.get("konumberlist").add(KeggCreatorService.getAccessDate());
			try {
				HashSet<String> koSet = creator.getKoNumberSet();
				res.status(201);
				return creator.gson.toJson(koSet);
			} catch (Exception e) {
				// this is an unexpected exception!
				res.status(500);
				return "{\"message\":\"internal server error\"}";
			}
		});

		/**
		 * returns list of EC-numbers
		 */
		get("/keggcreator/ecnumberlist", (req, res) -> {
			try {
				creator.requestAccess.get("ecnumberlist").add(KeggCreatorService.getAccessDate());
				HashSet<String> ecSet = creator.getEcNumberSet();
				res.status(201);
				return creator.gson.toJson(ecSet);
			} catch (Exception e) {
				// this is an unexpected exception!
				res.status(500);
				return "{\"message\":\"internal server error\"}";
			}
		});
		
		get("/keggcreator/filteredecnumberlist", (req, res) -> {
			try {
//				creator.requestAccess.get("ecnumberlist").add(KeggCreatorService.getAccessDate());
				res.status(201);
				return KeggHandleRequests.getFilteredEcNumberList(creator, req.queryParams("reactionName"));
			} catch (Exception e) {
				// this is an unexpected exception!
				res.status(500);
				return "{\"message\":\"internal server error\"}";
			}
		});

		/**
		 * returns list of reactions associated with given EC- number 1.1.1.-
		 */
		post("/keggcreator/getreactionlistbyeclist", (req, res) -> {
			try {
				creator.requestAccess.get("getreactionlistbyeclist").add(KeggCreatorService.getAccessDate());
				return KeggHandleRequests.reactionlistbyec(req, res, creator, req.queryParams("ecNumbers"));
			} catch (Exception e) {
				// this is an unexpected exception!
				res.status(500);
				return "{\"message\":\"internal server error\"}";
			}
		});

		/**
		 * returns list of reactions associated with given K- number K00000
		 */
		post("/keggcreator/getreactionlistbykolist", (req, res) -> {
			try {
				creator.requestAccess.get("getreactionlistbykolist").add(KeggCreatorService.getAccessDate());
				return KeggHandleRequests.reactionlistbyko(req, res, creator, req.queryParams("koNumbers"));
			} catch (Exception e) {
				// this is an unexpected exception!
				res.status(500);
				return "{\"message\":\"internal server error\"}";
			}
		});

		/**
		 * returns reaction associated with given reaction- number R00000
		 */
		post("/keggcreator/getreaction", (req, res) -> {
			try {
				creator.requestAccess.get("getreaction").add(KeggCreatorService.getAccessDate());
				return KeggHandleRequests.getReaction(req, res, creator, req.queryParams("reactionId"));
			} catch (Exception e) {
				// this is an unexpected exception!
				res.status(500);
				return "{\"message\":\"internal server error\"}";
			}
		});

		get("/keggcreator/reactions", (req, res) -> {
			try {
				creator.requestAccess.get("reactions").add(KeggCreatorService.getAccessDate());
				res.status(201);
				HashSet<KeggReaction> reactions = new HashSet<>();
				for (KeggReactionObject reactionObject : creator.cloneKeggData().getReactions()) {
					KeggReaction reaction = reactionObject.toKeggReaction(reactionObject);
					reactions.add(reaction);
				}
				return creator.gson.toJson(reactions);
			} catch (Exception e) {
				// this is an unexpected exception!
				res.status(500);
				return "{\"message\":\"internal server error\"}";
			}
		});
		
		get("/keggcreator/keggreactionsfromidandname", (req,res) -> {
			try {
				return KeggHandleRequests.getKeggReactionsFromIdAndName(creator, req.queryParams("reactionString"));
			} catch (Exception e) {
				res.status(500);
				return "{\"message\":\"internal server error\"}";
			}
		});
		
		post("/keggcreator/filteredreactions", (req, res) -> {
			try {
				return KeggHandleRequests.getFilteredKeggReactions(creator, req.queryParams("name"));
			} catch (Exception e) {
				res.status(500);
				return "{\"message\":\"internal server error\"}";
			}
		});
		
		post("/keggcreator/filteredreactionids", (req, res) -> {
			try {
				return KeggHandleRequests.filteredKeggReactionIds(creator, req.queryParams("keggId"));
			} catch (Exception e) {
				res.status(500);
				return "{\"message\":\"internal server error\"}";
			}
		});
		
		post("/keggcreator/filteredbiggreactionids", (req, res) -> {
			// retrieves only bigg ids that are associated to kegg reactions			
			try {
				return KeggHandleRequests.filteredBiggReactionIds(creator, req.queryParams("biggId"));
			} catch (Exception e) {
				res.status(500);
				return "{\"message\":\"internal server error\"}";
			}
		}); 
		
		get("/keggcreator/getbiggreactions", (req,res) -> {
			try {
				return KeggHandleRequests.biggReactionIds(creator, req.queryParams("biggName"));
			} catch (Exception e) {
				res.status(500);
				return "{\"message\":\"internal server error\"}";
			}
		});

		/**
		 * returns list of existent taxa
		 */
		post("keggcreator/taxonomylist", (req, res) -> {
			try {
				creator.requestAccess.get("taxonomylist").add(KeggCreatorService.getAccessDate());
				res.status(201);
				return KeggHandleRequests.getTaxonomyList(creator);
			} catch (Exception e) {
				res.status(500);
				return "{\"message\":\"internal server error\"}";
			}
		});

		post("keggcreator/taxonomyId", (req, res) -> {
			try {
				creator.requestAccess.get("taxonomyId").add(KeggCreatorService.getAccessDate());
				res.status(201);
				return KeggHandleRequests.getTaxonomyId(creator, req.queryParams("name"), req.queryParams("rank"));
			} catch (Exception e) {
				res.status(500);
				return "{\"message\":\"internal server error\"}";
			}
		});

		post("keggcreator/taxonomy", (req, res) -> {
			try {
				creator.requestAccess.get("taxonomy").add(KeggCreatorService.getAccessDate());
				res.status(201);
				return KeggHandleRequests.getTaxonomy(creator, req.queryParams("id"));
			} catch (Exception e) {
				res.status(500);
				return "{\"message\":\"internal server error\"}";
			}
		});
		
		post("keggcreator/taxonomicNames", (req, res) -> {
			try {
				creator.requestAccess.get("taxonomy").add(KeggCreatorService.getAccessDate());
				res.status(201);
				return KeggHandleRequests.getTaxonomicNames(creator, req.queryParams("rank"));
			} catch (Exception e) {
				res.status(500);
				return "{\"message\":\"internal server error\"}";
			}
		});
		
		post("keggcreator/filteredtaxonomicNames", (req, res) -> {
			try {
				creator.requestAccess.get("taxonomy").add(KeggCreatorService.getAccessDate());
				res.status(201);
				return KeggHandleRequests.getFilteredTaxonomicNames(creator, req.queryParams("rank"),req.queryParams("subName"));
			} catch (Exception e) {
				res.status(500);
				return "{\"message\":\"internal server error\"}";
			}
		});

		// [{name:"", rank:""}]
		post("keggcreator/taxonomyIdList",(req, res)->{
    	try {
    		res.status(201);
    		return KeggHandleRequests.getTaxonomyIdList(creator, req.queryParams("taxonomyList"));
    	}catch(Exception e) {
    		res.status(500);
    		return "{\"message\":\"internal server error\"}";
    	}
    });

		/**
		 * method that returns a CSV file with all accessdates
		 */
		get("keggcreator/requestAccesscsv", (req, res) -> {
			try {
				return KeggHandleRequests.getRequestAccess(creator);
			} catch (Exception e) {
				res.status(500);
				return "{\"message\":\"internal server error\"}";
			}
		});
		
		
		/**
		 * return list of http://rest.kegg.jp/list/T01001
		 */
		get("keggcreator/getHsaEntities", (req, res) -> {
			try {
				return KeggHandleRequests.getHsaEntities(creator);
			} catch (Exception e) {
				res.status(500);
				return "{\"message\":\"internal server error\"}";
			}
		});
		
		/**
		 * returns list of random dummy values between -1000 and 1000 for each provided reaction
		 */
		
		post("fluxanalysis/fbaDummy", (req, res) -> {
			try {
				return KeggHandleRequests.getDummyFBA(creator, req.queryParams("dummyFBA"));
			} catch (Exception e) {
				res.status(500);
				e.printStackTrace();
				return "{\"message\":\"internal server error\"}";
			} 
		});
		
		post("fluxanalysis/fba", (req, res) -> {
			try {
				return KeggHandleRequests.getFBA(creator, req.queryParams("FBA"));
			} catch (Exception e) {
				res.status(500);
				e.printStackTrace();
				return "{\"message\":\"internal server error\"}";
			} 
		});
		
	}

}

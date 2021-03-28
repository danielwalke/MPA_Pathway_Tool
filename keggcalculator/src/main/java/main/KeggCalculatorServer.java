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

import constants.KeggCalculatorConstants;
import model.KeggCompound;
import model.KeggDataObject;
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

	//starts server
	public static void main(String[] args) {
		setupRESTServer();
	}

	//clones kegg- Data
	public synchronized KeggDataObject cloneKeggData() {
		return this.keggData.cloneData();
	}
	
	//REST- server
	public static void setupRESTServer() {
		
		//Calculator
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
		
		//module- creator
		KeggCreatorService creator = new KeggCreatorService();
		creator.parseKeggData();

		File downloadDir = new File(KeggCalculatorConstants.DOWNLOAD_DIR + "modules/");
		if (!downloadDir.exists())
			downloadDir.mkdir();
		// TODO: put dist folder	 from angular project in the static folder, and test if
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
			return KeggHandleRequests.startJob(req, res, calculator);
		});

		post("/keggcalculator/csvMPA", (req, res) -> {
			return KeggHandleRequests.handleCSVMPA(req, res, calculator, req.queryParams("jobid"));
		});

		post("/keggcalculator/csvModule", (req, res) -> {
			return KeggHandleRequests.handleCSVModule(req, res, calculator, req.queryParams("jobid"));
		});

		// the download link
		get("/keggcalculator/status", (req, res) -> {
			return KeggHandleRequests.status(req, res, calculator, req.queryParams("jobid"));
		});

		get("/keggcalculator/download/:name", (req, res) -> {
			// UUID jobID = UUID.fromString(req.queryParams("jobid"));
			return KeggHandleRequests.download(req, res, calculator, req.params("name"));
		});
		
		get("/keggcalculator/downloadunmatchedproteins/:name", (req, res) -> {
			// UUID jobID = UUID.fromString(req.queryParams("jobid"));
			return KeggHandleRequests.downloadUnmatchedroteins(req, res, calculator, req.params("name"));
		});

		/*
		 * Module creator endpoints
		 */
		get("/keggcreator/compoundlist", (req, res) -> {
			try {
				// TODO: Exception handling --> compound not found
				// --> input: nothing
				// --> output: full curated compound list (exclude 00-20, exclude glycans?)
				// --> transform to json
				// TODO: return a list of all compounds (exclude 00-20, without glycans?)
				HashSet<KeggCompound> substrateSet = creator.getSubstrateSet();
				res.status(201);
				return creator.gson.toJson(substrateSet);
			} catch (Exception e) {
				// this is an unexpected exception!
				res.status(500);
				return "{\"message\":\"internal server error\"}";
			}
		});

		get("/keggcreator/modulelist", (req, res) -> {
			try {
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
				res.status(201);
				return KeggHandleRequests.reactionDataBySubstrate(req, res, creator, req.queryParams("substrateId"));
			} catch (Exception e) {
				res.status(500);
				return "{\"message\":\"internal server error\"}";
			}
		});

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
				return KeggHandleRequests.pathwaySearch(req, res, creator.cloneKeggData(), req.queryParams("substrateId"),
						req.queryParams("productId"));
			} catch (Exception e) {
				res.status(500);
				return "{\"message\":\"internal server error\"}";
			}
		});
		
		get("/keggcreator/konumberlist", (req, res) -> {
            try {
                    // TODO: Exception handling --> compound not found
                    // --> input: nothing
                    // --> output: full curated compound list (exclude 00-20, exclude glycans?)
                    // --> transform to json
                    // TODO: return a list of all compounds (exclude 00-20, without glycans?)
                    HashSet<String> koSet = creator.getKoNumberSet();
                    res.status(201);
                    return creator.gson.toJson(koSet);
            } catch (Exception e) {
                    // this is an unexpected exception!
                    res.status(500);
                    return "{\"message\":\"internal server error\"}";
            }
    });

    get("/keggcreator/ecnumberlist", (req, res) -> {
            try {
                    // TODO: Exception handling --> compound not found
                    // --> input: nothing
                    // --> output: full curated compound list (exclude 00-20, exclude glycans?)
                    // --> transform to json
                    // TODO: return a list of all compounds (exclude 00-20, without glycans?)
                    HashSet<String> ecSet = creator.getEcNumberSet();
                    res.status(201);
                    return creator.gson.toJson(ecSet);
            } catch (Exception e) {
                    // this is an unexpected exception!
                    res.status(500);
                    return "{\"message\":\"internal server error\"}";
            }
    });

    post("/keggcreator/getreactionlistbyeclist", (req, res) -> {
            try {
            	return KeggHandleRequests.reactionlistbyec(req, res, creator, req.queryParams("ecNumbers"));
            } catch (Exception e) {
                    // this is an unexpected exception!
                    res.status(500);
                    return "{\"message\":\"internal server error\"}";
            }
    });
    
    post("/keggcreator/getreactionlistbykolist", (req, res) -> {
        try {
        	return KeggHandleRequests.reactionlistbyko(req, res, creator, req.queryParams("koNumbers"));
        } catch (Exception e) {
                // this is an unexpected exception!
                res.status(500);
                return "{\"message\":\"internal server error\"}";
        }
});

    post("/keggcreator/getreaction", (req, res) -> {
            try {
                    return KeggHandleRequests.getReaction(req, res, creator, req.queryParams("reactionId"));
            } catch (Exception e) {
                    // this is an unexpected exception!
                    res.status(500);
                    return "{\"message\":\"internal server error\"}";
            }
    });


	}

}

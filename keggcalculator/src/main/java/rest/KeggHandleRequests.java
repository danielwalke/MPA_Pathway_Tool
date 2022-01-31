package rest;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.UUID;
import java.util.Map.Entry;
import java.util.regex.Matcher;	
import java.util.regex.Pattern;

import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonSyntaxException;

import constants.KeggCalculatorConstants;
import fluxanalysis.DummyFBAArray;
import fluxanalysis.DummyFBAResponseObj;
import fluxanalysis.DummyFBAMain;
import json.FbaJobJson;
import json.KeggCalculatorJobJSON;
import json.KeggCreatorJobJSON;
import model.KeggDataObject;
import model.KeggECObject;
import model.KeggHsaObject;
import model.KeggKOObject;
import model.KeggReaction;
import model.KeggReactionObject;
import model.SortedReactions;
import model.TaxonomyList;
import model.TaxonomyListObject;
import model.testparser.PathwayFinder;
import model.testparser.PathwayFinderReverse;
import parser.PomXmlParser;
import services.FbaService;
import services.KeggCalculatorService;
import services.KeggCreatorService;
import spark.Request;
import spark.Response;
import model.TaxonomyNcbi;
import model.TaxonomyResponseListObj;

/**
 * handles requests for REST- server
 * 
 *
 */
public class KeggHandleRequests {

	// handles requests from calculator
	// starts calculator- generates user specific UUID, waits and process thread
	public static String startJob(Request req, Response res, KeggCalculatorService calculator, KeggCreatorService creator) {
		// parse JSON object
		try {
			KeggCalculatorJobJSON jobObject = calculator.gson.fromJson(req.body(), KeggCalculatorJobJSON.class);
			// generate new job ID
			jobObject.jobID = UUID.randomUUID().toString();
			calculator.currentJobs.put(jobObject.jobID, jobObject);
			File jobDir = new File("upload/" + jobObject.jobID);
			if (!jobDir.exists())
				jobDir.mkdir();
			File moduleDir = new File("upload/" + jobObject.jobID + "/modules/");
			if (!moduleDir.exists())
				moduleDir.mkdir();
			// create job thread
			calculator.submitJob(jobObject.jobID);
			// return job with new jobID
			return calculator.gson.toJson(jobObject);
		} catch (JsonSyntaxException e) {
			return "{\"message\":\"malformed json\"}";
		} catch (Exception e) {
			return "{\"message\":\"unknown error\"}";
		}

	}
	
	public static String startFbaJob(FbaService fba, Request req, Response res) {
		try {
			System.out.println(req.body());
			FbaJobJson fbaJobObject = fba.gson.fromJson(req.body(), FbaJobJson.class);
			
			fbaJobObject.jobId = UUID.randomUUID().toString();
			
			fba.currentFbaJobs.put(fbaJobObject.jobId, fbaJobObject);
			File fbaJobDir = new File(KeggCalculatorConstants.UPLOAD_DIR + fbaJobObject.jobId);
			
			if (!fbaJobDir.exists()) {
				fbaJobDir.mkdir();
			}
			
			fba.submitJob(fbaJobObject.jobId);
			
			return fba.gson.toJson(fbaJobObject);
		} catch (JsonSyntaxException e) {
			System.out.println("malformed json");
			return "{\"message\":\"malformed json\"}";
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println("unknown error");
			return "{\"message\":\"unknown error\"}";
		}
	}

	// handles csv-file from MetaProteomeAnalyzer, upload
	public static String handleCSVMPA(Request req, Response res, KeggCalculatorService calculator, String jobID) {
		if (calculator.getJobObject(jobID) != null) {
			// receive upload
			String sourceFileName = calculator.receiveUpload(req,
					KeggCalculatorConstants.UPLOAD_DIR + "/" + jobID + "/");
			return "{\"message\": \"upload successful: " + sourceFileName + "\"}";
		} else {
			return "{\"message\": \"upload rejected, not a valid job\"}";
		}
	}

	// handles csv-module-file from user, upload
	public static String handleCSVModule(Request req, Response res, KeggCalculatorService calculator, String jobID) {

		if (calculator.getJobObject(jobID) != null) {
			// receive upload
			String sourceFileName = calculator.receiveUpload(req,
					KeggCalculatorConstants.UPLOAD_DIR + "/" + jobID + "/modules/");
			return "{\"message\": \"upload successful: " + sourceFileName + "\"}";
		} else {
			return "{\"message\": \"upload rejected, not a valid job\"}";
		}
	}

	// handles status about uploaded files
	public static String status(Request req, Response res, KeggCalculatorService calculator, String jobID) {
		if (calculator.getJobObject(jobID) != null) {
			return calculator.gson.toJson(calculator.getJobObject(jobID));
		} else {
			return "{\"message\": \"not a valid job\"}";
		}
	}

	// handles download of output-csv-file
	public static HttpServletResponse download(Request req, Response res, KeggCalculatorService calculator,
			String jobID) {
		return calculator.getDownload(req, res, jobID);
	}
	
	// handles download of output-csv-file
	public static HttpServletResponse downloadDetails(Request req, Response res, KeggCalculatorService calculator,
			String jobID) {
		return calculator.getDownloadDetails(req, res, jobID);
	}
	
	// handles download of output-csv-file
	public static String getDetailedContent(Request req, Response res, KeggCalculatorService calculator,
			String jobID) throws IOException {
		return calculator.getDetailedContent(req, res, jobID);
	}
	

	// handles download of output-csv-file
	public static HttpServletResponse downloadUnmatchedroteins(Request req, Response res, KeggCalculatorService calculator,
			String jobID) {
		return calculator.getDownloadUnmatchedProteins(req, res, jobID);
	}

	// handles requests from creator
	// input: a specific substrate ID, returns a list of reactions (unsorted,
	// product-sorted)
	public static Object reactionDataBySubstrate(Request req, Response res, KeggCreatorService creator,
			String substrateId) {
		KeggCreatorJobJSON json = new KeggCreatorJobJSON();
		KeggDataObject keggData = creator.cloneKeggData();
		if (keggData.getCompound(substrateId) == null) {
			res.status(400);
			return "{\"message\": \"not a valid Substrate- ID\"}";
		} else if (keggData.getCompound(substrateId).getReactions() == null) {
			res.status(404);
			return "{\"message\": \"no reaction for this substrate- ID found\"}";
		} else {
			HashSet<KeggReaction> reactionSet = creator.getReactionSet(substrateId);
			HashSet<KeggReaction> reactionSetRev = creator.getReactionSetReverse(substrateId);
			HashSet<SortedReactions> productSortedReactions = creator.getProductSortedReactions(substrateId);
			HashSet<SortedReactions> productSortedReactionsRev = creator.getProductSortedReactionsReverse(substrateId);
//			json.reactionSet = reactionSet;
			json.productSortedReactions = productSortedReactions;
//			json.reactionSetRev = reactionSetRev;
			json.productSortedReactionsRev = productSortedReactionsRev;
			Gson gson = new GsonBuilder().setPrettyPrinting().create();
			res.status(201);
			return gson.toJson(json);
		}
	}

	// searches all pathways between two given compounds
	public static Object pathwaySearch(Request req, Response res, KeggDataObject keggData, String substrateId,
			String productId) {
		if (keggData.getCompound(substrateId) == null) {
			res.status(400);
			return "{\"message\": \"not a valid Substrate- ID\"}";
		} else if (keggData.getCompound(productId) == null) {
			res.status(400);
			return "{\"message\": \"not a valid product- ID\"}";
		} else {
			PathwayFinder pathwayFinder = new PathwayFinder(keggData, substrateId, productId);
			pathwayFinder.findPathways();
			ArrayList<String> csvContentList = pathwayFinder.getCsvContentList();
			PathwayFinderReverse pathwayFinderRev = new PathwayFinderReverse(keggData, substrateId, productId);
			pathwayFinderRev.findPathways();
			ArrayList<String> csvContentListRev = pathwayFinderRev.getCsvContentList();
			ArrayList<String> csvContentListComp = new ArrayList<String>();
			csvContentListComp.addAll(csvContentList);
			csvContentListComp.addAll(csvContentListRev);
			if (csvContentListComp.isEmpty()) {
				res.status(404);
				return "{\"message\": \"no pathway found\"}";
			} else {
				res.status(201);
				Gson gson = new GsonBuilder().setPrettyPrinting().create();
				return gson.toJson(csvContentListComp);
			}
		}
	}

	

	public static String getModuleFile(Request req, Response res, KeggCreatorService creator, String moduleId) {
		String outputString = creator.getModuleFile(creator, moduleId);
		try {
			BufferedWriter br = new BufferedWriter(new FileWriter(new File("src/main/resources/Methanogenese.csv")));
			br.write(outputString.trim());
			br.flush();
			br.close();
		} catch (Exception e) {

		}
		return outputString;
	}
	
	public static Object reactionlistbyec(Request req, Response res, KeggCreatorService creator,
			String ecNumbers) {
		   String ecNumbersString = ecNumbers.trim();
           HashSet<String> ecSet = new HashSet<>();
           HashSet<String> ecExceptionSet = new HashSet<>();
           Pattern pat = Pattern.compile("\\d\\.\\d*\\.\\d*\\.\\d\\d*");
           Pattern exceptionPat = Pattern.compile("\\d\\.\\d*\\.\\d*\\.-");
           Matcher matcher = pat.matcher(ecNumbers);
           Matcher exceptionMatcher = exceptionPat.matcher(ecNumbers);
           while(matcher.find()) {
           	ecSet.add(matcher.group());
           }
           while(exceptionMatcher.find()) {
        	   ecExceptionSet.add(exceptionMatcher.group().split("-")[0]); //takes this first part of incomplete Ec- like: 3.2.1.- -> 3.2.1.
           }
           HashMap<String, HashSet<String>> ecMap = creator.getEcNumberMap(ecSet);
           HashMap<String, HashSet<String>> ecMapExc = creator.getEcNumberMapException(ecExceptionSet);
           for(Entry<String, HashSet<String>> entry : ecMap.entrySet()) {
        	   ecMapExc.put(entry.getKey(), entry.getValue());
           }
           res.status(201);
           return creator.gson.toJson(ecMapExc);
		}
	
	public static Object reactionlistbyko(Request req, Response res, KeggCreatorService creator,
			String koNumbers) {
		   String koNumbersString = koNumbers.trim();
           HashSet<String> koSet = new HashSet<>();
           String[] koNumbersEnrties = koNumbers.split("\n");
           for(String ko : koNumbersEnrties) {
        	   koSet.add(ko);
           }
           HashMap<String, HashSet<String>> koMap = creator.getKoNumberMap(koSet);
           res.status(201);
           return creator.gson.toJson(koMap);
		}
	
	public static Object getReaction(Request req, Response res, KeggCreatorService creator,
			String reactionId) {
        KeggDataObject keggData = creator.cloneKeggData();
        res.status(201);
        KeggReactionObject reactionObject = keggData.getReaction(reactionId);
        KeggReaction reaction = new KeggReaction(reactionObject.getReactionId(), reactionObject.getReactionName(), reactionObject.isForwardReaction());
        for(KeggECObject ec : reactionObject.getEcnumbers()) {
        	reaction.addEcNumberString(ec.getEcId());
        }
        for(KeggKOObject ko : reactionObject.getKonumbers()) {
        	reaction.addKONumberString(ko.getKoId());
        }
        reaction.setStochiometrySubstratesString(reactionObject.getStochiometrySubstrates());
        reaction.setStochiometryProductsString(reactionObject.getStochiometryProducts());
	return creator.gson.toJson(reaction);
		}
	
	
	/**
	 * @param creator	service for the creator
	 * @return list of all taxonomy stored on ncbi
	 */
	public static String getTaxonomyList(KeggCreatorService creator){
		Gson gson = creator.gson;
		return gson.toJson(creator.getTaxonomyList());
	}

	public static String getTaxonomyId(KeggCreatorService creator, String taxonomicName, String taxonomicRank) {
		String id = creator.getTaxonomyId(taxonomicName, taxonomicRank);
		return id;
	}

	public static String getTaxonomyIdList(KeggCreatorService creator, String taxonomyList) {
		TaxonomyList taxonomyObject = creator.gson.fromJson(taxonomyList, TaxonomyList.class);
		ArrayList<TaxonomyResponseListObj> ids = creator.getTaxonomyIdList(taxonomyObject);
		return creator.gson.toJson(ids);
	}

	public static Object getTaxonomy(KeggCreatorService creator, String id) {
		Gson gson = creator.gson;
		System.out.println(id);
		System.out.println(creator.getTaxonomy(id));
		return gson.toJson(creator.getTaxonomy(id));
	}

	public static String getRequestAccess(KeggCreatorService creator) {
		creator.getRequestAccess();
		return "saves request access as CSV";
	}

	public static Object getHsaEntities(KeggCreatorService creator) {
		HashSet<KeggHsaObject> hsaEntities = creator.cloneKeggData().getHsaEntities();
		return creator.gson.toJson(hsaEntities);
	}

	public static String getDummyFBA(KeggCreatorService creator, String reactionsString) {
		DummyFBAMain reactionsArray = creator.gson.fromJson(reactionsString, DummyFBAMain.class);
		ArrayList<DummyFBAResponseObj> results = creator.getDummyFBA(reactionsArray.getDummyFBAMain());
		return creator.gson.toJson(results);
	}

	public static Object getTaxonomicNames(KeggCreatorService creator, String rank) {
		return creator.gson.toJson(creator.getTaxonomicNames(rank));
	}

	public static Object getFilteredTaxonomicNames(KeggCreatorService creator, String rank,
			String subName) {
		return creator.gson.toJson(creator.getFilteredTaxonomicNames(rank, subName));
	}

	public static Object getFilteredKeggReactions(KeggCreatorService creator, String nameInput) {
		return creator.gson.toJson(creator.filteredKeggReactions(nameInput));
	}

	public static Object reactionDataByCompounds(KeggCreatorService creator, String compoundIds) {
		return creator.gson.toJson(creator.getReactionDataByCompounds(compoundIds));
	}

	public static Object filteredKeggReactionIds(KeggCreatorService creator, String keggId) {
		return creator.gson.toJson(creator.filteredKeggReactionIds(keggId));
	}

	public static Object filteredBiggReactionIds(KeggCreatorService creator, String biggId) {
		return creator.gson.toJson(creator.getfilteredBiggReactionIds(biggId));
	}

	public static Object biggReactionIds(KeggCreatorService creator, String biggName) {
		return creator.gson.toJson(creator.getBiggReactionIds(biggName));
	}

	public static Object getKeggReactionsFromIdAndName(KeggCreatorService creator, String reactionString) {
		return creator.gson.toJson(creator.keggReactionFromIdAndName(reactionString));
	}

	public static Object getFilteredEcNumberList(KeggCreatorService creator, String reactionString) {
		return creator.gson.toJson(creator.filteredEcNumberList(reactionString));
	}

	public static Object getFilteredKNumberSet(KeggCreatorService creator, String reactionString) {
		return creator.gson.toJson(creator.filteredKNumberSet(reactionString));
	}

	public static Object getFilteredKeggCompoundsSet(KeggCreatorService creator, String compoundString) {
		return creator.gson.toJson(creator.filteredKeggCompoundSet(compoundString));
	}
	
	public static Object getFilteredBiggIdSet(KeggCreatorService creator, String compoundString) {
		return creator.gson.toJson(creator.filteredBiggIdSet(compoundString));
	}

	public static Object readPomXml(KeggCreatorService creator) {
		PomXmlParser parser = new PomXmlParser();
		HashSet<String> dependencies = new HashSet<>();
		try {
			dependencies = parser.readPomXml();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		HashMap<String, String> dependencyMap = parser.readDependencies(dependencies);
		return creator.gson.toJson(dependencyMap);
	}
	
	public static String handleNetworkUpload(Request req, Response res, FbaService fba, String jobId) {
		System.out.println(fba.getJobObject(jobId));
		if (fba.getJobObject(jobId) != null) {
			String sourceFileName = fba.writeUploadedNetwork(
					req, KeggCalculatorConstants.UPLOAD_DIR, jobId);
			return "{\"message\": \"upload successful: " + sourceFileName + "\"}";
		} else {
			return "{\"message\": \"upload rejected, not a valid job\"}";
		}
	}
	
	public static String fbaStatus(Request req, Response res, FbaService fba, String jobId) {
		if (fba.getJobObject(jobId) != null) {
			return fba.gson.toJson(fba.getJobObject(jobId));
		} else {
			return "{\"message\": \"not a valid job\"}";
		}
	}
	
	public static HttpServletResponse downloadSMomentModel(Request req, Response res, FbaService fluxAnalysis,
			String jobID) {
		return fluxAnalysis.getSMomentDownload(req, res, jobID);
	}

}

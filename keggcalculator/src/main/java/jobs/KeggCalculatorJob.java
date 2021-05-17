package jobs;

import java.io.File;
import java.util.ArrayList;

import calculator.CalculatorOutput;
import calculator.CalculatorOutputList;
import constants.KeggCalculatorConstants;
import json.KeggCalculatorJobJSON;
import model.KeggDataObject;
import model.KeggModuleObject;
import model.KeggReactionObject;
import model.MpaProtein;
import model.MpaProteine;
import parser.Calculator2;
import parser.KeggDataParser;
import parser.ModuleFileParser;
import parser.MpaFileParser2;

/**
 * executes each job for KeggCalculator
 * waits for uploaded files
 * starts calculator and exports output file
 * returns message about actual status 
 * @author Daniel
 *
 */
public class KeggCalculatorJob implements Runnable {
	
	private KeggCalculatorJobJSON job;
	
	public KeggCalculatorJob(KeggCalculatorJobJSON job) {
		this.job = job;
		this.job.message = "created";
	}

	@Override
	public void run() {
		System.out.println("Job started");
		this.job.message = "started";
		// timeout counter
		int count = 0;
		// wait for files
		while (true) {
			boolean mpacsvUploaded = false;
			boolean modulecsvsUploaded = false;
			// check MPA csv file
			File mpaFile = new File("upload/" + this.job.jobID + "/" + this.job.mpaCSVFile);
			if (mpaFile.exists())
				mpacsvUploaded = true;
			// check list of Module Files
			for (String mfile : this.job.moduleFiles) {
				File moduleFile = new File("upload/" + this.job.jobID + "/modules/" + mfile);
				if (moduleFile.exists()) {
					modulecsvsUploaded = true;
				} else {
					modulecsvsUploaded = false;
					break;
				}
			}
			// can we start?
			if (mpacsvUploaded && modulecsvsUploaded) {
				break;
			}
			if (count > 2000) {
				break;
			}
			// wait a bit
			try {
				Thread.sleep(100);
			} catch (Exception e) {
				e.printStackTrace();
			}
			count++;
		}
		// start calculator
		// TODO: make this configurable
		try {
			KeggDataObject keggData = new KeggDataObject();
			KeggDataParser.parseModule2ModuleName(keggData, KeggCalculatorConstants.MODULE_LIST_DIR);
			KeggDataParser.parseReaction2ReactionName(keggData, KeggCalculatorConstants.REACTION_LIST_DIR);
			KeggDataParser.parseKo2KoName(keggData, KeggCalculatorConstants.KO_NUMBER_LIST_DIR);
			KeggDataParser.parseEc2EcName(keggData, KeggCalculatorConstants.EC_NUMBER_LIST_DIR);
			KeggDataParser.parseCompound2CompoundName(keggData, KeggCalculatorConstants.COMPOUND_NUMBER_LIST_DIR);
			KeggDataParser.parseGlycan2GlycanName(keggData, KeggCalculatorConstants.GLYCAN_NUMBER_LIST_DIR);
			KeggDataParser.parseModule2Reaction(keggData, KeggCalculatorConstants.MODULE_TO_REACTION_DIR);
			KeggDataParser.parseModule2KoNumber(keggData, KeggCalculatorConstants.MODULE_TO_KO_NUMBER_DIR);
			KeggDataParser.parseModule2EcNumber(keggData, KeggCalculatorConstants.MODULE_TO_EC_NUMBER_DIR);
			KeggDataParser.parseModule2Compounds(keggData, KeggCalculatorConstants.MODULE_TO_COMPOUND_DIR);
			KeggDataParser.parseModule2Glycans(keggData, KeggCalculatorConstants.MODULE_TO_GLYCAN_DIR);
			KeggDataParser.parseKo2Reactions(keggData, KeggCalculatorConstants.KO_TO_REACTION_DIR);
			KeggDataParser.parseEc2Reaction(keggData, KeggCalculatorConstants.EC_TO_REACTION_DIR);
			KeggDataParser.parseSubstrate2Reaction(keggData, KeggCalculatorConstants.SUBSTRATE_TO_REACTION_DIR);
			KeggDataParser.parseProduct2Reaction(keggData, KeggCalculatorConstants.PRODUCT_TO_REACTION_DIR);
			KeggDataParser.parseKo2EcNumber(keggData, KeggCalculatorConstants.KO_TO_EC_DIR);
			KeggDataObject keggDataUser = new KeggDataObject();
			ModuleFileParser moduleFileparser = new ModuleFileParser();
			//read new example module file
			File moduleFolder = new File(KeggCalculatorConstants.UPLOAD_DIR + this.job.jobID + "/modules/");
			for(File moduleFiles : moduleFolder.listFiles()) {
				moduleFileparser.addFile(moduleFiles.toString());
			}			
			moduleFileparser.parseModuleFile(keggDataUser);
			//read example mpa file
			String mpaFileName ="upload/" + this.job.jobID + "/" + this.job.mpaCSVFile;
			//starts Calculator2
			CalculatorOutputList outputList = new CalculatorOutputList();
			MpaProteine proteins = new MpaProteine(mpaFileName);
			MpaFileParser2.parseMpaFile(proteins, mpaFileName, outputList);
			Calculator2 calc = new Calculator2();
			calc.loopModules(keggData, keggDataUser, proteins, outputList);
			
			//write output-file
			outputList.writeCSV(new File(KeggCalculatorConstants.DOWNLOAD_DIR + this.job.jobID + ".csv"));
			outputList.writeCSVUnmatchedProteins(new File(KeggCalculatorConstants.DOWNLOAD_DIR + this.job.jobID + "_unmatchedProteins" + ".csv"));
			
			//old calculator
//			ModuleLoop loop = new ModuleLoop();
//			loop.addModuleFiles(KeggCalculatorConstants.UPLOAD_DIR + this.job.jobID + "/modules/");
//			loop.addModuleFiles("src/main/resources/keggdefaultmodules/");
//			loop.setMpaFile("upload/" + this.job.jobID + "/" + this.job.mpaCSVFile);
//			loop.loopModules();
//			loop.getCalcOutputList().writeCSV(new File(KeggCalculatorConstants.DOWNLOAD_DIR + this.job.jobID + ".csv"));
			System.out.println("Done");
			
			// TODO: handle output
			this.job.message = "finished";
			// outputFile should go to --> "download/outputfile.csv"
			
			
		} catch (Exception e) {
			e.printStackTrace();
			this.job.message = "failed";
			this.job.downloadLink = null;
		}
		if (this.job.message.equals("finished")) {
			// wrap up
			this.job.downloadLink = KeggCalculatorConstants.WEB_URL + "/keggcalculator/download/" + this.job.jobID;
			this.job.downloadLinkUnmatchedProteinFile = KeggCalculatorConstants.WEB_URL + "/keggcalculator/download/unmatchedproteins/" + this.job.jobID;
			// TODO
			// delete files
			// copy results to appropriate place
			System.out.println("job finished");
			
			// result expiration? --> after 24h
			//delete files
			try {
				Thread.sleep(1000*60*60*24*7); //wait one week -> then delete all files
				deleteFiles(this.job.jobID);
				System.out.println("files deleted");
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			
		}
	}

	private void deleteFiles(String jobID) {
		String downloadDir = "download/";
		String uploadDir = "upload/";
		ArrayList<String> filePaths = new ArrayList<>();
		listFilesForFolder(new File(downloadDir), filePaths, jobID);
		listFilesForFolder(new File(uploadDir), filePaths, jobID);
		for(String filePath : filePaths) {
			File file = new File(filePath);
			System.out.println(file.getName() + "\t" + "deleted");
			file.delete();
		}
	}
	
	public static void listFilesForFolder(File folder, ArrayList<String> filePaths, String jobId) {
	    for (final File fileEntry : folder.listFiles()) {
	        if (fileEntry.isDirectory()) {
	       
	            listFilesForFolder(fileEntry, filePaths, jobId);
	        } else {
		    	String fileName = fileEntry.getName();
		    	String[] fileNameEnt = fileName.split("\\.");
		    	if(fileEntry.getAbsolutePath().contains(jobId)) { //if file or directory contains UUID -> add files 
		    		filePaths.add(fileEntry.getAbsolutePath());	
		    	}
	            
	        }
	    }
	}

}

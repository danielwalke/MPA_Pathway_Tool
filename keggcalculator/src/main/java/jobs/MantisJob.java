package jobs;

import java.io.File;

import calculator.Calculator2;
import calculator.CalculatorOutputList;
import constants.KeggCalculatorConstants;
import json.KeggCalculatorJobJSON;
import json.MantisJobJson;
import model.KeggDataObject;
import model.MpaProteine;
import parser.KeggDataParser;
import parser.MantisParser;
import parser.ModuleFileParser;
import parser.MpaFileParser2;

public class MantisJob implements Runnable{

	private MantisJobJson job;
	
	public MantisJob(MantisJobJson job) {
		this.job = job;
		this.job.message = "created";
	}

	@Override
	public void run() {
		this.job.message = "started";
		System.out.println("Mantis job started");
		// timeout counter
		int count = 0;
		// wait for files
		while (true) {
			boolean mantisUpload = false;
			// check MPA csv file
			File mantisFile = new File("upload/" + this.job.jobID + "/" + this.job.mantisFile);
			if (mantisFile.exists())
				mantisUpload = true;
			// can we start?
			if (mantisUpload) {
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
		try {
			//read input file here
			String mantisFileName ="upload/" + this.job.jobID + "/" + this.job.mantisFile;
			MantisParser.readInputFile(mantisFileName);
			
			//send input file to mantis here
			
			//write output-file for mantis
	
			
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
			System.out.println("job finished");			
		}
	}
}

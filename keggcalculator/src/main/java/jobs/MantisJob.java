package jobs;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Arrays;
import java.util.List;

import constants.KeggCalculatorConstants;
import json.MantisJobJson;
import mantis.MantisFile;
import mantis.MantisParser;
import mantis.MantisProtein;

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
			MantisFile file = new MantisFile();
			file.setFileName(mantisFileName);
			String mantisFastaFile = "upload/" + this.job.jobID + "/" + this.job.mantisFile + "_fasta.faa";
			file.setFastaFilePath(mantisFastaFile);
			MantisParser.readFile(file);
			System.out.println("User file read");
			
			//write fast file for mantis
			MantisParser.writeFastaFile(file);
			for(MantisProtein protein : file.getMantisProteins()) {
				System.out.println(protein.getQuants());
			}
			System.out.println("____________");
			System.out.println("FASTA file created");
			
			String absoluteFastaPath = new File(mantisFastaFile).getAbsolutePath();
			
			startProcessBuilder(absoluteFastaPath, this.job.jobID);
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

	private void startProcessBuilder(String absoluteFastaPath, String jobId) {
		try {
			String shellPath = writeShellFile(absoluteFastaPath, jobId);
			List<String> commandList =Arrays.asList("/bin/bash","-i", shellPath); 
			ProcessBuilder mantisBuilder = new ProcessBuilder(commandList);
			mantisBuilder.redirectErrorStream(true);
            Process mantisProcess = mantisBuilder.start();
            BufferedReader mantisProcessReader = new BufferedReader(new InputStreamReader(mantisProcess.getInputStream()));
            String mantisProcessLine;
            while((mantisProcessLine=mantisProcessReader.readLine())!= null) {
            	System.out.println(mantisProcessLine);
            }
            } catch (RuntimeException e) {
            	e.printStackTrace();
            } catch (Exception e) {
            	e.printStackTrace();
            } finally {
            	System.out.println("Done");
            }
	}

	private String writeShellFile(String absoluteFastaPath, String jobId) {
		String filePath = "upload/" + jobId + "/" + jobId + ".sh";
		try {
			String mantisDir = KeggCalculatorConstants.FULL_UPLOAD_PATH + "/" + jobId + "/mantis";
			new File(mantisDir).mkdir();
			BufferedWriter writer = new BufferedWriter(new FileWriter(new File(filePath)));
			writer.write(
				"conda init --all\n"
				+ "echo \"conda initialized\"\n"
				+ "conda activate mantis_env\n"
				+ "conda env list\n"
				+ "echo \"environtment setted\"\n"
				+ KeggCalculatorConstants.PYTHON_PATH + " "  
				+ KeggCalculatorConstants.MANTIS_PATH
				+ " run_mantis -t "
				+ absoluteFastaPath
				+ " -o "
				+ mantisDir
				+ "\necho \"mantis finished\"\n");
			writer.flush();
			writer.close();
			return filePath;
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return "";
		}
		
	}
}

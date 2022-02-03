package fluxanalysis;

import java.io.File;

import constants.KeggCalculatorConstants;
import json.FbaJobJson;
import services.FbaService;

public class FbaJob implements Runnable {

	private FbaJobJson job;
	
	public FbaJob(FbaJobJson fbaJob) {
		this.job = fbaJob;
		this.job.message = "created";
		this.job.fbaSolution = "";
		this.job.jobCode = "0";
	}
	
	@Override
	public void run() {
		this.job.message = "started";
		String uploadDir = KeggCalculatorConstants.UPLOAD_DIR + this.job.jobId + "/network_" + this.job.jobId;
		boolean startPythonProcess = false;
	
		System.out.println("FBA Job started");
		
		try {
			// timeout counter
			int count = 0;
		
			
			// wait for network		
			while(true) {				
				// check network file
				File networkFile = new File(uploadDir);
				System.out.println(networkFile.getAbsolutePath());
				
				if (networkFile.exists()) {
					System.out.println("network file has arrived, starting process builder");
					startPythonProcess = true;
					break;
				}
				
				if (count > 20) {
					System.out.println("Waiting took too long");
					break;
				}
				
				System.out.println("waiting...");
				Thread.sleep(100);
				
				count++;
			}
		} catch (Exception e) {
			this.job.message = "Upload failed";
			this.job.jobCode = "-1";
			e.printStackTrace();
		}
		
		try {
			if (startPythonProcess) {
				ProcessResultObject processResult = FbaService.startPythonProcess(uploadDir, this.job.jobId);
				
				
				if (processResult.getExitCode() == 1) {
					this.job.message = "A server error occured.";
					this.job.jobCode = "-1";
				} else if (processResult.getResults() == "" || processResult.getResults() == null) {
					this.job.message = FbaService.evaluateErrorLog(
							KeggCalculatorConstants.UPLOAD_DIR + this.job.jobId);
					this.job.jobCode = "-1";
				} else {
					this.job.message = "finished";
					this.job.jobCode = "1";
				}
				
				this.job.fbaSolution = processResult.getResults();
								
				startPythonProcess = false;
			}
		} catch (Exception e) {
			this.job.message = "A server error occured";
			this.job.jobCode = "-1";
			e.printStackTrace();
		}
	
	}
	
}

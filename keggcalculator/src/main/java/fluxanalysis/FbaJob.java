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
			e.printStackTrace();
		}
		
		try {
			if (startPythonProcess) {
				this.job.fbaSolution = FbaService.startPythonProcess(uploadDir, this.job.jobId);
				this.job.message = "finished";
				startPythonProcess = false;
			}
		} catch (Exception e) {
			this.job.message = "failed";
			e.printStackTrace();
		}
	
	}
	
}
package jobs;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;

public class DeleteThread implements Runnable {
	
	private HashMap<String, Integer> activeJobs;
	
	public DeleteThread() {
		this.activeJobs = new HashMap<String, Integer>();
	}
	
	public synchronized void addJob(String jobID) {
		this.activeJobs.put(jobID, 0);
	}

	@Override
	public void run() {
		while (true) {
			try {
				// check if any job has expired
				System.out.println("checking jobs...");
				HashSet<String> remove = new HashSet<String>(); 
				for (String job : this.activeJobs.keySet()) {
					if (this.activeJobs.get(job) >= 30) {
						deleteFiles(job);
						remove.add(job);
					}
				}		
				for (String job : remove) {
					this.activeJobs.remove(job);
				}
				// add +1 to every job
				for (String job : this.activeJobs.keySet()) {
					this.activeJobs.put(job, this.activeJobs.get(job) + 1);
				}
				Thread.sleep(1000*60);
			} catch (InterruptedException e) {
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

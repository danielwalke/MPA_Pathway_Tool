package services;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import javax.servlet.MultipartConfigElement;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;

import com.google.gson.Gson;

import constants.KeggCalculatorConstants;
import jobs.DeleteThread;
import jobs.KeggCalculatorJob;
import json.KeggCalculatorJobJSON;
import spark.Request;
import spark.Response;
/**
 * handles services for Calculator
 * 
 *
 */
public class KeggCalculatorService {

	public Gson gson;
	public HashMap<String, KeggCalculatorJobJSON> currentJobs;
	private DeleteThread deleteThread;
	
	private ExecutorService threadPool;

	public KeggCalculatorService() {
		this.gson = new Gson();
		this.currentJobs = new HashMap<>();
		this.threadPool = Executors.newFixedThreadPool(3);
		this.deleteThread = new DeleteThread();
		this.threadPool.execute(new Thread(this.deleteThread));
	}
	
	//starts thread for calculator
	public void submitJob(String jobID) {
		this.threadPool.execute(new KeggCalculatorJob(currentJobs.get(jobID)));
		this.deleteThread.addJob(jobID);
	}
	
	public synchronized void modifyJob(String jobID, KeggCalculatorJobJSON jobObject) {
		// TODO
	}
	
	//returns clone from job- object
	public synchronized KeggCalculatorJobJSON getJobObject(String jobID) {
		KeggCalculatorJobJSON newObject = new KeggCalculatorJobJSON();
		KeggCalculatorJobJSON job = this.currentJobs.get(jobID);
		if (job != null) {
			newObject.cloneFrom(job);
			return newObject;
		} else {
			return null;
		}
	}

	//returns uploaded files from user
	public String receiveUpload(spark.Request req, String destination) {
		// init the return value, return null means the upload failed 
		String sourceFileName = null;
		// TODO: Moved to params, refactor this!
		long maxFileSize = 1099511600000L;
		long maxRequestSize = 1099511600000L;
		int fileSizeThreshold = 1024;
		try {
			// create config element for multipart upload
			MultipartConfigElement multipartConfigElement = new MultipartConfigElement(
					KeggCalculatorConstants.UPLOAD_TEMP_DIR, maxFileSize, maxRequestSize, fileSizeThreshold);
			req.raw().setAttribute("org.eclipse.jetty.multipartConfig",
					multipartConfigElement);

			Part filePart = req.raw().getPart("uploaded_file");
			if(filePart!= null)
			sourceFileName = filePart.getSubmittedFileName();

			try (InputStream input = filePart.getInputStream()) {
				Files.copy(input, Paths.get(destination + "/" + sourceFileName), StandardCopyOption.REPLACE_EXISTING);
				filePart.delete();
			}
		} catch (IOException e) {
			e.printStackTrace();
		} catch (ServletException e) {
			e.printStackTrace();
		} catch (Exception e){
			System.out.println("big oof");
			e.printStackTrace();
		}
		if (destination != null && sourceFileName != null) {
			return sourceFileName;
		} else {
			return null;
		}
	}
	
	//returns download of output file of the calculator
	public HttpServletResponse getDownload(Request request, Response response, String jobid) {
        Path path = Paths.get(KeggCalculatorConstants.DOWNLOAD_DIR + "/" + jobid + ".csv");
        byte[] data = null;
        try {
            data = Files.readAllBytes(path);
        } catch (Exception e1) {
            e1.printStackTrace();
        }
        HttpServletResponse raw = response.raw();
        response.header("Content-Disposition", "attachment; filename="+"results_" + jobid + ".csv");
        response.type("application/force-download");
        try {
            raw.getOutputStream().write(data);
            raw.getOutputStream().flush();
            raw.getOutputStream().close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return raw;
	}

	public HttpServletResponse getDownloadUnmatchedProteins(Request req, Response response, String jobID) {
		  Path path = Paths.get(KeggCalculatorConstants.DOWNLOAD_DIR + jobID + "_unmatchedProteins" + ".csv");
	        byte[] data = null;
	        try {
	            data = Files.readAllBytes(path);
	        } catch (Exception e1) {
	            e1.printStackTrace();
	        }
	        HttpServletResponse raw = response.raw();
	        response.header("Content-Disposition", "attachment; filename="+"results_" + jobID + ".csv");
	        response.type("application/force-download");
	        try {
	            raw.getOutputStream().write(data);
	            raw.getOutputStream().flush();
	            raw.getOutputStream().close();
	        } catch (Exception e) {
	            e.printStackTrace();
	        }
	        return raw;
	}
	
}

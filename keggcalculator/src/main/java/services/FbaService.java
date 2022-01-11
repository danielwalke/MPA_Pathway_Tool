package services;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.HashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import javax.servlet.MultipartConfigElement;
import javax.servlet.ServletException;
import javax.servlet.http.Part;

import com.google.gson.Gson;

import constants.KeggCalculatorConstants;
import fluxanalysis.FbaJob;
import fluxanalysis.TempFile;
import jobs.DeleteThread;
import json.FbaJobJson;

public class FbaService {
	public Gson gson;
	public HashMap<String, FbaJobJson> currentFbaJobs;
	private DeleteThread deleteThread;
	
	private ExecutorService threadPool;
	
	public FbaService() {
		this.gson = new Gson();
		this.currentFbaJobs = new HashMap<>();
		this.threadPool = Executors.newFixedThreadPool(3);
		this.deleteThread = new DeleteThread();
		this.threadPool.execute(new Thread(this.deleteThread));
	}
	
	public void submitJob(String jobID) {
		this.threadPool.execute(new FbaJob(currentFbaJobs.get(jobID)));
		this.deleteThread.addJob(jobID);
		System.out.println(currentFbaJobs.keySet());
	}
	
	public synchronized FbaJobJson getJobObject(String jobID) {
		FbaJobJson newObject = new FbaJobJson();
		FbaJobJson job = this.currentFbaJobs.get(jobID);
		if (job != null) {
			newObject.cloneFrom(job);
			return newObject;
		} else {
			return null;
		}
	}
	
	public String writeUploadedNetwork(spark.Request req, String destination, String jobId) {
		String sourceFileName = null;
		
		long maxFileSize = 1099511600000L;
		long maxRequestSize = 1099511600000L;
		int fileSizeThreshold = 1024;
		try {
			// create config element for multipart upload
			MultipartConfigElement multipartConfigElement = new MultipartConfigElement(
					KeggCalculatorConstants.UPLOAD_TEMP_DIR, maxFileSize, maxRequestSize, fileSizeThreshold);
			req.raw().setAttribute("org.eclipse.jetty.multipartConfig", multipartConfigElement);
			Part filePart = req.raw().getPart("network");
						
			if(filePart!= null) 
			sourceFileName = "network_" + jobId;

			try (InputStream input = filePart.getInputStream()) {
				Files.copy(input, Paths.get(destination + jobId + "/" + sourceFileName), StandardCopyOption.REPLACE_EXISTING);
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
	
	public static String startPythonProcess(String modelContainer, String jobId) {
		String results;
		String pythonPath = new File("Python/pythonProject/main.py").getAbsolutePath();
		String networkDir = "upload\\" + jobId + "\\network_" + jobId;
		String pythonResultDir = "upload\\" + jobId + "\\fbaResults_" + jobId;
		String javaResultDir = "upload/" + jobId + "/fbaResults_" + jobId;
		
		try {
						
			ProcessBuilder builder = new ProcessBuilder(Arrays.asList(
					"C:\\Python39\\python",
					pythonPath,
					networkDir,
					pythonResultDir));

			builder.redirectErrorStream(true); // print Errors from Python
			Process process = builder.start();
			
			BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
			StringBuilder strBuilder = new StringBuilder();
			
			String line;
			
			while((line=reader.readLine())!=null) {
				strBuilder.append(line);
				strBuilder.append(System.getProperty("line.separator"));
			}
			
            System.out.println("Running Python starts");
            
            int exitCode = process.waitFor();
            System.out.println(strBuilder.toString());
            System.out.println("Exit Code : "+ exitCode);
            
			results = TempFile.readTempFile(javaResultDir);
			            
            return results;
			
			} catch (RuntimeException e) {
	            e.printStackTrace();
	            return "";
	        } catch (Exception e) {
	            e.printStackTrace();
	            return "";
	        } finally {
	            TempFile.deleteTempFile(modelContainer);
	            TempFile.deleteTempFile(javaResultDir);
	            System.out.println("Done");
	        }
	}
}

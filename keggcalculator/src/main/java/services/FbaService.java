package services;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.HashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import javax.servlet.MultipartConfigElement;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;

import com.google.gson.Gson;
import com.google.gson.stream.JsonReader;

import constants.KeggCalculatorConstants;
import fluxanalysis.FbaJob;
import fluxanalysis.ProcessResultObject;
import fluxanalysis.TempFile;
import jobs.DeleteThread;
import json.FbaJobJson;
import spark.Request;
import spark.Response;

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
	
	public static ProcessResultObject startPythonProcess(String modelContainer, String jobId) {
		String results = "";
		int exitCode = 0;
		String pythonPath = new File("Python/main.py").getAbsolutePath();
		String uploadDir = "upload/";
		String javaResultDir = "upload/" + jobId + "/fbaResults_" + jobId;
		
		try {
						
			ProcessBuilder builder = new ProcessBuilder(Arrays.asList(
					"python -3.7",
					pythonPath,
					uploadDir,
					jobId));

			builder.redirectErrorStream(true); // print Errors from Python
			Process process = builder.start();
			
			BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
			StringBuilder strBuilder = new StringBuilder();
			
			String line;
			
			while((line=reader.readLine())!=null) {
				strBuilder.append(line);
				strBuilder.append(System.getProperty("line.separator"));
			}
			
            System.out.println("starting python");
            
            exitCode = process.waitFor();
            System.out.println(strBuilder.toString());
            System.out.println("Exit Code : "+ exitCode);
            
			results = TempFile.readTempFile(javaResultDir);
			
			return new ProcessResultObject(results, exitCode);
			            			
			} catch (RuntimeException e) {
	            e.printStackTrace();
	            results = "";
	            exitCode = 1;
	            return new ProcessResultObject(results, exitCode);
	        } catch (Exception e) {
	            e.printStackTrace();
	            results = "";
	            exitCode = 1;
	            return new ProcessResultObject(results, exitCode);
	        } finally {
	            System.out.println("Done");
	        }
	}
	
	public HttpServletResponse getSMomentDownload(Request request, Response response, String jobid) {
        Path path = Paths.get("upload/" + jobid + "/sMomentModel.xml");
        byte[] data = null;
        try {
            data = Files.readAllBytes(path);
        } catch (Exception e1) {
            e1.printStackTrace();
        }
        HttpServletResponse raw = response.raw();
        response.header("Content-Disposition", "attachment; filename="+"sMomentModel_" + jobid + ".xml");
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
	
	public static String evaluateErrorLog(String jobDir) throws IOException {
		
		int code = 0;
		File errorLogPath = new File(jobDir + "/error_log.json");
		
		if(errorLogPath.exists()) {
		    JsonReader reader = new JsonReader(new FileReader(errorLogPath));
		    try {
		        code = readErrorLog(reader);
		      } finally {
		        reader.close();
		      }
		}
		
		return getErrorMessageForCode(code);
		
	}
	
	public static int readErrorLog(JsonReader reader) throws IOException {
		
		int code = 0;
		
		reader.beginObject();
		while (reader.hasNext()) {
			String prop = reader.nextName();
			if(prop.equals("code")) {
				code = reader.nextInt();
			} else {
				reader.skipValue();
			}
		}
		reader.endObject();
		
		return code;
	}
	
	public static String getErrorMessageForCode(int code) {
		String message;
		
		switch (code) {
		case 1:
			message = "An error occurred while building the cobra model.";
			break;
		case 2:
			message = "An error occurred while building the cobra sMOMENT model. Please check your input data file.";
			break;
		case 3:
			message = "Couldn't generate an FBA solution. Please check model boundaries.";
			break;
		case 4:
			message = "Couldn't generate FVA results.";
			break;
		case 5:
			message = "Couldn't assemble results.";
			break;
		default:
			message = "An unknown error occurred.";
			break;
		}
		
		return message;
	}
}

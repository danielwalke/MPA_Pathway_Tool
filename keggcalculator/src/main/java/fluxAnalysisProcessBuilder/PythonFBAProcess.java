package fluxAnalysisProcessBuilder;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class PythonFBAProcess {

	public void startPythonProcess(String modelContainer) {
		
		try {
			ProcessBuilder builder = new ProcessBuilder(Arrays.asList(
					"C:\\Python39\\python",
					"C:\\Users\\Emanu\\OneDrive\\Masterarbeit\\MPA Pathway Tool\\MPA_Pathway_Tool\\keggcalculator\\Python\\pythonProject\\main.py",
					modelContainer));

			builder.redirectErrorStream(true); // print Errors from Python
			Process process = builder.start();
			
			BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
			
            String line = "";
            System.out.println("Running Python starts: " + line);
            
            int exitCode = process.waitFor();
            System.out.println("Exit Code : "+exitCode);
            line = reader.readLine();
            System.out.println("First Line: " + line);
            
            while ((line = reader.readLine()) != null){
                System.out.println("Python Output: " + line);
                }
			
			System.out.println("Done");
			
			} catch (RuntimeException e) {
	            e.printStackTrace();
	        } catch (Exception e) {
	            e.printStackTrace();
		}
	}
	
}

package parser;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashSet;

import calculator.Module;
import calculator.Steps;

/**
 * not necessary with new calculator
 * @return module with specific module- ID and list of steps of given Module-csv-file
 * @see Module 
 * @see Steps
 * @author Daniel
 *
 */
public class ModuleParser {
	private String moduleFilename;
	private Module module;

	public void parseModuleFile() throws IOException {
		ArrayList<Steps> stepList = new ArrayList<Steps>();
		InputStream input = new FileInputStream(getModuleFilename());
		InputStreamReader inputReader = new InputStreamReader(input);
		BufferedReader reader = new BufferedReader(inputReader);
		int ignoreHeader = 0;
		String line = "";
		while ((line = reader.readLine()) != null) {
			if (ignoreHeader > 0) {
				String csvSeperator = ";";
				String[] stepEntries = line.split(csvSeperator);

				// step- IDs
				String stepId = Integer.toString(ignoreHeader);

				// reaction- numbers
				String reactionNumberListString = stepEntries[1].substring(1, stepEntries[1].length() - 1);
				EntrySeparator reactionNumberEntry = new EntrySeparator();
				reactionNumberEntry.setlistStringCsv(reactionNumberListString);
				ArrayList<String> reactionNumberList = reactionNumberEntry.getList();

				// KO numbers
				String koNumberListString = stepEntries[2].substring(1, stepEntries[2].length() - 1);
				EntrySeparator koNumberEntry = new EntrySeparator();
				koNumberEntry.setlistStringCsv(koNumberListString);
				ArrayList<String> koNumberList = koNumberEntry.getList();

				// EC- numbers
				String ecNumberListString = stepEntries[3].substring(1, stepEntries[3].length() - 1);
				EntrySeparator ecNumberEntry = new EntrySeparator();
				ecNumberEntry.setlistStringCsv(ecNumberListString);
				ArrayList<String> ecNumberList = ecNumberEntry.getList();

				// KO- and EC- numbers- Set
				String koAndEcNumberString = koNumberListString.concat(", ").concat(ecNumberListString);
				EntrySeparator koAndEcNumberEntry = new EntrySeparator();
				koAndEcNumberEntry.setlistStringCsv(koAndEcNumberString);
				HashSet<String> koAndEcNumberSet = koAndEcNumberEntry.getHashSet();
				
				// define Steps
				Steps step = new Steps();
				step.setId(stepId);
				step.setReactionNumberList(reactionNumberList);
				step.setKoNumberList(koNumberList);
				step.setEcNumberList(ecNumberList);
				step.setKoAndEcNumberSet(koAndEcNumberSet);

				// step- list
				stepList.add(step);
			}

			ignoreHeader++;
		}
		module = new Module();
		module.setId(getModuleFilename()); //TODO: import as File and FileName-> File.getFileName();
		module.setStepList(stepList);
		setModule(module);
	}

	public String getModuleFilename() {
		return moduleFilename;
	}

	public void setModuleFilename(String moduleFilename) {
		this.moduleFilename = moduleFilename;
	}

	public Module getModule() {
		return module;
	}

	private void setModule(Module module) {
		this.module = module;
	}
	

}

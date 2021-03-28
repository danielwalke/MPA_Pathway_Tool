package calculator;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

/**
 * loop over every module
 * 
 * @return list of CalculatorOutputs for each module
 * @see CalculatorOutputList
 * @see CalculatorOutput
 * @author Daniel
 *
 */
public class ModuleLoop {

	private CalculatorOutputList calcOutputList = new CalculatorOutputList();
	private List<String> moduleFiles;
	private String mpaFile;
	private ArrayList<ArrayList<Double>> numberNestedQuantList;

	public ModuleLoop() {
		this.moduleFiles = new LinkedList<String>();
		this.numberNestedQuantList = new ArrayList<ArrayList<Double>>();
	}

	public ArrayList<ArrayList<Double>> getNumberNestedQuantList() {
		return numberNestedQuantList;
	}

	public void setNumberNestedQuantList(ArrayList<ArrayList<Double>> numberNestedQuantList) {
		this.numberNestedQuantList = numberNestedQuantList;
	}

	public void addModuleFiles(String moduleFiles) {
		this.moduleFiles.add(moduleFiles);
	}

	private String getMpaFile() {
		return mpaFile;
	}

	public void setMpaFile(String mpaFile) {
		this.mpaFile = mpaFile;
	}

	public CalculatorOutputList getCalcOutputList() {
		return calcOutputList;
	}

	private void setCalcOutputList(CalculatorOutputList calcOutputList) {
		this.calcOutputList = calcOutputList;
	}

	public void loopModules() throws IOException {
		for (String moduleFolderString : this.moduleFiles) {
			File moduleFolder = new File(moduleFolderString);
			ArrayList<CalculatorOutput> listCalcOutput = new ArrayList<CalculatorOutput>();
			for (File moduleFile : moduleFolder.listFiles()) {
				String moduleFileName = moduleFile.toString();
				String mpaFileName = getMpaFile();
				Calculator calc = new Calculator();
				calc.setNumberNestedQuantList(new ArrayList<ArrayList<Double>>());
				calc.setModuleFileName(moduleFileName);
				calc.setMpaFileName(mpaFileName);
				calc.matchSets(listCalcOutput);
				this.calcOutputList.setMpaFileName(mpaFileName);
				this.calcOutputList.setCalcOutputList(calc.getListCalcOutput());
				this.calcOutputList.setSampleIDHeaderList(calc.getSampleIDHeaderList());
				setCalcOutputList(this.calcOutputList);
			}
		}
	}
}

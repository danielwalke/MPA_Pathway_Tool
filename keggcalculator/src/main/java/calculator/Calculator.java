package calculator;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Map;

import parser.ModuleNameParser;
import parser.ModuleParser;
import parser.MpaFileParser;

/**
 * matches the sets of mpa-file with sets of module-files, sets
 * calculator-outputs and list of calculator-outputs
 * 
 * @see CalculatorOutput
 * @author Daniel
 *
 */
public class Calculator {
	private String moduleFileName;
	private String mpaFileName;
	private CalculatorOutput calcOutput = new CalculatorOutput();
	private boolean matchedNumber;
	private double quant = 0.0;
	private double countMpa = 0.0;
	private ArrayList<CalculatorOutput> listCalcOutput;
	private ArrayList<ArrayList<Double>> numberNestedQuantList;
	private ArrayList<String> sampleIDHeaderList;

	public ArrayList<String> getSampleIDHeaderList() {
		return sampleIDHeaderList;
	}

	public void setSampleIDHeaderList(ArrayList<String> sampleIDHeaderList) {
		this.sampleIDHeaderList = sampleIDHeaderList;
	}

	public ArrayList<ArrayList<Double>> getNumberNestedQuantList() {
		return numberNestedQuantList;
	}

	public void setNumberNestedQuantList(ArrayList<ArrayList<Double>> numberNestedQuantList) {
		this.numberNestedQuantList = numberNestedQuantList;
	}

	public ArrayList<CalculatorOutput> getListCalcOutput() {
		return listCalcOutput;
	}

	public void setListCalcOutput(ArrayList<CalculatorOutput> listCalcOutput) {
		this.listCalcOutput = listCalcOutput;
	}

	public void matchSets(ArrayList<CalculatorOutput> listCalcOutput) throws IOException {
		ModuleParser moduleParser = new ModuleParser();
		moduleParser.setModuleFilename(getModuleFileName());
		moduleParser.parseModuleFile();
		MpaFileParser mpaParser = new MpaFileParser();
		mpaParser.setMpaFileName(getMpaFileName());
		mpaParser.parseMpaFile();
		setSampleIDHeaderList(mpaParser.getSampleIDHeaderList());
		Module module = moduleParser.getModule();
		MpaFileProteine proteins = mpaParser.getMpaProteins();
		double stepCounterTotal = 0.0;
		for (Steps step : module.getStepList()) {
			HashSet<String> moduleKoAndEcSet = step.getKoAndEcNumberSet();
			stepCounterTotal++;
			for (Protein protein : proteins.getProteinList()) {
				HashSet<String> mpaKoAndEcSet = protein.getKoAndEcNumberSet();
				Map<HashSet<String>, Double> numberQuantMap = protein.getNumberQuantMap();
				Map<HashSet<String>, ArrayList<Double>> numberQuantListMap = protein.getNumberQuantListMap();
				ArrayList<Double> numberQuantList = numberQuantListMap.get(mpaKoAndEcSet); // better LinkedList<Double>!!!
				double spectralCount = numberQuantMap.get(mpaKoAndEcSet);
				setMatchedNumber(false);
				mpaKoAndEcSet.forEach(mpaKoAndEc -> matchNumbers(moduleKoAndEcSet, mpaKoAndEc));
				if (isMatchedNumber()) {
					this.quant = spectralCount + this.quant;
					this.countMpa++;
					this.numberNestedQuantList = getNumberNestedQuantList();
					this.numberNestedQuantList.add(numberQuantList);
					setNumberNestedQuantList(this.numberNestedQuantList);

				}
			}
		}
		ListSum listSum = new ListSum();
		listSum.setNumberNestedQuantList(getNumberNestedQuantList());
		ArrayList<Double> summedQuantList = listSum.getListSumList();
		int csvPatternInt = getModuleFileName().indexOf(".csv");
		String moduleId = getModuleFileName().substring(csvPatternInt - 6, csvPatternInt);
		ModuleNameParser moduleNameParser = new ModuleNameParser();
		moduleNameParser.setModuleId(moduleId);
		moduleNameParser.parseModuleName();
		String moduleName = moduleNameParser.getModuleName();
		calcOutput.setModule(getModuleFileName());
		calcOutput.setModuleName(moduleName);
		calcOutput.setStepMpa(countMpa);
		calcOutput.setStepTotal(stepCounterTotal);
		calcOutput.setQuantMPA(quant);
		calcOutput.setQuantList(summedQuantList);
		listCalcOutput.add(calcOutput);
		setListCalcOutput(listCalcOutput);
	}

	public boolean isMatchedNumber() {
		return matchedNumber;
	}

	public void setMatchedNumber(boolean matchedNumber) {
		this.matchedNumber = matchedNumber;
	}

	public void matchNumbers(HashSet<String> moduleKoAndEcSet, String mpaKoAndEc) {
		if (moduleKoAndEcSet.contains(mpaKoAndEc)) {
			setMatchedNumber(true);
		}
	}

	public String getModuleFileName() {
		return moduleFileName;
	}

	public void setModuleFileName(String moduleFileName) {
		this.moduleFileName = moduleFileName;
	}

	public String getMpaFileName() {
		return mpaFileName;
	}

	public void setMpaFileName(String mpaFileName) {
		this.mpaFileName = mpaFileName;
	}

}

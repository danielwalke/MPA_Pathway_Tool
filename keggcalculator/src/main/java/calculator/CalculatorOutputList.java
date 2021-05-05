package calculator;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.util.ArrayList;
import java.util.HashSet;

import model.MpaProtein;

/**
 * @return name of mpa- file and list of calculator- outputs for each module
 * @see CalculatorOutput
 * @author Daniel
 *
 */
public class CalculatorOutputList {

	private String mpaFileName;
	private ArrayList<CalculatorOutput> calcOutputList;
	private ArrayList<String> sampleIDHeaderList; //delete
	private String sampleHeaderString;
	private HashSet<MpaProtein> unmatchedProteins;
	private HashSet<String> allMatchedEcAndKoNumbers;
	private HashSet<MpaProtein> matchedProteins;
	
	public CalculatorOutputList() {
		this.calcOutputList = new ArrayList<CalculatorOutput>();
		this.unmatchedProteins = new HashSet<>();
		this.allMatchedEcAndKoNumbers = new HashSet<>();
		this.matchedProteins = new HashSet<>();
	}
	
	public void addMatchedProtein(MpaProtein protein) {
		this.matchedProteins.add(protein);
	}
	
	public void addKoOrEc(String num) {
		this.allMatchedEcAndKoNumbers.add(num);
	}
	
	
	public void addProtein(MpaProtein protein) {
		this.unmatchedProteins.add(protein);
	}
	
	public void removeMatchedProtein(MpaProtein matchedProtein) {
		this.unmatchedProteins.remove(matchedProtein);
	}

	public String getSampleHeaderString() {
		return sampleHeaderString;
	}

	public void setSampleHeaderString(String sampleHeaderString) {
		this.sampleHeaderString = sampleHeaderString;
	}

	public ArrayList<String> getSampleIDHeaderList() {
		return sampleIDHeaderList;
	}

	public void setSampleIDHeaderList(ArrayList<String> sampleIDHeaderList) {
		this.sampleIDHeaderList = sampleIDHeaderList;
	}

	public String getMpaFileName() {
		return mpaFileName;
	}

	public void setMpaFileName(String mpaFileName) {
		this.mpaFileName = mpaFileName;
	}

	public ArrayList<CalculatorOutput> getCalcOutputList() {
		return this.calcOutputList;
	}

	public void addCalculatorOutput(CalculatorOutput calcOutput) {
		this.calcOutputList.add(calcOutput);
	}

	public void writeCSV(File outputCSV) {
		try {
			BufferedWriter br = new BufferedWriter(new FileWriter(outputCSV));
			br.write("Module\t");
			br.write("module-name\t");
			br.write("Steps found\t");
			br.write("Total steps module\t");
			br.write(getSampleHeaderString().trim());
			int numberOfSamples = getSampleHeaderString().split("\t").length;
			br.write("\n");
			for (CalculatorOutput calcOutput : this.calcOutputList) {
//				int csvPatternInt = calcOutput.getModule().indexOf(".csv");
//				br.write(calcOutput.getModule().substring(csvPatternInt - 6, csvPatternInt) + ",");
				br.write(calcOutput.getModule().replace("\t", ";") + "\t");
				br.write(calcOutput.getModuleName().replace("\t", ";") + "\t");
				br.write(calcOutput.getStepMpa() + "\t");
				br.write(calcOutput.getStepTotal() + "\t");
				if (calcOutput.getQuantList().isEmpty()) {
					for(int sampleIterator =0; sampleIterator<numberOfSamples;sampleIterator++) {
						br.write("nd");
						if(sampleIterator<numberOfSamples-1) {
							br.write("\t");
						}
					}
				} else {
					for(int quantIterator=0 ;quantIterator<calcOutput.getQuantList().size(); quantIterator++) {
						double quant = calcOutput.getQuantList().get(quantIterator);
						br.write(String.valueOf(quant));
						if(quantIterator<calcOutput.getQuantList().size()-1) {
							br.write("\t");
						}						
					}
//					br.write(calcOutput.getQuantList().toString().substring(1,
//							calcOutput.getQuantList().toString().length() - 1));
				}
				// br.write(Double.toString(calcOutput.getQuantMPA()));
				br.write("\n");

			}
			br.flush();
			br.close();
		} catch (Exception e) {

		}
	}

	public void setCalcOutputList(ArrayList<CalculatorOutput> listCalcOutput) {
		this.calcOutputList = listCalcOutput;
		
	}


	public void writeCSVUnmatchedProteins(File outputCSV) {
		try {
			BufferedWriter br = new BufferedWriter(new FileWriter(outputCSV));
			br.write("id\t");
			br.write("KO-numbers\t");
			br.write("EC-numbers\t");
			br.write(getSampleHeaderString());
//			int numberOfSamples = getSampleHeaderString().split("\t").length;
			br.write("\n");
				for(MpaProtein protein : this.unmatchedProteins) {
					String name = protein.getMetaProteinName();
					String koNumbers = protein.getKoNumberIds().toString().replace("[", "").replace("]", "").replace(" ", "").replace(",", "|");
					String ecNumbers = protein.getEcNumberIds().toString().replace("[", "").replace("]", "").replace(" ", "").replace(",", "|");
					String quants = protein.getQuants().toString().replace("[", "").replace("]", "").replace(" ", "").replace(",","\t");
					br.write(name);
					br.write("\t");
					br.write(koNumbers);
					br.write("\t");
					br.write(ecNumbers);
					br.write("\t");
					br.write(quants);
					br.write("\n");
				}
			br.flush();
			br.close();
		} catch (Exception e) {

		}
	}

}

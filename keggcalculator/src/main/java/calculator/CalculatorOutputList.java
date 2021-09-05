package calculator;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map.Entry;

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
	
	public HashSet<MpaProtein> getMatchedProteins(){
		return this.matchedProteins;
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

	public void writeCSV(String outputCSV, boolean isDetails) {
		try {
			if(isDetails) {
				outputCSV += "_detailed.csv";
			}else {
				outputCSV += ".csv";
			}
			BufferedWriter br = new BufferedWriter(new FileWriter(new File(outputCSV)));
			if(isDetails) br.write("index\t");
			br.write("pathway\t");
			if(isDetails) {
				br.write("superkingdom\t");
				br.write("kingdom\t");
				br.write("phylum\t");
				br.write("class\t");
				br.write("order\t");
				br.write("family\t");
				br.write("genus\t");
				br.write("species\t");
			}			
			br.write("identified reactions\t");
			br.write("total reactions in pathway\t");
			br.write(getSampleHeaderString().trim());
			int numberOfSamples = getSampleHeaderString().split("\t").length;
			br.write("\n");
			
			for (int moduleIndex = 0; moduleIndex< this.calcOutputList.size(); moduleIndex++) {
				CalculatorOutput calcOutput = this.calcOutputList.get(moduleIndex);
				writePathwayHeader(br, calcOutput, moduleIndex, numberOfSamples, isDetails);
				if(isDetails) writeTaxonomyQuants(br, calcOutput, moduleIndex, numberOfSamples);
			}
			br.flush();
			br.close();
		} catch (Exception e) {
e.printStackTrace();
		}
	}

	private void writeTaxonomyQuants(BufferedWriter br, CalculatorOutput calcOutput, int moduleIndex,
			int numberOfSamples) throws IOException {
		HashMap<Taxonomy, double[]> taxonomyQuants = calcOutput.getTaxonomyQuants();
		HashMap<Taxonomy, Integer> taxonomySteps = calcOutput.getTaxonomySteps();
		int taxonIndex = 0;
		for( Entry<Taxonomy, double[]> taxonEntry : taxonomyQuants.entrySet()) {
			Taxonomy taxon = taxonEntry.getKey();
			double[] quants = taxonEntry.getValue();
			br.write(String.valueOf(moduleIndex+1)+"." + String.valueOf(taxonIndex+1)+"\t"); //index 0.0
			br.write(calcOutput.getModule().replace("\t", ";") + "\t"); //pathway name/ module name
			br.write(taxon.getSuperkingdom().replace("\t", ";") + "\t");
			br.write(taxon.getKingdom().replace("\t", ";") + "\t");
			br.write(taxon.getPhylum().replace("\t", ";") + "\t");
			br.write(taxon.getClassT().replace("\t", ";") + "\t");
			br.write(taxon.getOrder().replace("\t", ";") + "\t");
			br.write(taxon.getFamily().replace("\t", ";") + "\t");
			br.write(taxon.getGenus().replace("\t", ";") + "\t");
			br.write(taxon.getSpecies().replace("\t", ";") + "\t");
			br.write(taxonomySteps.get(taxon) + "\t");
			br.write(calcOutput.getStepTotal() + "\t");
			taxonIndex++;
			if(quants == null || quants.length == 0) {
				for(int sampleIterator =0; sampleIterator<numberOfSamples;sampleIterator++) {
					br.write("nd");
					if(sampleIterator<numberOfSamples-1) {
						br.write("\t");
					}
				}
			}else {
				for(int quantIterator=0 ;quantIterator<calcOutput.getQuantList().size(); quantIterator++) {
					double quant = quants[quantIterator];
					br.write(String.valueOf(quant));
					if(quantIterator<calcOutput.getQuantList().size()-1) {
						br.write("\t");
					}						
				}
			}
			br.write("\n");
		}

			
	}

	private void writePathwayHeader(BufferedWriter br, CalculatorOutput calcOutput, int moduleIndex,
			int numberOfSamples, boolean isDetailed) throws IOException {
		if(isDetailed) br.write(String.valueOf(moduleIndex+1)+"\t"); //index
		br.write(calcOutput.getModule().replace("\t", ";") + "\t"); //pathway name/ module name
		if(isDetailed) {
			br.write("-\t");
			br.write("-\t");
			br.write("-\t");
			br.write("-\t");
			br.write("-\t");
			br.write("-\t");
			br.write("-\t");
			br.write("-\t");
		}
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
		}
		br.write("\n");		
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
			br.write("superkingdom\t");
			br.write("kingdom\t");
			br.write("phylum\t");
			br.write("class\t");
			br.write("order\t");
			br.write("family\t");
			br.write("genus\t");
			br.write("species\t");
			br.write("description\t");
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
					writeTaxa(br, protein.getTaxa());
					writeDescription(br, protein.getDescription());
					br.write(quants);
					br.write("\n");
				}
			br.flush();
			br.close();
		} catch (Exception e) {
e.printStackTrace();
		}
	}

	private void writeDescription(BufferedWriter br, String description) {
		try {
			br.write(description.concat("\t"));
		} catch (IOException e) {
			e.printStackTrace();
		}		
	}

	private void writeTaxa(BufferedWriter br, HashMap<String, String> taxa) {
		try {
			br.write(taxa.get("superkingdom").concat("\t"));
			br.write(taxa.get("kingdom").concat("\t"));
			br.write(taxa.get("phylum").concat("\t"));
			br.write(taxa.get("class").concat("\t"));
			br.write(taxa.get("order").concat("\t"));
			br.write(taxa.get("family").concat("\t"));
			br.write(taxa.get("genus").concat("\t"));
			br.write(taxa.get("species").concat("\t"));
		} catch (IOException e) {
			e.printStackTrace();
		}	
	}

}

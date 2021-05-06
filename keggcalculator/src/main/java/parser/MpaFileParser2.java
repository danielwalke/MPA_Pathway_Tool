package parser;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.util.ArrayList;

import calculator.CalculatorOutputList;
import model.MpaProtein;
import model.MpaProteine;
/**
 * class for parsing mpa files
 * @author Daniel
 *
 */
public class MpaFileParser2 {

	public static void parseMpaFile(MpaProteine proteins, String file, CalculatorOutputList calcOutputList) {
		//reads mpa- file
		try {
			BufferedReader br = new BufferedReader(new FileReader(new File(file.trim())));
			String line = br.readLine();
			int lineCounter = 0;
			while (line != null) {
				lineCounter++;
				//first row is a header
				if(lineCounter==1) {
					String[] splitLine = line.split("\t");
					String quantSampleHeader = ""; //contains header of samples-> will be added in output file for good overview about samples
					for(int columnIt = 12; columnIt<splitLine.length; columnIt++) {
						quantSampleHeader+=splitLine[columnIt];
						quantSampleHeader+="\t";
					}
					proteins.setSampleHeaderString(quantSampleHeader);
				}else {
					//other rows contains measured metaproteins
					String[] splitLine = line.split("\t");
					String proteinIdentifier = splitLine[0]; //name of metaprotein name
					MpaProtein protein = new MpaProtein(proteinIdentifier);
					String koNumberIds = splitLine[1];
					String[] splitKoNumber = koNumberIds.split("\\|"); //splits ko number- separated by comma
					for (String koId : splitKoNumber) {
						if(koNumberIds.length()>0) {
							protein.addKoNumberId(koId);
						}
					}
					String ecNumberIds = splitLine[2];
					String[] splitEcNumber = ecNumberIds.split("\\|");//splits ec number- separated by comma
					for (String ecId : splitEcNumber) {
						if(ecNumberIds.length()>0) {
							protein.addecNumberId(ecId);
						}
						
					}
					ArrayList<String> taxonomicRanks = getTaxonomicRanks(); //rückblickend wäre hier ein array sinnvoller gewesen 
					for (int taxonIterator = 0; taxonIterator<taxonomicRanks.size(); taxonIterator++) {
						String taxonomy = splitLine[taxonIterator+3];//splitTaxonomies[taxonIterator];
						String taxonomicRank = taxonomicRanks.get(taxonIterator);
						protein.addTaxonomy(taxonomy, taxonomicRank);						
					}
					String description = splitLine[11]; //description where "\t are not allowed
					for(int columnIt = 12; columnIt<splitLine.length; columnIt++) {
						double quant = Double.parseDouble(splitLine[columnIt]);
						protein.addQuant(quant); //adds quantifications to protein
					}
					proteins.addMpaProtein(protein);
					calcOutputList.addProtein(protein);
				}				
				line = br.readLine();
			}
			br.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	private static ArrayList<String> getTaxonomicRanks(){
		ArrayList<String> taxonomicRanks = new ArrayList<>();
		taxonomicRanks.add("superkingdom");
		taxonomicRanks.add("kingdom");
		taxonomicRanks.add("phylum");
		taxonomicRanks.add("class");
		taxonomicRanks.add("order");
		taxonomicRanks.add("family");
		taxonomicRanks.add("genus");
		taxonomicRanks.add("species");
		return taxonomicRanks;
	}


}

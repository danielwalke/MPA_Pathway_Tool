package parser;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashSet;

import calculator.MpaFileProteine;
import calculator.Protein;

/**
 * @return all proteins of imported MetaProteomeAnalyzer-File including name,
 *         list of KO- numbers, list of EC- numbers and spectral count of each
 *         measured protein
 * not necessary with new calculator
 * @see MpaFileProteine
 * @see Protein
 * @author Daniel
 *
 */
public class MpaFileParser {
	private String mpaFileName;
	private MpaFileProteine mpaProteins;
	private ArrayList<String> sampleIDHeaderList;

	public void parseMpaFile() throws IOException {
		ArrayList<Protein> proteinList = new ArrayList<Protein>();
		InputStream input = new FileInputStream(getMpaFileName());
		InputStreamReader inputReader = new InputStreamReader(input);
		BufferedReader reader = new BufferedReader(inputReader);
		int ignoreHeader = 0;
		String line = "";
		while ((line = reader.readLine()) != null) {
			if (ignoreHeader > 0) {
				String csvSeperator = ";";
				String[] proteinEntries = line.split(csvSeperator);

				// name of protein
				String proteinName = proteinEntries[0];

				// KO- numbers
				String koNumberListString = proteinEntries[1];
				EntrySeparator koNumberEntry = new EntrySeparator();
				koNumberEntry.setlistStringCsv(koNumberListString);
				ArrayList<String> koNumberList = koNumberEntry.getList();

				// EC- numbers
				String ecNumberListString = proteinEntries[2];
				EntrySeparator ecNumberEntry = new EntrySeparator();
				ecNumberEntry.setlistStringCsv(ecNumberListString);
				ArrayList<String> ecNumberList = ecNumberEntry.getList();

				// KO- and EC- numbers- Set
				String koAndEcNumberString = koNumberListString.concat(", ").concat(ecNumberListString);
				EntrySeparator koAndEcNumberEntry = new EntrySeparator();
				koAndEcNumberEntry.setlistStringCsv(koAndEcNumberString);
				HashSet<String> koAndEcNumberSet = koAndEcNumberEntry.getHashSet();

				// possible improvement: map<sampleId, SpectralCount>
				// spectral counts
				double quant = 12; //provisorisch
				String quantString = proteinEntries[3];
				EntrySeparator quantEntry = new EntrySeparator(); //change to LinkedList
				quantEntry.setlistStringCsv(quantString);
				ArrayList<String> quantStringList = quantEntry.getList();
				ArrayList<Double> quantList = new ArrayList<Double>();
				for(String quantStr : quantStringList) {
					double quantDouble = Double.parseDouble(quantStr);
					quantList.add(quantDouble);
					
				}
				
				
				// define proteins
				Protein protein = new Protein();
				protein.setName(proteinName);
				protein.setKoNumberList(koNumberList);
				protein.setEcNumberList(ecNumberList);
				protein.setKoAndEcNumberSet(koAndEcNumberSet);
				protein.setQuant(quant);
				protein.setQuantList(quantList);

				// define protein- list
				proteinList.add(protein);
			}
			else {
				String csvSeperator = ";";
				String[] proteinEntries = line.split(csvSeperator);
				String headerQuantString = proteinEntries[3];
				EntrySeparator headerEntry = new EntrySeparator(); //change to LinkedList
				headerEntry.setlistStringCsv(headerQuantString);
				this.sampleIDHeaderList = headerEntry.getList();
				setSampleIDHeaderList(this.sampleIDHeaderList);
				//TODO make header with description and sampleIDs
			}
			ignoreHeader++;
		}
		mpaProteins = new MpaFileProteine();
		mpaProteins.setMpaFileName(getMpaFileName());
		mpaProteins.setProteinList(proteinList);
		setMpaProteins(mpaProteins);
	}

	public ArrayList<String> getSampleIDHeaderList() {
		return sampleIDHeaderList;
	}

	public void setSampleIDHeaderList(ArrayList<String> sampleIDHeaderList) {
		this.sampleIDHeaderList = sampleIDHeaderList;
	}

	public MpaFileProteine getMpaProteins() {
		return mpaProteins;
	}

	private void setMpaProteins(MpaFileProteine mpaProteins) {
		this.mpaProteins = mpaProteins;
	}

	public String getMpaFileName() {
		return mpaFileName;
	}

	public void setMpaFileName(String mpaFileName) {
		this.mpaFileName = mpaFileName;
	}

}

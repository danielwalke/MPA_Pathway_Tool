package mantis;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Map.Entry;
import java.lang.*;

public class MantisParser {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		MantisFile file = new MantisFile();
		file.setFileName("C:\\Users\\danie\\Desktop\\MantisTest.csv");
		file.setFastaFilePath("C:\\Users\\danie\\Desktop\\MantisTestInput.faa");
		MantisParser.readFile(file);
		MantisParser.writeFastaFile(file);
		for (Entry<String, MantisProtein> proteinEntry : file.getMantisProteins().entrySet()) {
			MantisProtein protein = proteinEntry.getValue();
			System.out.println(protein.getQuants());
		}

	}

	public static void writeFastaFile(MantisFile file) {
		try {
			String outputString = "";
			BufferedWriter writer = new BufferedWriter(new FileWriter(new File(file.getFastaFilePath())));
			for (Entry<String, MantisProtein> proteinEntry : file.getMantisProteins().entrySet()) {
				MantisProtein protein = proteinEntry.getValue();
				outputString += "> " + protein.getId().concat(protein.getUuid()) + "\t" + protein.getName() + "\n";
				int numberOfSequenceLines = (int) Math.ceil(protein.getSequence().length() / 60.0);
				for (int sequenceLineNumber = 0; sequenceLineNumber < numberOfSequenceLines; sequenceLineNumber++) {
					String subSequence = "";
					int endIndex = (sequenceLineNumber + 1) * 60;
					int sequenceLength = protein.getSequence().length();
					if (endIndex > sequenceLength) {
						subSequence = protein.getSequence().substring(sequenceLineNumber * 60,
								protein.getSequence().length());
					}
					if (endIndex <= sequenceLength) {
						subSequence = protein.getSequence().substring(sequenceLineNumber * 60,
								(sequenceLineNumber + 1) * 60);
					}
					outputString += subSequence + "\n";
				}
			}
			outputString.trim();
			writer.write(outputString);
			writer.flush();
			writer.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public static void readFile(MantisFile file) {
		try {
			BufferedReader reader = new BufferedReader(new FileReader(new File(file.getFileName())));
			String line = reader.readLine();
			String[] headerEntries = line.split("\t");
			for (int entryIterator = 12; entryIterator < headerEntries.length; entryIterator++) {
				String sampleHeader = headerEntries[entryIterator];
				file.addSampleHeader(sampleHeader);
			}
			line = reader.readLine();
			while (line != null) {
				MantisProtein protein = new MantisProtein();
				String[] fileEntries = line.split(";");
				protein.setId(fileEntries[0]);
				protein.setName(fileEntries[1]);
				protein.setSequence(fileEntries[2]);
				ArrayList<String> taxonomicRanks = getTaxonomicRanks();
				for (int taxonIterator = 0; taxonIterator < taxonomicRanks.size(); taxonIterator++) {
					String taxonomy = fileEntries[taxonIterator + 3];
					String taxonomicRank = taxonomicRanks.get(taxonIterator);
					protein.addTaxa(taxonomy, taxonomicRank);
				}
				protein.setDescription(fileEntries[11]);
				for (int entryIterator = 12; entryIterator < fileEntries.length; entryIterator++) {
					String quantValue = fileEntries[entryIterator];
					try {
						protein.addQuant(Double.parseDouble(quantValue));
					} catch (NumberFormatException e) {
						double zero = 0.0;
						protein.addQuant(zero);
					}
				}
				file.addMantisProtein(protein);
				line = reader.readLine();
			}
			reader.close();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	private static ArrayList<String> getTaxonomicRanks() {
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

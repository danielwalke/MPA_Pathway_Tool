package cazy;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map.Entry;

import constants.KeggCalculatorConstants;
import model.KeggDataObject;
import model.KeggECObject;
import parser.KeggDataParser;

public class Parser {
	private String fileName;
	private KeggDataObject keggData;

	public Parser(String fileName) {
		this.fileName = fileName;
		this.keggData = new KeggDataObject();
	}
	
	public void parseKeggData() {
		KeggDataParser.parseModule2ModuleName(this.keggData, KeggCalculatorConstants.MODULE_LIST_DIR);
		KeggDataParser.parseReaction2ReactionName(this.keggData, KeggCalculatorConstants.REACTION_LIST_DIR);
		KeggDataParser.parseKo2KoName(this.keggData, KeggCalculatorConstants.KO_NUMBER_LIST_DIR);
		KeggDataParser.parseEc2EcName(this.keggData, KeggCalculatorConstants.EC_NUMBER_LIST_DIR);
		KeggDataParser.parseCompound2CompoundName(this.keggData, KeggCalculatorConstants.COMPOUND_NUMBER_LIST_DIR);
		KeggDataParser.parseGlycan2GlycanName(this.keggData, KeggCalculatorConstants.GLYCAN_NUMBER_LIST_DIR);
		KeggDataParser.parseModule2Reaction(this.keggData, KeggCalculatorConstants.MODULE_TO_REACTION_DIR);
		KeggDataParser.parseModule2KoNumber(this.keggData, KeggCalculatorConstants.MODULE_TO_KO_NUMBER_DIR);
		KeggDataParser.parseModule2EcNumber(this.keggData, KeggCalculatorConstants.MODULE_TO_EC_NUMBER_DIR);
		KeggDataParser.parseModule2Compounds(this.keggData, KeggCalculatorConstants.MODULE_TO_COMPOUND_DIR);
		KeggDataParser.parseModule2Glycans(this.keggData, KeggCalculatorConstants.MODULE_TO_GLYCAN_DIR);
		KeggDataParser.parseKo2Reactions(this.keggData, KeggCalculatorConstants.KO_TO_REACTION_DIR);
		KeggDataParser.parseEc2Reaction(this.keggData, KeggCalculatorConstants.EC_TO_REACTION_DIR);
		KeggDataParser.parseSubstrate2Reaction(this.keggData, KeggCalculatorConstants.SUBSTRATE_TO_REACTION_DIR);
		KeggDataParser.parseProduct2Reaction(this.keggData, KeggCalculatorConstants.PRODUCT_TO_REACTION_DIR);
		KeggDataParser.parseKo2EcNumber(this.keggData, KeggCalculatorConstants.KO_TO_EC_DIR);
		KeggDataParser.parseHsa2HsaName(this.keggData, KeggCalculatorConstants.HSA_NUMBER_LIST_DIR);
	}
	
	public void readFile(HashMap<String, HashSet<String>> ghObjects) {
		try {
			BufferedReader reader = new BufferedReader(new FileReader(new File(this.fileName)));
			String line = reader.readLine();
			line = reader.readLine(); //header
			while(line != null) {
				String[] entries = line.split("\t");
				String familyId = entries[0];
				if(!ghObjects.containsKey(familyId)) {
					ghObjects.put(familyId, new HashSet<String>());
				}
				HashSet<String> ecNumbers = ghObjects.get(familyId);
				ecNumbers.add(entries[1]);
				line = reader.readLine();
			}
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	public void createPathwayStrings(HashMap<String, HashSet<String>> ghObjects, HashMap<String, String> ghToPathway) {
		for(Entry<String, HashSet<String>> entries : ghObjects.entrySet()) {
			int stepId = 0;
			String fileString = "stepId;ReactionNumberId;koNumberIds;ecNumberIds;stochCoeff;compoundId;typeOfCompound;reversibility;taxonomy;reactionX;reactionY;CompoundX;CompoundY;reactionAbbr;compoundAbbr;keyComp";
			for(String ecNumber : entries.getValue()) {
				String ecName = getName(ecNumber.replace("*", "-"));
				fileString = fileString.concat("\n" + String.valueOf(stepId) + ";"); // id
				fileString = fileString.concat(ecName.replace(";", "\t").concat("\s" + getId(stepId)) + ";"); //reaction numbers
				fileString = fileString.concat("" + ";"); //ko numbers
				fileString = fileString.concat(ecNumber.replace("*", "-") + ";"); //ec numbers
				fileString = fileString.concat(""+";");//stoichiometric coeff
				fileString = fileString.concat(""+";"); //compoundID
				fileString = fileString.concat(""+";");//compoundType
				fileString = fileString.concat("irreversible"+";"); //reversibility
				fileString = fileString.concat(""+";"); //taxonomy
				fileString = fileString.concat("0"+";");//reactionX
				fileString = fileString.concat(String.valueOf(stepId*50)+";");//reactionY
				fileString = fileString.concat(""+";");//compoundX
				fileString = fileString.concat(""+";");//compoundY
				fileString = fileString.concat(getAbbreviation(ecName)+";");//reactionAbbr
				fileString = fileString.concat(""+";");//compoundAbbr
				fileString = fileString.concat("true");//keyComp
				stepId++;
			
			}
			ghToPathway.put(entries.getKey(), fileString);		
		}
	}

	private String getAbbreviation(String ecName) {
		if(ecName.contains(";")) {
			String[] ecNameEntries = ecName.split(";");
			return ecNameEntries[0];
		}else {
			return ecName;
		}
	}

	private String getName(String ecNumber) {
		try {
			KeggECObject ecObject = this.keggData.getEcnumber(ecNumber);
			return ecObject.getEcName();
		}catch(Exception e) {
			System.out.println(ecNumber + " ec number not found");
			return ecNumber;
		}
	}

	private String getId(int stepId) {
		int digitLength = String.valueOf(stepId).length();
		String id = "U";
		for(int i = 0 ; i< 5-digitLength; i++) {
			id = id.concat("0");
		}
		return id.concat(String.valueOf(stepId));
	}

	public void writeFiles(String directory, HashMap<String, String> ghToPathway) {
		for(Entry<String, String> entry : ghToPathway.entrySet()) {
			try {
				BufferedWriter writer = new BufferedWriter(new FileWriter(new File(directory.concat("\\" + entry.getKey() + ".csv"))));
				writer.write(entry.getValue());
				writer.flush();
				writer.close();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		
		
	}
	
}

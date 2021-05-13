package model.testparser;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import constants.KeggCalculatorConstants;
import model.KeggCompoundObject;
import model.KeggDataObject;
import model.KeggECObject;
import model.KeggKOObject;
import model.KeggModuleObject;
import model.KeggReactionObject;
import model.KeyComponent;
import model.Reversibility;
import model.TypeOfCompound;
import parser.KeggDataParser;

//kommt auf kompponenten wie dATP die keinen sinn machen aber nicht ausgeschlossen werden können
//brauchen also einen weg um komponenten finden de strukturell ähnlich sind
//suche die komponenten paare aus modulen raus
//map compound liste and möglichen verbundenen anderen komponenten


//ideas:
//limit compounds key compound list - done
//limit reactions? keyreaction list
//limit compound compound connections
/**
 * class for testing pathway finder and writing pathway reactions in output csv
 * file
 *
 */
public class TestFindPathway {

	public static void main(String[] args) {
		KeggDataObject keggData = new KeggDataObject();
		KeggDataParser.parseModule2ModuleName(keggData, KeggCalculatorConstants.MODULE_LIST_DIR);
		KeggDataParser.parseReaction2ReactionName(keggData, KeggCalculatorConstants.REACTION_LIST_DIR);
		KeggDataParser.parseKo2KoName(keggData, KeggCalculatorConstants.KO_NUMBER_LIST_DIR);
		KeggDataParser.parseEc2EcName(keggData, KeggCalculatorConstants.EC_NUMBER_LIST_DIR);
		KeggDataParser.parseCompound2CompoundName(keggData, KeggCalculatorConstants.COMPOUND_NUMBER_LIST_DIR);
		KeggDataParser.parseGlycan2GlycanName(keggData, KeggCalculatorConstants.GLYCAN_NUMBER_LIST_DIR);
		KeggDataParser.parseModule2Reaction(keggData, KeggCalculatorConstants.MODULE_TO_REACTION_DIR);
		KeggDataParser.parseModule2KoNumber(keggData, KeggCalculatorConstants.MODULE_TO_KO_NUMBER_DIR);
		KeggDataParser.parseModule2EcNumber(keggData, KeggCalculatorConstants.MODULE_TO_EC_NUMBER_DIR);
		KeggDataParser.parseModule2Compounds(keggData, KeggCalculatorConstants.MODULE_TO_COMPOUND_DIR);
		KeggDataParser.parseModule2Glycans(keggData, KeggCalculatorConstants.MODULE_TO_GLYCAN_DIR);
		KeggDataParser.parseKo2Reactions(keggData, KeggCalculatorConstants.KO_TO_REACTION_DIR);
		KeggDataParser.parseEc2Reaction(keggData, KeggCalculatorConstants.EC_TO_REACTION_DIR);
		KeggDataParser.parseSubstrate2Reaction(keggData, KeggCalculatorConstants.SUBSTRATE_TO_REACTION_DIR);
		KeggDataParser.parseProduct2Reaction(keggData, KeggCalculatorConstants.PRODUCT_TO_REACTION_DIR);
		KeggDataParser.parseKo2EcNumber(keggData, KeggCalculatorConstants.KO_TO_EC_DIR);
		long start = System.currentTimeMillis();
		KeggDataObject keggData2 = keggData.cloneData();
		TestFindPathway app = new TestFindPathway(keggData2);
		long end = System.currentTimeMillis();
//		app.findPathways();
//		app.getCsvContentList();
		System.out.println("Number of pathways: " + app.findPathways() + ", took: "
				+ (System.currentTimeMillis() - start) + " ms");
//		Gson gson = new GsonBuilder().setPrettyPrinting().create();
//		ArrayList<String> output = app.getCsvContentList();
//		for (int it = 0; it < output.size(); it++) {
//			BufferedWriter wr;
//			try {
//				wr = new BufferedWriter(
//						new FileWriter("src/main/resources/KEGG/essentialFiles/testPathwayFinder/" + it + ".csv"));
//				wr.write(output.get(it));
//				wr.flush();
//				wr.close();
//			} catch (IOException e) {
//				// TODO Auto-generated catch block
//				e.printStackTrace();
//				System.out.println("File oopsie!");
//			}
//
//		}

//		System.out.println(gson.toJson(output));
	}

	KeggCompoundObject inputSubstrat;
	KeggCompoundObject inputProduct;
	ArrayList<ArrayList<KeggCompoundObject>> pathwayscompound = new ArrayList<ArrayList<KeggCompoundObject>>();
	ArrayList<ArrayList<KeggReactionObject>> pathwaysreaction = new ArrayList<ArrayList<KeggReactionObject>>();
	ArrayList<KeggCompoundObject> compounds = new ArrayList<KeggCompoundObject>();
	ArrayList<KeggReactionObject> reactions = new ArrayList<KeggReactionObject>();
	HashSet<KeggCompoundObject> excludeCompounds;
	HashSet<KeggReactionObject> excludeReactions = new HashSet<KeggReactionObject>();
	KeggDataObject keggData;
	ArrayList<String> csvContentList;
	HashSet<String> compIgnoreSet = new HashSet<String>();
	HashSet<String> compoundSet;
	HashMap<String, HashSet<String>> compoundConnectionsMap;
	int maxReactionNumber;
	int maxReactions;
	int iterations = 0;
	int levelR = 0;
	int levelC = 0;
	int minReactions;
	HashSet<KeggReactionObject> reactionSet;

	public TestFindPathway(KeggDataObject keggData) {
		this.keggData = keggData;
		this.inputSubstrat = keggData.getCompound("C00267");
		this.inputProduct = keggData.getCompound("C00022");
		this.excludeReactions = new HashSet<KeggReactionObject>();
		this.excludeCompounds = new HashSet<KeggCompoundObject>();
		this.csvContentList = new ArrayList<String>();
		this.maxReactionNumber = this.inputProduct.getReactions().size() + 1; // this.inputProduct.getReactions().size()+1
		this.compIgnoreSet = getCompoundIgnoreSet(keggData, this.maxReactionNumber);
		this.compoundSet = new HashSet<String>();
		this.reactionSet = getReactionList(this.keggData);
		this.compoundConnectionsMap = getCompoundConnections();
//		for (int ignore = 0; ignore <= 20; ignore++) { // java.lang.IndexOutOfBoundsException
//			if (ignore < 10) {
//				this.compIgnoreSet.add("C0000" + String.valueOf(ignore));
//			} else {
//				this.compIgnoreSet.add("C000" + String.valueOf(ignore));
//			}
//		}
		this.maxReactions =15;
		this.minReactions = 0;
	}

	public int findPathways() {
		this.compoundSet = getCompoundList();
		this.compounds.add(this.inputSubstrat);
		for (KeggReactionObject r : this.inputSubstrat.getReactions()) { // vorher c.getReactions();
			if (this.inputSubstrat.getSubstrateReactions().contains(r)) {
				boolean isSubstrate = true;
				this.excludeReactions.add(r);
				System.out.println(r.getReactionId());
				HashSet<String> possibleConnectionSet = this.compoundConnectionsMap.get(this.inputSubstrat.getCompoundId());
				nextLevelReaction(r, isSubstrate, possibleConnectionSet);
				this.excludeReactions.remove(r);
			} else if (this.inputSubstrat.getProductReactions().contains(r)) {
				boolean isSubstrate = false;
				this.excludeReactions.add(r);
				System.out.println(r.getReactionId());
				HashSet<String> possibleConnectionSet = this.compoundConnectionsMap.get(this.inputSubstrat.getCompoundId());
				nextLevelReaction(r, isSubstrate,possibleConnectionSet);
				this.excludeReactions.remove(r);
			} else {
				System.out.println("oopsie!");
			}
		}
		if (!this.pathwayscompound.isEmpty()) {
			ArrayList<KeggCompoundObject> cList = this.pathwayscompound.get(0);
			System.out.println(cList.size());
		} else {
			System.out.println("No Pathways!");
		}
		return this.pathwayscompound.size();
	}

	private void nextLevelReaction(KeggReactionObject r, boolean isSubstrate, HashSet<String> possibleConnectionSet) {
		iterations++;
		levelR++;
		this.reactions.add(r);
		if (isSubstrate) {
			for (KeggCompoundObject c : r.getProducts()) {
				if (possibleConnectionSet.contains(c.getCompoundId()) && !this.excludeCompounds.contains(c) && this.compoundSet.contains(c.getCompoundId())&& !this.compIgnoreSet.contains(c.getCompoundId())) { //
					if (!c.equals(this.inputProduct)) {
						possibleConnectionSet = this.compoundConnectionsMap.get(c.getCompoundId());
						this.excludeCompounds.add(c);
						iterations++;
						if (iterations % 1000 == 0) {
							System.out.println("exclude Reactions size: " + this.excludeReactions.size());
							System.out.println("Substrate: " + iterations + " ReactionLvl: " + levelR + " CompoundLvl: "
									+ levelC + " Reaction: " + r.getReactionId() + " Compound: " + c.getCompoundId()
									+ " PW: " + this.pathwayscompound.size());
						}
						nextLevelCompound(c, possibleConnectionSet);
						this.excludeCompounds.remove(c);
					} else {
						nextLevelCompound(c, possibleConnectionSet);
					}
				}
			}
		} else {
			for (KeggCompoundObject c : r.getSubstrates()) {
				if (possibleConnectionSet.contains(c.getCompoundId()) && !this.excludeCompounds.contains(c) && this.compoundSet.contains(c.getCompoundId())&& !this.compIgnoreSet.contains(c.getCompoundId())) { //&&  !this.compIgnoreSet.contains(c.getCompoundId())
					if (!c.equals(this.inputProduct)) {
						possibleConnectionSet = this.compoundConnectionsMap.get(c.getCompoundId());
						this.excludeCompounds.add(c);
						iterations++;
						if (iterations % 1000 == 0) {
							System.out.println("exclude Reactions size: " + this.excludeReactions.size());
							System.out.println("Product: " + iterations + " ReactionLvl: " + levelR + " CompoundLvl: "
									+ levelC + " Reaction: " + r.getReactionId() + " Compound: " + c.getCompoundId()
									+ " PW: " + this.pathwayscompound.size());
						}
						nextLevelCompound(c, possibleConnectionSet);
						this.excludeCompounds.remove(c);
					} else {
						nextLevelCompound(c,possibleConnectionSet);
					}
				}
			}
		}
		this.reactions.remove(r);
		levelR--;
	}

	private void nextLevelCompound(KeggCompoundObject c, HashSet<String> possibleConnectionSet) {
		levelC++;
		if (c.equals(this.inputProduct) && this.minReactions < this.reactions.size()) {
			ArrayList<KeggCompoundObject> newCompounds = new ArrayList<KeggCompoundObject>();
			for (KeggCompoundObject new_c : this.compounds) {
				newCompounds.add(new_c);
			}
			ArrayList<KeggReactionObject> newReactions = new ArrayList<KeggReactionObject>();
			for (KeggReactionObject new_r : this.reactions) {
				newReactions.add(new_r);
			}
			this.pathwayscompound.add(newCompounds);
			this.pathwaysreaction.add(newReactions);
		} else {
			this.compounds.add(c);
			boolean isSubstrate;
			for (KeggReactionObject r : c.getReactions()) { // get all reactions for this compounds
				if (!this.excludeReactions.contains(r) && this.reactions.size() < this.maxReactions && this.reactionSet.contains(r)) {
					if (c.getSubstrateReactions().contains(r)) {
						isSubstrate = true;
						this.excludeReactions.add(r);
						nextLevelReaction(r, isSubstrate, possibleConnectionSet);
						this.excludeReactions.remove(r);
					} else if (c.getProductReactions().contains(r)) {
						isSubstrate = false;
						this.excludeReactions.add(r);
						nextLevelReaction(r, isSubstrate, possibleConnectionSet);
						this.excludeReactions.remove(r);
					} else {
						System.out.println("oopsie!");
					}
				}
			}
			this.compounds.remove(c);
		}
		levelC--;
	}

	public ArrayList<String> getCsvContentList() {
		for (int pathwayIterator = 0; pathwayIterator < this.pathwaysreaction.size(); pathwayIterator++) {
			ArrayList<KeggReactionObject> pathwayReactionList = this.pathwaysreaction.get(pathwayIterator);
			ArrayList<KeggCompoundObject> pathwayCompoundList = this.pathwayscompound.get(pathwayIterator);
			String CsvContent = "steps;reactionNumber;koNumbers;ecNumbers;stochCoeff;compound;compoundType;keyComponent;reversibility;taxonomy";
			CsvContent += ("\n");
			int step = 0;
			for (KeggReactionObject reaction : pathwayReactionList) {
				step++;
				for (KeggCompoundObject compound : reaction.getCompounds()) {
					CsvContent += (String.valueOf(step) + ";");
					CsvContent += (reaction.getReactionId() + ";");
					int commaCounter = 0;
					for (KeggKOObject ko : reaction.getKonumbers()) {
						CsvContent += (ko.getKoId());
						if (commaCounter < reaction.getKonumbers().size() - 1) {
							CsvContent += (",");
							commaCounter++;
						}
					}
					commaCounter = 0;
					CsvContent += (";");
					for (KeggECObject ec : reaction.getEcnumbers()) {
						CsvContent += (ec.getEcId());
						if (commaCounter < reaction.getEcnumbers().size() - 1) {
							CsvContent += (",");
							commaCounter++;
						}
					}
					CsvContent += (";");
					if (reaction.getSubstrate(compound.getCompoundId()) != null) {
						CsvContent += (reaction.getStochiometrySubstrates(compound.getCompoundId()) + ";");
						CsvContent += (compound.getCompoundId() + ";");
						CsvContent += (TypeOfCompound.SUBSTRATE + ";");
					} else {
						CsvContent += (reaction.getStochiometryProducts(compound.getCompoundId()) + ";");
						CsvContent += (compound.getCompoundId() + ";");
						CsvContent += (TypeOfCompound.PRODUCT + ";");
					}
					if (pathwayCompoundList.contains(compound)) {
						CsvContent += KeyComponent.KEY;
					} else {
						CsvContent += KeyComponent.NOTKEY;
					}
					CsvContent += (";" + Reversibility.REVERSIBLE + ";" + "" + "\n");
				}
			}
			this.csvContentList.add(CsvContent);
		}
		return this.csvContentList;
	}

	private HashSet<String> getCompoundIgnoreSet(KeggDataObject keggDataClone, int maxReactionNumber) {
		HashSet<String> compoundIgnoreSet = new HashSet<String>();
		HashSet<KeggCompoundObject> compSetComplete = keggDataClone.getCompounds();
		for (KeggCompoundObject comp : compSetComplete) {
			int numberOfReactions = comp.getReactions().size();
			// number of reactions in this compound exceeds maximal number of allowed
			// reactions
			if (numberOfReactions > maxReactionNumber) {
				compoundIgnoreSet.add(comp.getCompoundId());
			}
		}
		return compoundIgnoreSet;
	}

	private HashSet<String> getCompoundList() {
		HashSet<String> compoundList = new HashSet<String>();
		try {
			BufferedReader reader = new BufferedReader(
					new FileReader(new File("src/main/resources/KEGG/essentialFiles/KeyCompoundList.csv")));
			String line = reader.readLine();
			while (line != null) {
				compoundList.add(line);
				line = reader.readLine();
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return compoundList;
	}
	
	private HashSet<KeggReactionObject> getReactionList(KeggDataObject keggData){
		HashSet<KeggReactionObject> reactionSet = new HashSet<KeggReactionObject>();
		for(KeggModuleObject module : keggData.getModules()) {
			reactionSet.addAll(module.getReactions());
		}
		return reactionSet;
	}
	
	private HashMap<String, HashSet<String>> getCompoundConnections(){
		HashMap<String, HashSet<String>> compoundConnections = new HashMap<String, HashSet<String>>();
		try {
			BufferedReader reader = new BufferedReader(
					new FileReader(new File("src/main/resources/KEGG/essentialFiles/CompoundConnectionsDownload.csv")));
			String line = reader.readLine();
			line = reader.readLine();
			while (line != null) {
				String[] compounds = line.split(";");
			
		if(!compoundConnections.containsKey(compounds[0])) {
					HashSet<String> compoundConnect = new HashSet<String>();
					compoundConnect.add(compounds[1]);
					compoundConnections.put(compounds[0], compoundConnect);
				}
				else {
					HashSet<String> compoundConnect = compoundConnections.get(compounds[0]);
					compoundConnect.add(compounds[1]);
					compoundConnections.put(compounds[0], compoundConnect);
				}
		if(!compoundConnections.containsKey(compounds[1])) {
			HashSet<String> compoundConnect = new HashSet<String>();
			compoundConnect.add(compounds[0]);
			compoundConnections.put(compounds[1], compoundConnect);
		}
		else {
			HashSet<String> compoundConnect = compoundConnections.get(compounds[1]);
			compoundConnect.add(compounds[0]);
			compoundConnections.put(compounds[1], compoundConnect);
		}
				line = reader.readLine();
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return compoundConnections;
	}

}
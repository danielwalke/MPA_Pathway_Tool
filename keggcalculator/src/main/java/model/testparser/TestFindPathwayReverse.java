package model.testparser;

import java.util.ArrayList;
import java.util.HashSet;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import constants.KeggCalculatorConstants;
import model.KeggCompoundObject;
import model.KeggDataObject;
import model.KeggECObject;
import model.KeggKOObject;
import model.KeggReactionObject;
import model.KeyComponent;
import parser.KeggDataParser;
/**
 * class for testing reverse pathway finder and writing pathway reactions in output csv file
 *
 */
public class TestFindPathwayReverse {

	public static void main(String[] args) {

		KeggDataObject keggData = new KeggDataObject();

//		KeggDataParser.parseModule2ModuleName(keggData, "src/main/resources/KEGG/kegg_list_module_2020_05_13.csv");
//		KeggDataParser.parseReaction2ReactionName(keggData,
//				"src/main/resources/KEGG/kegg_list_reaction_2020_05_12.csv");
//		KeggDataParser.parseKo2KoName(keggData, "src/main/resources/KEGG/kegg_list_ko_2020_05_12.csv");
//		KeggDataParser.parseEc2EcName(keggData, "src/main/resources/KEGG/kegg_list_ec_2020_05_12.csv");
//		KeggDataParser.parseCompound2CompoundName(keggData,
//				"src/main/resources/KEGG/kegg_list_compounds_2020_05_05.csv");
//		KeggDataParser.parseGlycan2GlycanName(keggData, "src/main/resources/KEGG/kegg_list_glycans_2020_05_11.csv");
//		KeggDataParser.parseModule2Reaction(keggData,
//				"src/main/resources/KEGG/kegg_connection_module2reaction_2020_05_14.csv");
//		KeggDataParser.parseModule2KoNumber(keggData,
//				"src/main/resources/KEGG/kegg_connection_module2ko_2020_05_14.csv");
//		KeggDataParser.parseModule2EcNumber(keggData,
//				"src/main/resources/KEGG/kegg_connection_module2ec_2020_05_14.csv");
//		KeggDataParser.parseModule2Compounds(keggData,
//				"src/main/resources/KEGG/kegg_connection_module2compound_2020_05_14.csv");
//		KeggDataParser.parseModule2Glycans(keggData,
//				"src/main/resources/KEGG/kegg_connection_module2glycan_2020_05_14.csv");
//		KeggDataParser.parseKo2Reactions(keggData,
//				"src/main/resources/KEGG/kegg_connection_ko2reaction_2020_05_14.csv");
//		KeggDataParser.parseEc2Reaction(keggData, "src/main/resources/KEGG/kegg_connection_ec2reaction_2020_05_14.csv");
//		KeggDataParser.parseSubstrate2Reaction(keggData,
//				"src/main/resources/KEGG/kegg_list_reaction2Substrates_270920.csv");
//		KeggDataParser.parseProduct2Reaction(keggData, "src/main/resources/KEGG/kegg_list_reaction2Product_270920.csv");
//		KeggDataParser.parseKo2EcNumber(keggData, "src/main/resources/KEGG/kegg_connection_ko2ec_2020_05_14.csv");

		
		KeggDataParser.parseModule2ModuleName(keggData, KeggCalculatorConstants.MODULE_LIST_DIR);
		KeggDataParser.parseReaction2ReactionName(keggData, KeggCalculatorConstants.REACTION_LIST_DIR);
		KeggDataParser.parseKo2KoName(keggData, KeggCalculatorConstants.KO_NUMBER_LIST_DIR);
		KeggDataParser.parseEc2EcName(keggData, KeggCalculatorConstants.EC_NUMBER_LIST_DIR);
		KeggDataParser.parseCompound2CompoundName(keggData,KeggCalculatorConstants.COMPOUND_NUMBER_LIST_DIR);
		KeggDataParser.parseGlycan2GlycanName(keggData,KeggCalculatorConstants.GLYCAN_NUMBER_LIST_DIR);
		KeggDataParser.parseModule2Reaction(keggData,KeggCalculatorConstants.MODULE_TO_REACTION_DIR);
		KeggDataParser.parseModule2KoNumber(keggData,KeggCalculatorConstants.MODULE_TO_KO_NUMBER_DIR);
		KeggDataParser.parseModule2EcNumber(keggData,KeggCalculatorConstants.MODULE_TO_EC_NUMBER_DIR);
		KeggDataParser.parseModule2Compounds(keggData,KeggCalculatorConstants.MODULE_TO_COMPOUND_DIR);
		KeggDataParser.parseModule2Glycans(keggData,KeggCalculatorConstants.MODULE_TO_GLYCAN_DIR);
		KeggDataParser.parseKo2Reactions(keggData,KeggCalculatorConstants.KO_TO_REACTION_DIR);
		KeggDataParser.parseEc2Reaction(keggData,KeggCalculatorConstants.EC_TO_REACTION_DIR);
		KeggDataParser.parseSubstrate2Reaction(keggData,KeggCalculatorConstants.SUBSTRATE_TO_REACTION_DIR);
		KeggDataParser.parseProduct2Reaction(keggData,KeggCalculatorConstants.PRODUCT_TO_REACTION_DIR);
		KeggDataParser.parseKo2EcNumber(keggData,KeggCalculatorConstants.KO_TO_EC_DIR);
		long start = System.currentTimeMillis();
		KeggDataObject keggData2 = keggData.cloneData();
		TestFindPathwayReverse app = new TestFindPathwayReverse(keggData2);
		long end = System.currentTimeMillis();
//		app.findPathways();
//		app.getCsvContentList();
		System.out.println("Number of pathways: " + app.findPathways() + ", took: " + (end - start) + " ms");
		Gson gson = new GsonBuilder().setPrettyPrinting().create();
		ArrayList<String> output = app.getCsvContentList();
		System.out.println(gson.toJson(output));
	}

	KeggCompoundObject inputSubstrat;
	KeggCompoundObject inputProduct;
	ArrayList<ArrayList<KeggCompoundObject>> pathwayscompound = new ArrayList<ArrayList<KeggCompoundObject>>();
	ArrayList<ArrayList<KeggReactionObject>> pathwaysreaction = new ArrayList<ArrayList<KeggReactionObject>>();
	ArrayList<KeggCompoundObject> compounds = new ArrayList<KeggCompoundObject>();
	ArrayList<KeggReactionObject> reactions = new ArrayList<KeggReactionObject>();
	HashSet<KeggCompoundObject> excludeCompounds = new HashSet<KeggCompoundObject>();
	HashSet<KeggReactionObject> excludeReactions = new HashSet<KeggReactionObject>();
	KeggDataObject keggData;
	ArrayList<String> csvContentList;

	public TestFindPathwayReverse(KeggDataObject keggData) {
		this.keggData = keggData;
		this.inputSubstrat = keggData.getCompound("C00267");
		this.inputProduct = keggData.getCompound("C00022");
		this.csvContentList = new ArrayList<String>();
	}

	public int findPathways() {
		this.compounds.add(this.inputSubstrat);
		for (KeggReactionObject r : this.inputSubstrat.getProductReactions()) { // vorher c.getReactions();
			System.out.println(r.getReactionId());
			this.excludeReactions.add(r);
			nextLevelReaction(r);
		}
	
		if (!this.pathwayscompound.isEmpty()) {
			ArrayList<KeggCompoundObject> cList = this.pathwayscompound.get(0); 
//			System.out.println(cList.size());
		} else {
			System.out.println("No Pathways!");
		}
		return this.pathwayscompound.size();
	}

	public ArrayList<String> getCsvContentList() {
		for (int pathwayIterator = 0; pathwayIterator<this.pathwaysreaction.size(); pathwayIterator++) {
		ArrayList<KeggReactionObject> pathwayReactionList = this.pathwaysreaction.get(pathwayIterator);
		ArrayList<KeggCompoundObject> pathwayCompoundList = this.pathwayscompound.get(pathwayIterator);
			String CsvContent = "steps;reactionNumber;koNumbers;ecNumbers;stochCoeff;compound;substrate/product;keyComponent";			
			CsvContent+=("\n");
			int step = 0;
			for (KeggReactionObject reaction : pathwayReactionList) {
				step++;
				for (KeggCompoundObject compound : reaction.getCompounds()) {
					CsvContent+=(String.valueOf(step) + ";");
					CsvContent+=(reaction.getReactionId() + ";");
					int commaCounter = 0;
					for (KeggKOObject ko : reaction.getKonumbers()) {
						CsvContent+=(ko.getKoId());
						if (commaCounter < reaction.getKonumbers().size()-1) {
							CsvContent+=(",");
							commaCounter++;
						}
					}
					CsvContent+=(";");
					commaCounter = 0;
					for (KeggECObject ec : reaction.getEcnumbers()) {
						CsvContent+=(ec.getEcId());
						if (commaCounter < reaction.getEcnumbers().size()-1) {
							CsvContent+=(",");
							commaCounter++;
						}
					}
					CsvContent+=(";");
					if (reaction.getSubstrate(compound.getCompoundId()) != null) {
						CsvContent+=(reaction.getStochiometrySubstrates(compound.getCompoundId()) + ";");
						CsvContent+=(compound.getCompoundId() + ";");
						CsvContent+=("Substrate" + ";");
					} else {
						CsvContent+=(reaction.getStochiometryProducts(compound.getCompoundId()) + ";");
						CsvContent+=(compound.getCompoundId() + ";");
						CsvContent+=("Product" + ";");
					}
					if(pathwayCompoundList.contains(compound)) {
						CsvContent+=KeyComponent.KEY;
						CsvContent+="\n";
					}
					else {
						CsvContent+=KeyComponent.NOTKEY;
						CsvContent+="\n";
					}
				}
			}
			this.csvContentList.add(CsvContent);
		}
		return this.csvContentList;
	}
	
	private void nextLevelReaction(KeggReactionObject r) {
		this.reactions.add(r);
		HashSet<String> compIgnoreSet = new HashSet<String>();
		for (int ignore = 0; ignore < 20; ignore++) { // java.lang.IndexOutOfBoundsException
			if (ignore < 10) {
				compIgnoreSet.add("C0000" + String.valueOf(ignore));
			} else {
				compIgnoreSet.add("C000" + String.valueOf(ignore));
			}
		}
		for (KeggCompoundObject c : r.getSubstrates()) {
			if (!this.excludeCompounds.contains(c) && !compIgnoreSet.contains(c.getCompoundId())) {
				if (!c.equals(this.inputProduct)) {
					this.excludeCompounds.add(c);
				}
				nextLevelCompound(c);
			}
		}
		this.reactions.remove(r);
	}

	private void nextLevelCompound(KeggCompoundObject c) {
		this.compounds.add(c);
		if (c.equals(this.inputProduct)) {
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
			for (KeggReactionObject r : c.getProductReactions()) { 
				if (!this.excludeReactions.contains(r)) {
					this.excludeReactions.add(r);
					nextLevelReaction(r);
				}
			}
		}
		this.compounds.remove(c);
	}

}


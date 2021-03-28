package model.testparser;

import java.util.HashSet;

import model.KeggCompoundObject;
import model.KeggDataObject;
import model.KeggReactionObject;
import parser.KeggDataParser;
/**
 * test class for finding reactions from given compound with parsed kegg data
 *
 */
public class TestFindReaction {


	public static void main(String[] args) {
		KeggDataObject keggData = new KeggDataObject();

		KeggDataParser.parseModule2ModuleName(keggData,"src/main/resources/KEGG/kegg_list_module_2020_05_13.csv" );
		KeggDataParser.parseReaction2ReactionName(keggData,"src/main/resources/KEGG/kegg_list_reaction_2020_05_12.csv");
		KeggDataParser.parseKo2KoName(keggData,"src/main/resources/KEGG/kegg_list_ko_2020_05_12.csv");
		KeggDataParser.parseEc2EcName(keggData,"src/main/resources/KEGG/kegg_list_ec_2020_05_12.csv");
		KeggDataParser.parseCompound2CompoundName(keggData,"src/main/resources/KEGG/kegg_list_compounds_2020_05_05.csv");
		KeggDataParser.parseGlycan2GlycanName(keggData,"src/main/resources/KEGG/kegg_list_glycans_2020_05_11.csv");
		KeggDataParser.parseModule2Reaction(keggData, "src/main/resources/KEGG/kegg_connection_module2reaction_2020_05_14.csv");
		KeggDataParser.parseModule2KoNumber(keggData, "src/main/resources/KEGG/kegg_connection_module2ko_2020_05_14.csv");
		KeggDataParser.parseModule2EcNumber(keggData, "src/main/resources/KEGG/kegg_connection_module2ec_2020_05_14.csv");
		KeggDataParser.parseModule2Compounds(keggData, "src/main/resources/KEGG/kegg_connection_module2compound_2020_05_14.csv");
		KeggDataParser.parseModule2Glycans(keggData, "src/main/resources/KEGG/kegg_connection_module2glycan_2020_05_14.csv");
		KeggDataParser.parseKo2Reactions(keggData, "src/main/resources/KEGG/kegg_connection_ko2reaction_2020_05_14.csv");
		KeggDataParser.parseEc2Reaction(keggData, "src/main/resources/KEGG/kegg_connection_ec2reaction_2020_05_14.csv");
		KeggDataParser.parseSubstrate2Reaction(keggData, "src/main/resources/KEGG/kegg_list_reaction2Substrates_270920.csv");
		KeggDataParser.parseProduct2Reaction(keggData, "src/main/resources/KEGG/kegg_list_reaction2Product_270920.csv");
		KeggDataParser.parseKo2EcNumber(keggData, "src/main/resources/KEGG/kegg_connection_ko2ec_2020_05_14.csv");

		String input = "C00008";
		
		KeggCompoundObject c = keggData.getCompound(input);
		HashSet<KeggReactionObject> reactions = c.getReactions();
		
		System.out.println("Reactions: " + reactions.size());
		
//		List<KeggReaction> reactionList = new ArrayList<KeggReaction>();
//		for (KeggReaction reactionJson : keggData.getReactions()) {
//			List<KeggCompound> substrateListJson = null; //reactionJson.getSubstrates();
//			//				List<KeggCompound> productListJson = reactionJson.getProducts();
//			for (KeggCompound substrateJson : substrateListJson) {
//				for (KeggCompound newProductReq : reactionRequest.getProducts()) {
//					if (substrateJson.getCompoundId().equals(newProductReq.getCompoundId())) {
//						reactionList.add(reactionJson);
//					}
//				}
//			}
//		}
	}

}

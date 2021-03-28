package model.testparser;

import java.util.HashSet;

import constants.KeggCalculatorConstants;
import model.KeggCompoundObject;
import model.KeggDataObject;
import model.KeggReactionObject;
import parser.KeggDataParser;
/**
 * class for testing successful parsing and cloning of all keggdata
 *
 *
 */
public class TestParsing {
//TODO: Glycans
	public static void main(String[] args) throws Exception {

		KeggDataObject keggData = new KeggDataObject();
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
		
		KeggDataObject clone = keggData.cloneData();
		KeggDataObject keggDataClone = clone;
		KeggCompoundObject substrateReq = keggDataClone.getCompound("C00001");
		HashSet<KeggReactionObject> reactionSet = substrateReq.getSubstrateReactions();
//		HashMap<KeggCompound, HashSet<KeggReaction>> productSortedReactions = new HashMap<KeggCompound, HashSet<KeggReaction>>();
//		HashSet<KeggCompound> products = new HashSet<KeggCompound>();
//		for (KeggReaction reaction : reactionSet) {
//			for (KeggCompound product : reaction.getProducts()) {
//				products.add(product);
//
//			}
//		}
//		for (KeggCompound product : products) {
//			HashSet<KeggReaction> sortedReactionSet = new HashSet<KeggReaction>();
//			for (KeggReaction productReaction : product.getProductReactions()) {
//				if (reactionSet.contains(productReaction)) {
//					sortedReactionSet.add(productReaction);
//				}
//			}
//			productSortedReactions.put(product, sortedReactionSet);
//		}
//		for(Entry<KeggCompound, HashSet<KeggReaction>> entry : productSortedReactions.entrySet()) {
//			System.out.println(entry.getKey().getCompoundId());
//			for(KeggReaction r: entry.getValue()) {
//				System.out.println(r.getReactionId());
//			}
//		}
//		System.out.println(productSortedReactions);
//		System.out.println("clone equals keggData " + clone.equals(keggData));
//		KeggCompound c1 = keggData.getCompound("C00001");
//		KeggCompound c1_clone = clone.getCompound("C00001");
//		System.out.println("clone compound: " + c1.equals(c1_clone));
		
		// KeggDataJson.writeJson(keggData);

		System.out.println("Modules: " + keggData.getModules().size());
		System.out.println("Reactions: " + keggData.getReactions().size());
		System.out.println("Kos: " + keggData.getKoNumbers().size());
		System.out.println("Ecs: " + keggData.getEcnumbers().size());
		System.out.println("Compounds: " + keggData.getCompounds().size());

		System.out.println("ModulesClone: " + clone.getModules().size());
		System.out.println("ReactionsClone: " + clone.getReactions().size());
		System.out.println("KosClone: " + clone.getKoNumbers().size());
		System.out.println("EcsClone: " + clone.getEcnumbers().size());
		System.out.println("CompoundsClone: " + clone.getCompounds().size());
		System.out.println(clone.getReaction("R11620").getSubstrates());
	}
	
	public static void print(String string) {
		System.out.println(string);
	}

}

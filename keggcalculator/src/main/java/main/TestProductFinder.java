package main;

import java.util.HashMap;
import java.util.HashSet;

import constants.KeggCalculatorConstants;
import model.KeggCompound;
import model.KeggCompoundObject;
import model.KeggDataObject;
import model.KeggReaction;
import model.KeggReactionObject;
import parser.KeggDataParser;

public class TestProductFinder {

	public static void main(String[] args) {
		TestProductFinder prod = new TestProductFinder();
		System.out.println(prod.getProductSortedReactions("C00267"));
	}
	public synchronized KeggDataObject cloneKeggData() {
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
		return keggData;
	}
	//returns all possible forward reactions for a substrate
	public HashSet<KeggReaction> getReactionSet(String substrateId) {
		KeggDataObject keggDataClone = cloneKeggData();
		KeggCompoundObject substrateReq = keggDataClone.getCompound(substrateId);
		HashSet<KeggReactionObject> reactionSetRaw = substrateReq.getSubstrateReactions();
		HashSet<KeggReaction> reactionSet = new HashSet<KeggReaction>();
		for(KeggReactionObject reactionRaw : reactionSetRaw) {
			KeggReaction reaction = new KeggReaction(reactionRaw.getReactionId(), reactionRaw.getReactionName(), true);
			reactionSet.add(reaction);
		}
		return reactionSet;
	}

	//return all possible forward reactions for a substrate and sort them according to their products
	public HashMap<KeggCompound, HashSet<KeggReaction>> getProductSortedReactions(String substrateId) {
		KeggDataObject keggDataClone = cloneKeggData();
		HashSet<KeggReaction> reactionSet = getReactionSet(substrateId);
		HashSet<KeggReactionObject> reactionSetRaw = new HashSet<KeggReactionObject>();
		for(KeggReaction reaction : reactionSet) {
			reactionSetRaw.add(keggDataClone.getReaction(reaction.getReactionId()));
		}
		HashMap<KeggCompound, HashSet<KeggReaction>> productSortedReactions = new HashMap<KeggCompound, HashSet<KeggReaction>>();
		HashSet<KeggCompoundObject> productsRaw = new HashSet<KeggCompoundObject>();
		for (KeggReactionObject reaction : reactionSetRaw) {
			for (KeggCompoundObject product : reaction.getProducts()) {
				productsRaw.add(product);
			}
		}
		for (KeggCompoundObject productRaw : productsRaw) {
			HashSet<KeggReaction> sortedReactionSet = new HashSet<KeggReaction>();
			for (KeggReactionObject productReactionRaw : productRaw.getProductReactions()) {
				if (reactionSetRaw.contains(productReactionRaw)) {
					KeggReaction substrateReaction = new KeggReaction(productReactionRaw.getReactionId(), productReactionRaw.getReactionName(), true);
					sortedReactionSet.add(substrateReaction);
				}
			}
			KeggCompound product = new KeggCompound(productRaw.getCompoundId(), productRaw.getCompoundName());
			productSortedReactions.put(product, sortedReactionSet);
		}
		return productSortedReactions;
	}
}

package model.testparser;

import java.util.ArrayList;
import java.util.HashSet;

import model.KeggCompoundObject;
import model.KeggDataObject;
import model.KeggECObject;
import model.KeggKOObject;
import model.KeggReactionObject;
import model.KeyComponent;
import model.Reversibility;
import model.Taxonomy;
import model.TypeOfCompound;
/**
 * class for finding all forward reactions from one compound to another
 * input: compound as substrate and another compound as a product
 * finds reactions between these to compounds 
 *
 */
public class PathwayFinder {
	private KeggCompoundObject inputSubstrat;
	private KeggCompoundObject inputProduct;
	private ArrayList<ArrayList<KeggCompoundObject>> pathwayscompound;
	private ArrayList<ArrayList<KeggReactionObject>> pathwaysreaction;
	private ArrayList<KeggCompoundObject> compounds;
	private ArrayList<KeggReactionObject> reactions;
	private HashSet<KeggCompoundObject> excludeCompounds;
	private HashSet<KeggReactionObject> excludeReactions;
	private KeggDataObject keggData;
	private ArrayList<String> csvContentList;
	private HashSet<String> compIgnoreSet;

	public PathwayFinder(KeggDataObject keggData, String substrateId, String productId) {
		this.keggData = keggData;
		this.inputSubstrat = keggData.getCompound(substrateId);
		this.inputProduct = keggData.getCompound(productId);
		this.pathwayscompound = new ArrayList<ArrayList<KeggCompoundObject>>();
		this.pathwaysreaction = new ArrayList<ArrayList<KeggReactionObject>>();
		this.compounds = new ArrayList<KeggCompoundObject>();
		this.reactions = new ArrayList<KeggReactionObject>();
		this.excludeCompounds = new HashSet<KeggCompoundObject>();
		this.excludeReactions = new HashSet<KeggReactionObject>();
		this.csvContentList = new ArrayList<String>();
		this.compIgnoreSet = new HashSet<String>();
	}

	//finds all reactions
	public int findPathways() {
		this.compIgnoreSet = getCompIgnoreSet();
		this.compounds.add(this.inputSubstrat);
		for (KeggReactionObject r : this.inputSubstrat.getSubstrateReactions()) {
			this.excludeReactions.add(r);
			nextLevelReaction(r);
		}

		if (!this.pathwayscompound.isEmpty()) {
			ArrayList<KeggCompoundObject> cList = this.pathwayscompound.get(0);
			System.out.println(cList.size());
		} else {
			System.out.println("No Pathways!");
		}
		return this.pathwayscompound.size();
	}

	//writes all found pathways in a String as a csv- content
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
						CsvContent+=(reaction.getStochiometrySubstrates(compound.getCompoundId()) + ";");
						CsvContent+=(compound.getCompoundId() + ";");
						CsvContent+=(TypeOfCompound.SUBSTRATE + ";");
					} else {
						CsvContent+=(reaction.getStochiometryProducts(compound.getCompoundId()) + ";");
						CsvContent+=(compound.getCompoundId() + ";");
						CsvContent+=(TypeOfCompound.PRODUCT + ";");
					}
					if(pathwayCompoundList.contains(compound)) {
						CsvContent+=KeyComponent.KEY;						
					}
					else {
						CsvContent+=KeyComponent.NOTKEY;
					}
					CsvContent+=(";" + Reversibility.REVERSIBLE + ";" + Taxonomy.LIVINGTHING + "\n");
				}
			}
			this.csvContentList.add(CsvContent);
		}
		return this.csvContentList;
	}

	//finds next products from current reaction
	private void nextLevelReaction(KeggReactionObject r) {
		this.reactions.add(r);
		for (KeggCompoundObject c : r.getProducts()) {
			if (!this.excludeCompounds.contains(c) && !this.compIgnoreSet.contains(c.getCompoundId())) {
				if (!c.equals(this.inputProduct)) {
					this.excludeCompounds.add(c);
				}
				nextLevelCompound(c);
			}
		}
		this.reactions.remove(r);
	}

	//list of compounds which should be ignored because of extensive occurrence
	public HashSet<String> getCompIgnoreSet() {
		for (int ignore = 0; ignore < 20; ignore++) {
			if (ignore < 10) {
				this.compIgnoreSet.add("C0000" + String.valueOf(ignore));
			} else {
				this.compIgnoreSet.add("C000" + String.valueOf(ignore));
			}
		}
		return this.compIgnoreSet;
	}

	//finds next reactions of current substrate
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
			for (KeggReactionObject r : c.getSubstrateReactions()) {
				if (!this.excludeReactions.contains(r)) {
					this.excludeReactions.add(r);
					nextLevelReaction(r);
				}
			}
		}
		this.compounds.remove(c);
	}

}

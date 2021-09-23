package calculator;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map.Entry;

import model.KeggDataObject;
import model.KeggModuleObject;
import model.KeggReactionObject;
import model.MpaProtein;
import model.MpaProteine;

/**
 * new calculator for matching ko or ec- numbers from modules with ko- or ec-
 * numbers from MetaProteomeAnalyzer-csv- file sums all quantifications of each
 * sample together in case of matching ko- or ec- numbers for each given module
 * 
 * @author Daniel is this already implemented? from Daniel: Yes
 *
 */
public class Calculator2 {
	CalculatorOutput calcOutput;
	private int sampleSize;
	private int steps;
	private int stepsTotal;

	public Calculator2() {
		new ArrayList<Double>();
		this.calcOutput = new CalculatorOutput();
		this.sampleSize = 0;
	}

	private boolean isMatchedTaxonomy(HashMap<String, String> proteinTaxa, HashMap<String, String> reactionTaxa) {
		boolean isMatchedTaxonomy = false;
		if (reactionTaxa.size() == 0) { // no taxonomies in reaction -> no filter needed
			isMatchedTaxonomy = true;
		} else {
			for (Entry<String, String> reactionTaxonEntry : reactionTaxa.entrySet()) {
				String reactionTaxonRank = reactionTaxonEntry.getValue();
				String reactionTaxon = reactionTaxonEntry.getKey();
				String proteinTaxon = proteinTaxa.get(reactionTaxonRank);
				if (proteinTaxon.equals(reactionTaxon)) {
					isMatchedTaxonomy = true;
					break;
				}
			}
		}
		return isMatchedTaxonomy;
	}

	// checks whether ko- or ec- numebers from module file and mpa- csv- file
	// matches
	public boolean matchSets(HashSet<String> proteinKoAndEcSet, HashSet<String> reactionKoAndEcSet,
			HashMap<String, String> proteinTaxa, HashMap<String, String> reactionTaxa,
			CalculatorOutputList calcOutputList) {
		boolean isEqual = false;
		if (isMatchedTaxonomy(proteinTaxa, reactionTaxa)) {
			for (String proteinkoAndEc : proteinKoAndEcSet) {
				if (reactionKoAndEcSet.contains(proteinkoAndEc)) {
					isEqual = true;
					for (String num : proteinKoAndEcSet) {
						calcOutputList.addKoOrEc(num);
					}
					break;
				}
			}
		}
		return isEqual;
	}

	private ArrayList<MpaProtein> getProteinSetFromTaxonomyMap(HashMap<Taxonomy, ArrayList<MpaProtein>> taxonomyMap,
			Taxonomy taxa) {
		// search all maps in taxonomy map, i.e. search through complete map for finding
		// specific taxonomy tree
		boolean isSpeciesInTaxa = false;
		for (Entry<Taxonomy, ArrayList<MpaProtein>> entryTaxonomyMap : taxonomyMap.entrySet()) {
			Taxonomy taxonomyTree = entryTaxonomyMap.getKey();
			String species = taxonomyTree.getSpecies();
			isSpeciesInTaxa = taxa.getSpecies().equals(species);
			if (isSpeciesInTaxa) {
				return entryTaxonomyMap.getValue();
			}
		}
		return null;
	}

	private void addProteinToTaxonomyMap(HashMap<Taxonomy, ArrayList<MpaProtein>> taxonomyMap,
			Taxonomy proteinTaxa, MpaProtein protein) {
		ArrayList<MpaProtein> proteinSet = getProteinSetFromTaxonomyMap(taxonomyMap, proteinTaxa);
		if (proteinSet != null) {
			proteinSet.add(protein);
		} else {
			proteinSet = new ArrayList<>();
			proteinSet.add(protein);
			taxonomyMap.put(proteinTaxa, proteinSet);
		}
	}
	
	private HashSet<KeggReactionObject> getReactionSetFromTaxonomyMap(HashMap<Taxonomy, HashSet<KeggReactionObject>> taxonomyReactions,
			Taxonomy taxa) {
		// search all maps in taxonomy map, i.e. search through complete map for finding
		// specific taxonomy tree
		boolean isSpeciesInTaxa = false;
		for (Entry<Taxonomy, HashSet<KeggReactionObject>> entryTaxonomyMap : taxonomyReactions.entrySet()) {
			Taxonomy taxonomyTree = entryTaxonomyMap.getKey();
			String species = taxonomyTree.getSpecies();
			isSpeciesInTaxa = taxa.getSpecies().equals(species);
			if (isSpeciesInTaxa) {
				return entryTaxonomyMap.getValue();
			}
		}
		return null;
	}
	
	private void addReactionsToTaxonomySteps(HashMap<Taxonomy, HashSet<KeggReactionObject>> taxonomyReactions,
			Taxonomy proteinTaxa, KeggReactionObject reaction) {
		HashSet<KeggReactionObject> reactionSet = getReactionSetFromTaxonomyMap(taxonomyReactions, proteinTaxa);
		if (reactionSet != null) {
			reactionSet.add(reaction);
		} else {
			reactionSet = new HashSet<>();
			reactionSet.add(reaction);
			taxonomyReactions.put(proteinTaxa, reactionSet);
		}		
	}

	// set summed quantification of each sample
	public void matchReactionsWithProteins(KeggModuleObject module, MpaProteine proteins, CalculatorOutputList calcOutputList,
			HashMap<Taxonomy, ArrayList<MpaProtein>> taxonomyMap, HashMap<Taxonomy, HashSet<KeggReactionObject>> taxonomyReactions) {
		int stepsTotal = 0;
		int stepsMpa = 0;
		for (KeggReactionObject reaction : module.getReactions()) {
			boolean countedReaction = false;
			for (MpaProtein protein : proteins.getProteine()) {
				HashSet<String> reactionKoAndEcSet = reaction.getKoAndEcNumberIds();
				HashSet<String> proteinKoAndEcSet = protein.getKoAndEcNumberIds();
				HashMap<String, String> proteinTaxa = protein.getTaxa();
				HashMap<String, String> reactionTaxa = reaction.getTaxa();
				if (matchSets(proteinKoAndEcSet, reactionKoAndEcSet, proteinTaxa, reactionTaxa, calcOutputList)) {
					Taxonomy taxaOfProtein = new Taxonomy(proteinTaxa.get("superkingdom"),
							proteinTaxa.get("kingdom"), proteinTaxa.get("phylum"),
							proteinTaxa.get("class"), proteinTaxa.get("order"),
							proteinTaxa.get("family"), proteinTaxa.get("genus"),
							proteinTaxa.get("species")); 
					addProteinToTaxonomyMap(taxonomyMap, taxaOfProtein, protein);
					addReactionsToTaxonomySteps(taxonomyReactions, taxaOfProtein, reaction);
					calcOutputList.addMatchedProtein(protein);
					calcOutputList.removeMatchedProtein(protein);
					if (!countedReaction) {
						stepsMpa++;
						countedReaction = true;
					}
				}
			}
			stepsTotal++;
		}
		this.steps = stepsMpa;
		this.stepsTotal = stepsTotal;
	}

	/**
	 * control to check whether the taxonomy separation works
	 * 
	 * @param quantsForTaxa
	 * @return
	 */
	private double[] sumQuantsOverall(HashMap<Taxonomy, double[]> quantsForTaxa) {
		double[] quantSumArrayOverall = new double[this.sampleSize];
		for (Entry<Taxonomy, double[]> taxonEntry : quantsForTaxa.entrySet()) {
			double[] quantSumArray = taxonEntry.getValue();
			for (int quantIt = 0; quantIt < quantSumArray.length; quantIt++) {
				quantSumArrayOverall[quantIt] = quantSumArrayOverall[quantIt] + quantSumArray[quantIt];
			}
		}
		return quantSumArrayOverall;
	}
	
	private HashMap<Taxonomy, Integer> sumStepsForTaxa(
			HashMap<Taxonomy, HashSet<KeggReactionObject>> taxonomyReactions) {
		HashMap<Taxonomy, Integer> taxonSteps = new HashMap<Taxonomy, Integer>();
		for(Entry<Taxonomy, HashSet<KeggReactionObject>> taxonEntry : taxonomyReactions.entrySet()) {
			Taxonomy taxonomyTree = taxonEntry.getKey();
			taxonSteps.put(taxonomyTree, taxonEntry.getValue().size());
		}
		return taxonSteps;
	}

	/**
	 * sums all quantification values for each protein taxonomy-specific
	 * 
	 * @param taxonomyMap
	 * @return {taxon1: [summed sample1, summed sample2]}
	 */
	private HashMap<Taxonomy, double[]> sumQuantsForTaxa(
			HashMap<Taxonomy, ArrayList<MpaProtein>> taxonomyMap) {
		HashMap<Taxonomy, double[]> summedQuantsForTaxa = new HashMap<>();
		for (Entry<Taxonomy, ArrayList<MpaProtein>> taxonEntry : taxonomyMap.entrySet()) {
			Taxonomy taxonomyTree = taxonEntry.getKey();
			ArrayList<MpaProtein> proteins = taxonEntry.getValue();
			this.sampleSize = proteins.get(0).getQuants().size();
			double[] quantSumArray = sumAllQuantsForEachProtein(proteins);
			summedQuantsForTaxa.put(taxonomyTree, quantSumArray);
		}
		return summedQuantsForTaxa;
	}

	private double[] sumAllQuantsForEachProtein(ArrayList<MpaProtein> proteins) {
		double[] quantSumArray = new double[this.sampleSize];
		for (MpaProtein protein : proteins) {
			ArrayList<Double> quantList = protein.getQuants();
			for (int quantIterator = 0; quantIterator < quantList.size(); quantIterator++) {
				quantSumArray[quantIterator] = quantSumArray[quantIterator] + quantList.get(quantIterator);
			}
		}
		return quantSumArray;
	}

	// loops through all modules of kegg and all user- modules
	public void loopModules(KeggDataObject keggData, KeggDataObject keggDataUser, MpaProteine proteins,
			CalculatorOutputList calcOutputList) {
		for (KeggModuleObject userModule : keggDataUser.getModules()) {
			/**
			 * taxonomyMap: {taxonomyTree: set of matched proteins }
			 */
			HashMap<Taxonomy, ArrayList<MpaProtein>> taxonomyMap = new HashMap<Taxonomy, ArrayList<MpaProtein>>();
			HashMap<Taxonomy, HashSet<KeggReactionObject>> taxonomyReactions = new HashMap<Taxonomy, HashSet<KeggReactionObject>>();
			
			matchReactionsWithProteins(userModule, proteins, calcOutputList, taxonomyMap,taxonomyReactions);
			
			HashMap<Taxonomy, double[]> quantsForTaxa = sumQuantsForTaxa(taxonomyMap);
			HashMap<Taxonomy, Integer> stepsForTaxa = sumStepsForTaxa(taxonomyReactions);
			double[] overallQuants = sumQuantsOverall(quantsForTaxa);
			CalculatorOutput calcOutputUser = new CalculatorOutput();
			calcOutputUser.setModule(userModule.getModuleId());
			calcOutputUser.setModuleName(userModule.getModuleName());
			calcOutputUser.setStepMpa(this.steps);
			calcOutputUser.setStepTotal(this.stepsTotal);
			calcOutputUser.setTaxonomyQuants(quantsForTaxa);
			calcOutputUser.setTaxonomySteps(stepsForTaxa);
			for (double quant : overallQuants) {
				calcOutputUser.addQuantToQuantList(quant);
			}
			calcOutputList.addCalculatorOutput(calcOutputUser);
		}

		calcOutputList.setSampleHeaderString(proteins.getSampleHeaderString());
	}

}
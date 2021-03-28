package parser;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map.Entry;

import calculator.CalculatorOutput;
import calculator.CalculatorOutputList;
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
 * @author Daniel is this already implemented?
 *
 */
public class Calculator2 {
	private ArrayList<Double> quantSums;
	CalculatorOutput calcOutput;

	public Calculator2() {
		this.quantSums = new ArrayList<Double>();
		this.calcOutput = new CalculatorOutput();
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
//					System.out.println(proteinTaxon);
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

	// sums all quantification numbers from samples
	public void sumQuants(ArrayList<Double> quants) {
		if (this.quantSums.isEmpty()) {
			ArrayList<Double> quantsClone = new ArrayList<Double>();
			for (double quant : quants) {
				quantsClone.add(quant);
			}
			this.quantSums = quantsClone;
		} else {
			ArrayList<Double> quantSumsClone = new ArrayList<>(this.quantSums);
			this.quantSums = new ArrayList<Double>(); // clear
			for (int quantIterator = 0; quantIterator < quantSumsClone.size(); quantIterator++) {
				double quantSum = quantSumsClone.get(quantIterator) + quants.get(quantIterator);
				this.quantSums.add(quantSum);
			}
		}
	}

	// sets total number of steps in each module and counted number of steps in the
	// sample of each module
	public void setSteps(KeggModuleObject module, MpaProteine proteins, CalculatorOutputList calcOutputList) {
		double stepsTotal = 0;
		int stepsMpa = 0;
		for (KeggReactionObject reaction : module.getReactions()) {
			for (MpaProtein protein : proteins.getProteine()) {
				HashSet<String> reactionKoAndEcSet = reaction.getKoAndEcNumberIds();
				HashSet<String> proteinKoAndEcSet = protein.getKoAndEcNumberIds();
				HashMap<String, String> reactionTaxa = reaction.getTaxa();
				HashMap<String, String> proteinTaxa = protein.getTaxa();
				if (matchSets(proteinKoAndEcSet, reactionKoAndEcSet, proteinTaxa, reactionTaxa, calcOutputList)) {
					stepsMpa++;
					break;
				}
			}
			stepsTotal++;
		}
		this.calcOutput.setStepMpa(stepsMpa);
		this.calcOutput.setStepTotal(stepsTotal);
	}

	// set summed quantification of each sample
	public void setQuantSums(KeggModuleObject module, MpaProteine proteins, CalculatorOutputList calcOutputList) {
		for (KeggReactionObject reaction : module.getReactions()) {
			for (MpaProtein protein : proteins.getProteine()) {
				HashSet<String> reactionKoAndEcSet = reaction.getKoAndEcNumberIds();
				HashSet<String> proteinKoAndEcSet = protein.getKoAndEcNumberIds();
				HashMap<String, String> proteinTaxa = protein.getTaxa();
				HashMap<String, String> reactionTaxa = reaction.getTaxa();
				if (matchSets(proteinKoAndEcSet, reactionKoAndEcSet, proteinTaxa, reactionTaxa, calcOutputList)) {
					sumQuants(protein.getQuants());
					calcOutputList.addMatchedProtein(protein);
					calcOutputList.removeMatchedProtein(protein);
				}
			}
		}
		this.calcOutput.setQuantList(this.quantSums);
	}

	// loops through all modules of kegg and all user- modules
	public void loopModules(KeggDataObject keggData, KeggDataObject keggDataUser, MpaProteine proteins,
			CalculatorOutputList calcOutputList) {
//		for (KeggModuleObject module : keggData.getModules()) {
//				this.quantSums.clear();
//				this.calcOutput = new CalculatorOutput();
//				this.calcOutput.setModule(module.getModuleId());
//				this.calcOutput.setModuleName(module.getModuleName());
//				setSteps(module, proteins, calcOutputList);
//				setQuantSums(module, proteins,calcOutputList);
//				CalculatorOutput calcOutput = new CalculatorOutput();
//				calcOutput.setModule(module.getModuleId());
//				calcOutput.setModuleName(module.getModuleName());
//				calcOutput.setStepMpa(this.calcOutput.getStepMpa());
//				calcOutput.setStepTotal(this.calcOutput.getStepTotal());
//				ArrayList<Double> quantListClone = new ArrayList<Double>();
//				for(double quant : this.calcOutput.getQuantList()) {
//					quantListClone.add(quant);
//				}
//				calcOutput.setQuantList(quantListClone);
//				calcOutputList.addCalculatorOutput(calcOutput);
//		}
		for (KeggModuleObject userModule : keggDataUser.getModules()) {
			this.quantSums.clear();
			this.calcOutput = new CalculatorOutput();
			this.calcOutput.setModule(userModule.getModuleId());
			this.calcOutput.setModuleName(userModule.getModuleName());
			setSteps(userModule, proteins, calcOutputList);
			setQuantSums(userModule, proteins, calcOutputList);
			CalculatorOutput calcOutputUser = new CalculatorOutput();
			calcOutputUser.setModule(userModule.getModuleId());
			calcOutputUser.setModuleName(userModule.getModuleName());
			calcOutputUser.setStepMpa(this.calcOutput.getStepMpa());
			calcOutputUser.setStepTotal(this.calcOutput.getStepTotal());
			ArrayList<Double> quantListClone = new ArrayList<Double>();
			for (double quant : this.calcOutput.getQuantList()) {
				quantListClone.add(quant);
			}
			calcOutputUser.setQuantList(quantListClone);
			calcOutputList.addCalculatorOutput(calcOutputUser);
		}
		calcOutputList.setSampleHeaderString(proteins.getSampleHeaderString());
	}
}

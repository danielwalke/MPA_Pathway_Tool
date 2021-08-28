package calculator;

import java.util.ArrayList;
import java.util.HashMap;
/**
 * 
 * @author Daniel defines output for Calculator of KEGG- Manager shows for every
 *         module the counted steps in each sample, total number of steps in
 *         each module and summed spectral counts in each sample
 * @return Map for each module as key and a list of found steps in MPA.csv,
 *         total number of steps in choosen module-file and list of summed spectral
 *         counts of found KO-numbers
 */
public class CalculatorOutput implements Cloneable{
	private String module;
	private String moduleName; 
	private double quantMPA; //delete
	private double stepMpa;
	private double stepTotal;
	private ArrayList<Double> quantList;
	private HashMap<Taxonomy, double[]> taxonomyQuants; //{taxon1: sample1, taxon2: sample2}
	private HashMap<Taxonomy, Integer> taxonomySteps; //counts reactions
	
	public CalculatorOutput() {
		this.quantList = new ArrayList<>();
		this.taxonomyQuants = new HashMap<>();
		this.taxonomySteps = new HashMap<>();
	}
	
	public HashMap<Taxonomy, Integer> getTaxonomySteps() {
		return taxonomySteps;
	}



	public void setTaxonomySteps(HashMap<Taxonomy, Integer> taxonomySteps) {
		this.taxonomySteps = taxonomySteps;
	}



	public HashMap<Taxonomy, double[]> getTaxonomyQuants() {
		return taxonomyQuants;
	}

	public void setTaxonomyQuants(HashMap<Taxonomy, double[]> taxonomyQuants) {
		this.taxonomyQuants = taxonomyQuants;
	}

	public double getQuantMPA() {
		return quantMPA;
	}

	public void setQuantMPA(double quantMPA) {
		this.quantMPA = quantMPA;
	}

	public String getModuleName() {
		return moduleName;
	}

	public void setModuleName(String moduleName) {
		this.moduleName = moduleName;
	}

	public ArrayList<Double> getQuantList() {
		return quantList;
	}

	public void addQuantToQuantList(double quant) {
		this.quantList.add(quant);
	}

	public String getModule() {
		return module;
	}

	public void setModule(String module) {
		this.module = module;
	}

	public double getStepMpa() {
		return stepMpa;
	}

	public void setStepMpa(double stepMpa) {
		this.stepMpa = stepMpa;
	}

	public double getStepTotal() {
		return stepTotal;
	}

	public void setStepTotal(double stepTotal) {
		this.stepTotal = stepTotal;
	}

}

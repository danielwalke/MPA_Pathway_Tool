package calculator;

import java.util.ArrayList;
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

	public void setQuantList(ArrayList<Double> quantList) {
		this.quantList = quantList;
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

package calculator;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
/**
 * @return metaprotein-name, list of KO-numbers, list of EC- numbers, set of KO-
 *         and EC- numbers, spectral counts and map with set of KO- and EC-
 *         numbers and respective spectral count
 * @author Daniel
 *
 */
public class Protein {
	private String name;
	private ArrayList<String> koNumberList;
	private ArrayList<String> ecNumberList;
	private HashSet<String> koAndEcNumberSet;
	private Map<HashSet<String>, Double> numberQuantMap;
	private double quant;
	private ArrayList<Double> quantList;
	private Map<HashSet<String>, ArrayList<Double>> numberQuantListMap;

	public Map<HashSet<String>, ArrayList<Double>> getNumberQuantListMap() {
		Map<HashSet<String>, ArrayList<Double>> numberQuantListMap= new HashMap<HashSet<String>, ArrayList<Double>>();
		numberQuantListMap.put(getKoAndEcNumberSet(), getQuantList());
		setNumberQuantListMap(numberQuantListMap);
		return numberQuantListMap;
	}

	private void setNumberQuantListMap(Map<HashSet<String>, ArrayList<Double>> numberQuantListMap) {
		this.numberQuantListMap = numberQuantListMap;
	}

	public ArrayList<Double> getQuantList() {
		return quantList;
	}

	public void setQuantList(ArrayList<Double> quantList) {
		this.quantList = quantList;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public ArrayList<String> getKoNumberList() {
		return koNumberList;
	}

	public void setKoNumberList(ArrayList<String> koNumberList) {
		this.koNumberList = koNumberList;
	}

	public ArrayList<String> getEcNumberList() {
		return ecNumberList;
	}

	public void setEcNumberList(ArrayList<String> ecNumberList) {
		this.ecNumberList = ecNumberList;
	}

	public HashSet<String> getKoAndEcNumberSet() {
		return koAndEcNumberSet;
	}

	public void setKoAndEcNumberSet(HashSet<String> koAndEcNumberSet) {
		this.koAndEcNumberSet = koAndEcNumberSet;
	}

	public Map<HashSet<String>, Double> getNumberQuantMap() {
		Map<HashSet<String>, Double> numberQuantMap= new HashMap<HashSet<String>, Double>();
		numberQuantMap.put(getKoAndEcNumberSet(), getQuant());
		setNumberQuantMap(numberQuantMap);
		return numberQuantMap;
	}

	private void setNumberQuantMap(Map<HashSet<String>, Double> numberQuantMap) {
		this.numberQuantMap = numberQuantMap;
	}

	public double getQuant() {
		return quant;
	}

	public void setQuant(double quant) {
		this.quant = quant;
	}

}

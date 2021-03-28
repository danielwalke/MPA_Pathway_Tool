package calculator;

import java.util.ArrayList;
import java.util.HashSet;

/**
 * @return specific step-Id, list of KO- numbers, list of EC- numbers and set of KO- and EC- numbers
 * @author Daniel
 *
 */
public class Steps {
	private String id;
	private ArrayList<String> reactionNumberList;
	private ArrayList<String> koNumberList;
	private ArrayList<String> ecNumberList;
	private HashSet<String> koAndEcNumberSet;
	
	public ArrayList<String> getReactionNumberList() {
		return reactionNumberList;
	}
	public void setReactionNumberList(ArrayList<String> reactionNumberList) {
		this.reactionNumberList = reactionNumberList;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
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
	
}

package calculator;

import java.util.ArrayList;

import model.MpaProtein;
/**
 * @return specific MPA- File-name and list of proteins in this file
 * @see Protein
 * @author Daniel
 *
 */
public class MpaFileProteine {
	private String mpaFileName;
	private ArrayList<Protein> proteinList;
	
	public String getMpaFileName() {
		return mpaFileName;
	}
	public void setMpaFileName(String mpaFileName) {
		this.mpaFileName = mpaFileName;
	}
	public ArrayList<Protein> getProteinList() {
		return proteinList;
	}
	public void setProteinList(ArrayList<Protein> proteinList) {
		this.proteinList = proteinList;
	}
	
	
}

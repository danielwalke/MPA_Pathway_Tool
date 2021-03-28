package model;

import java.util.HashSet;
/**
 * stores filename of mpa-file, list of MpaProtein and a header for descriptions of sample-quantifications
 * @author Daniel
 *
 */
public class MpaProteine {
	private final String mpaFileName;
	private final HashSet<MpaProtein> proteine;
	private String sampleHeaderString; //might delete this if it isnt necessary
	public MpaProteine(String fileName) {
		this.mpaFileName= fileName;
		this.proteine = new HashSet<MpaProtein>();
		this.sampleHeaderString = "";
	}

	public String getMpaFileName() {
		return mpaFileName;
	}
	
	public void addMpaProtein(MpaProtein protein) {
		this.proteine.add(protein);
	}

	public HashSet<MpaProtein> getProteine() {
		return proteine;
	}

	public String getSampleHeaderString() {
		return sampleHeaderString;
	}

	public void setSampleHeaderString(String sampleHeaderString) {
		this.sampleHeaderString = sampleHeaderString;
	}
	
	
}

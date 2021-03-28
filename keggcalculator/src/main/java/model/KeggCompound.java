package model;

public class KeggCompound {
	protected final String compoundId;
	protected final String compoundName;
	
	public KeggCompound(String id, String name) {
		this.compoundId = id;
		this.compoundName = name;
	}	

	public String getCompoundId() {
		return this.compoundId;
	}

	public String getCompoundName() {
		return this.compoundName;
	}
}

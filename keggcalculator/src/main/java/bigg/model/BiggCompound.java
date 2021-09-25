package bigg.model;

import model.KeggCompound;

public class BiggCompound extends KeggCompound{
	String universalBiggId;

	public BiggCompound(String id, String name, String universalId) {
		super(id, name);
	this.universalBiggId = universalId;
	}

	public String getUniversalBiggId() {
		return universalBiggId;
	}

//	public void setUniversalBiggId(String universalBiggId) {
//		this.universalBiggId = universalBiggId;
//	}
//	
}

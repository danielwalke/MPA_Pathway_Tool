package model;

public class KeggHsaObject {
	private String hsaId;
	private String hsaName;
	
	public KeggHsaObject(String id, String name) {
		this.hsaId = id;
		this.hsaName = name;
	}

	public String getHsaId() {
		return hsaId;
	}

	public String getHsaName() {
		return hsaName;
	}
	
	
}

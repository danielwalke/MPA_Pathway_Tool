package model;

public class TaxonomyResponseListObj {

	private String name;
	private String id;
	
	public TaxonomyResponseListObj(String name, String id) {
		this.name = name;
		this.id = id;
	}

	public String[] getResponseListObjInfo() {
		String[] info = {this.name, this.id};
		return info;
	}
}
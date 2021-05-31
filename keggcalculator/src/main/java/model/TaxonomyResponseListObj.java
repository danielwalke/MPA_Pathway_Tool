package model;

public class TaxonomyResponseListObj {

	private String name;
	private String rank;
	private String id;
	
	public TaxonomyResponseListObj(String name, String rank, String id) {
		this.name = name;
		this.rank = rank;
		this.id = id;
	}

	public String[] getResponseListObjInfo() {
		String[] info = {this.name, this.rank, this.id};
		return info;
	}
}
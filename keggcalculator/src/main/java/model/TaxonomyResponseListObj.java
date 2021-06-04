package model;

public class TaxonomyResponseListObj {

	private String reactionId;
	private String name;
	private String rank;
	private String id;
	
	public TaxonomyResponseListObj(String reactionId, String name, String rank, String id) {
		this.reactionId = reactionId;
		this.name = name;
		this.rank = rank;
		this.id = id;
	}

	public String[] getResponseListObjInfo() {
		String[] info = {this.reactionId, this.name, this.rank, this.id};
		return info;
	}
}
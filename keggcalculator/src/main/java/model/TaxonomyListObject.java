package model;

public class TaxonomyListObject {
	
	private String reactionId;
	private String name;
	private String rank;

	public TaxonomyListObject() {
		this.reactionId = "";
		this.name = "";
		this.rank = "";
	}
	
	public String getName() {
		return name;
	}
	
	public String getRank() {
		return rank;
	}
	
	public String getReactionId() {
		return reactionId;
	}
}

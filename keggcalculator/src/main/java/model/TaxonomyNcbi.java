package model;

public class TaxonomyNcbi {
	private String id;
	private String taxonomicName;
	private String taxonomicRank;
	
	public TaxonomyNcbi(String id, String rank, String name) {
		this.id = id;
		this.taxonomicName= name;
		this.taxonomicRank = rank;
	}

	public String getId() {
		return id;
	}

	public String getTaxonomicName() {
		return taxonomicName;
	}

	public String getTaxonomicRank() {
		return taxonomicRank;
	}

}


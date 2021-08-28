package calculator;


public class Taxonomy {
	private String superkingdom;
	private String kingdom;
	private String phylum;
	private String classT;
	private String order;
	private String family;
	private String genus;
	private String species;

	public Taxonomy(String superkingdom, String kingdom, String phylum, String classT, String order, String family,
			String genus, String species) {
		this.superkingdom = superkingdom;
		this.kingdom = kingdom;
		this.phylum = phylum;
		this.classT = classT;
		this.order = order;
		this.family = family;
		this.genus = genus;
		this.species = species;
	}

	public String getSuperkingdom() {
		return superkingdom;
	}

	public String getKingdom() {
		return kingdom;
	}

	public String getPhylum() {
		return phylum;
	}

	public String getClassT() {
		return classT;
	}

	public String getOrder() {
		return order;
	}

	public String getFamily() {
		return family;
	}

	public String getGenus() {
		return genus;
	}

	public String getSpecies() {
		return species;
	}
	
	
}

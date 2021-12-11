package mantis;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.UUID;

public class MantisProtein {
	private String uuid;
	private String id;
	private String name;
	private String sequence;
	private final ArrayList<Double> quants;
	private final HashMap<String, String> taxa;
	private String description;
	private HashSet<String> kNumbers;
	private HashSet<String> ecNumbers;

	public MantisProtein() {
		this.uuid = UUID.randomUUID().toString();
		this.quants = new ArrayList<>();
		this.taxa = new HashMap<>();
		this.id = "";
		this.name = "";
		this.sequence = "";
		this.description = "";
		this.kNumbers = new HashSet<>();
		this.ecNumbers = new HashSet<>();
	}
	
	public void addKNumber(String kNumber) {
		this.kNumbers.add(kNumber);
	}

	public void addEcNumber(String ecNumber) {
		this.ecNumbers.add(ecNumber);
	}
	
	public HashSet<String> getkNumbers() {
		return kNumbers;
	}




	public HashSet<String> getEcNumbers() {
		return ecNumbers;
	}




	public String getUuid() {
		return this.uuid;
	}
	
	public void addQuant(double quant) {
		this.quants.add(quant);
	}
	
	public void addTaxa(String scientificName, String taxonomicRank) {
		this.taxa.put(scientificName, taxonomicRank);
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getSequence() {
		return sequence;
	}

	public void setSequence(String sequence) {
		this.sequence = sequence;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public ArrayList<Double> getQuants() {
		return quants;
	}

	public HashMap<String, String> getTaxa() {
		return taxa;
	}
	
	
	
}

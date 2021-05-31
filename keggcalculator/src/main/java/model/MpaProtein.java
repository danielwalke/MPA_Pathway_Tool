package model;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
/**
 * stores all metaproteins from mpa-file
 * contains name of metaproteins, their ko-number-Ids, ec-number-Ids, a set of ko- and ec-numbers, and a list of quantifications
 * @author Daniel
 *
 */
public class MpaProtein {
	private final String metaProteinName;
	private final HashSet<String> koNumberIds;
	private final HashSet<String> ecNumberIds;
	private final HashSet<String> koAndEcNumberIds;
	private final ArrayList<String> taxonomies; //stores all taxonomy ranks of each protein
	private final ArrayList<Double> quants;
	private final HashMap<HashSet<String>, ArrayList<Double>> quantMap;
	private final HashMap<String, String> taxa;
	private String description;
	
	public MpaProtein(String proteinName) {
		this.metaProteinName = proteinName;
		this.koNumberIds = new HashSet<String>();
		this.ecNumberIds = new HashSet<String>();
		this.koAndEcNumberIds = new HashSet<String>();
		this.quants = new ArrayList<Double>();
		this.quantMap = new HashMap<HashSet<String>, ArrayList<Double>>();
		this.taxonomies = new ArrayList<>();
		this.taxa = new HashMap<>();
	}

	public String getMetaProteinName() {
		return metaProteinName;
	}
	
	public void addKoNumberId(String koId) {
		this.koNumberIds.add(koId);
		this.koAndEcNumberIds.add(koId);
	}

	public HashSet<String> getKoNumberIds() {
		return koNumberIds;
	}
	
	public void addecNumberId(String ecId) {
		this.ecNumberIds.add(ecId);
		this.koAndEcNumberIds.add(ecId);
	}

	public HashSet<String> getEcNumberIds() {
		return ecNumberIds;
	}
	
	public void addQuant(double quant) {
		this.quants.add(quant);
		this.quantMap.put(this.koAndEcNumberIds, this.quants);
	}

	public ArrayList<Double> getQuants() {
		return quants;
	}

	public HashSet<String> getKoAndEcNumberIds() {
		return koAndEcNumberIds;
	}

	public HashMap<HashSet<String>, ArrayList<Double>> getQuantMap() {
		return quantMap;
	}
	
	public void addTaxonomy(String tax, String taxonomicRank) {
		this.taxa.put(taxonomicRank, tax);
		this.taxonomies.add(tax);
	}

	public ArrayList<String> getTaxonomies() {
		return taxonomies;
	}

	public HashMap<String, String> getTaxa() {
		return taxa;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}


	
	
}

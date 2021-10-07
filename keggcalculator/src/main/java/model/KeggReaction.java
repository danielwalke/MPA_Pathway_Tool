package model;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map.Entry;

public class KeggReaction {
	protected final String reactionId;
	protected final HashSet<String> biggReactionIds;
	protected final String reactionName;
	protected final HashSet<String> koNumbersString;
	protected final HashSet<String> ecNumbersString;
	protected final HashMap<String, String> stochiometrySubstratesString;
	protected final HashMap<String, String> stochiometryProductsString;
	protected final ArrayList<String> taxonomies;//stores all lowest taxonomy ranks
	protected final boolean isForwardReaction; //all reactions in Kegg have the "<=>" as reaction- arrow -> this leads to two different possibilities of reaction directions  
	protected final HashMap<String, String> taxa;
	
	public KeggReaction(String reactionid, String reactionName, boolean isForwardReaction) {
		this.reactionId = reactionid;
		this.reactionName = reactionName;
		this.biggReactionIds = new HashSet<String>();
		this.koNumbersString = new HashSet<String>();
		this.ecNumbersString = new HashSet<String>();
		this.stochiometrySubstratesString = new HashMap<String, String>();
		this.stochiometryProductsString = new HashMap<String, String>();
		this.taxonomies = new ArrayList<String>();
		this.isForwardReaction = isForwardReaction;
		this.taxa = new HashMap<>();

	}
	
	public HashMap<String, String> getTaxa() {
		return taxa;
	}
	
	public String getReactionId() {
		return this.reactionId;
	}

	public String getReactionName() {
		return this.reactionName;
	}
	
	public void addKONumberString(String ko) {
		this.koNumbersString.add(ko);
	}
	
	public void addEcNumberString(String ec) {
		this.ecNumbersString.add(ec);
	}
	
	public void setStochiometrySubstratesString(HashMap<String, String> stochiometrySubstrates) {
		for(Entry<String, String> mapEntry : stochiometrySubstrates.entrySet()) {
			this.stochiometrySubstratesString.put(mapEntry.getKey(), mapEntry.getValue());
		}
	}
	
	public void setStochiometryProductsString(HashMap<String, String> stochiometryProducts) {
		for(Entry<String, String> mapEntry : stochiometryProducts.entrySet()) {
			this.stochiometryProductsString.put(mapEntry.getKey(), mapEntry.getValue());
		}
	}
	
	public void addTaxonomy(String taxonomy, String taxonomicRank) {
		this.taxa.put(taxonomy, taxonomicRank);
		this.taxonomies.add(taxonomy);
	}

	public HashSet<String> getKoNumbersString() {
		return koNumbersString;
	}

	public HashSet<String> getEcNumbersString() {
		return ecNumbersString;
	}

	public HashMap<String, String> getStochiometrySubstratesString() {
		return stochiometrySubstratesString;
	}

	public HashMap<String, String> getStochiometryProductsString() {
		return stochiometryProductsString;
	}

	public ArrayList<String> getTaxonomies() {
		return taxonomies;
	}

	public boolean isForwardReaction() {
		return isForwardReaction;
	}
	
	public void addBiggReactionIds(HashSet<String> biggReactionIds) {
		this.biggReactionIds.addAll(biggReactionIds);
	}
	
	public void addBiggReactionId(String biggReactionId) {
		this.biggReactionIds.add(biggReactionId);
	}
	
	public HashSet<String> getBiggReactionIds() {
		return this.biggReactionIds;
	}
	
}

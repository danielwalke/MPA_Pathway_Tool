package pathwayJsonModel;

import java.util.ArrayList;
import java.util.HashMap;

public class JSONReaction {
	private final String reactionId;
	private final String reactionName;
	private final ArrayList<String> koNumbersString;
	private final ArrayList<String> ecNumbersString;
	private final HashMap<String, String> stochiometrySubstratesString;
	private final HashMap<String, String> stochiometryProductsString;
	private final ArrayList<String> taxonomies;
	private final HashMap<String, String> taxa;
	private final boolean isForwardReaction;
	private final String abbreviation;
	private final double opacity;
	private final String reversible;
	private final String x;
	private final String y;
	private final ArrayList<JSONCompound> substrates;
	private final ArrayList<JSONCompound> products;
	
	public JSONReaction() {
		this.reactionId = "";
		this.reactionName = "";
		this.koNumbersString = new ArrayList<>();
		this.ecNumbersString = new ArrayList<>();
		this.stochiometrySubstratesString = new HashMap<>();
		this.stochiometryProductsString = new HashMap<>();
		this.taxonomies = new ArrayList<>();
		this.isForwardReaction = true;
		this.abbreviation = "";
		this.opacity = 0.0;
		this.reversible = "";
		this.x = "";
		this.y = "";
		this.substrates = new ArrayList<>();
		this.products = new ArrayList<>();
		this.taxa = new HashMap<>();
	}

	public String getReactionId() {
		return reactionId;
	}

	public String getReactionName() {
		return reactionName;
	}

	public ArrayList<String> getKoNumbersString() {
		return koNumbersString;
	}

	public ArrayList<String> getEcNumbersString() {
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

	public String getAbbreviation() {
		return abbreviation;
	}

	public double getOpacity() {
		return opacity;
	}

	public String getReversible() {
		return reversible;
	}

	public String getX() {
		return x;
	}

	public String getY() {
		return y;
	}

	public ArrayList<JSONCompound> getSubstrates() {
		return substrates;
	}

	public ArrayList<JSONCompound> getProducts() {
		return products;
	}

	public HashMap<String, String> getTaxa() {
		return taxa;
	}
	
	
}

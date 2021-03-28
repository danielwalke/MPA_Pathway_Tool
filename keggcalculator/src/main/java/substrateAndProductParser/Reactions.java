package substrateAndProductParser;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
/**
 * class for reactions
 * used for parsing of reaction equations
 * @author Daniel
 *
 */
public class Reactions {
	private final String reactionID;
	private final List<Compounds> compounds;
	private final HashMap<String, String> stochiometrySubstrates;
	private final HashMap<String, Substrates> substrateMap;
	private final HashSet<Substrates> substrates;
	private final HashMap<String, String> otherSiteSubst;

	private final HashMap<String, String> stochiometryProducts;
	private final HashMap<String, Products> productMap;
	private final HashSet<Products> products;
	private final HashMap<String, String> otherSiteProd;
	
	public Reactions(String reactionID) {
		this.reactionID = reactionID;
		this.compounds = new ArrayList<Compounds>();
		this.stochiometrySubstrates = new HashMap<String, String>();
		this.substrateMap = new HashMap<String, Substrates>();
		this.substrates = new HashSet<Substrates>();
		this.otherSiteSubst = new HashMap<String, String>();
		this.stochiometryProducts = new HashMap<String, String>();
		this.productMap = new HashMap<String, Products>();
		this.products = new HashSet<Products>();	
		this.otherSiteProd = new HashMap<String, String>();
	}

	public String getReactionID() {
		return this.reactionID;
	}

	public List<Compounds> getCompounds() {
		return this.compounds;
	}
	
	public void addCompound(Compounds comp) {
		this.compounds.add(comp);
	}

	public HashMap<String, String> getStochiometrySubstrates() {
		return this.stochiometrySubstrates;
	}

	public HashMap<String, Substrates> getSubstrateMap() {
		return this.substrateMap;
	}

	public HashSet<Substrates> getSubstrates() {
		return this.substrates;
	}
	
	public void addSubstrate(Substrates substrate, String stochCoeff, String otherSite) {
		this.substrates.add(substrate);
		this.substrateMap.put(substrate.getSubstrateId(), substrate);
		this.stochiometrySubstrates.put(substrate.getSubstrateId(), stochCoeff);
		this.otherSiteSubst.put(substrate.getSubstrateId(), otherSite);
	}

	public HashMap<String, String> getStochiometryProducts() {
		return this.stochiometryProducts;
	}

	public HashMap<String, Products> getProductMap() {
		return this.productMap;
	}

	public HashSet<Products> getProducts() {
		return this.products;
	}

	public void addProduct(Products product, String stochCoeff, String otherSite) {
		this.products.add(product);
		this.productMap.put(product.getProductId(), product);
		this.stochiometryProducts.put(product.getProductId(), stochCoeff);
		this.otherSiteProd.put(product.getProductId(), otherSite);
	}

	public HashMap<String, String> getOtherSiteSubst() {
		return this.otherSiteSubst;
	}

	public HashMap<String, String> getOtherSiteProd() {
		return this.otherSiteProd;
	}
	
	
}

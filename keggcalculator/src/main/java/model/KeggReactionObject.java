package model;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;

/**
 * stores reactions every reaction contains an Id, a name, a set of ko-numbers
 * and a set of ec-numbers, a set of compounds, a set of substrates and products
 * with their stochiometric coefficients and a set of modules, where the
 * reaction can be found
 * 
 * @author Daniel
 *
 */
public class KeggReactionObject extends KeggReaction {
	private final HashSet<KeggKOObject> konumbers;
	private final HashSet<KeggECObject> ecnumbers;
	private final HashSet<String> koAndEcNumberIds;

	private final HashSet<KeggCompoundObject> compounds;
	private final HashSet<KeggModuleObject> modules;

	private final HashMap<String, String> stochiometrySubstrates;
	private final HashMap<String, KeggCompoundObject> substrateMap;
	private final HashSet<KeggCompoundObject> substrates;

	private final HashMap<String, String> stochiometryProducts;
	private final HashMap<String, KeggCompoundObject> productMap;
	private final HashSet<KeggCompoundObject> products;
	


//TODO: add enum taxonomy
	public KeggReactionObject(String reactionid, String reactionName) {
		super(reactionid, reactionName, true);
		this.konumbers = new HashSet<KeggKOObject>();
		this.ecnumbers = new HashSet<KeggECObject>();
		this.compounds = new HashSet<KeggCompoundObject>();
		this.modules = new HashSet<KeggModuleObject>();
		this.stochiometrySubstrates = new HashMap<String, String>();
		this.substrateMap = new HashMap<String, KeggCompoundObject>();
		this.substrates = new HashSet<KeggCompoundObject>();
		this.stochiometryProducts = new HashMap<String, String>();
		this.productMap = new HashMap<String, KeggCompoundObject>();
		this.products = new HashSet<KeggCompoundObject>();
		this.koAndEcNumberIds = new HashSet<String>();
		
	}

	// added for more information about reactions on clientside
	public HashMap<String, String> getStochiometrySubstrates() {
		return stochiometrySubstrates;
	}

	// added for more information about reactions on clientside
	public HashMap<String, String> getStochiometryProducts() {
		return stochiometryProducts;
	}

	public HashSet<KeggKOObject> getKonumbers() {
		return this.konumbers;
	}

	public void addKonumber(KeggKOObject konumber) {
		this.konumbers.add(konumber);
		this.koAndEcNumberIds.add(konumber.getKoId());
	}

	public HashSet<KeggECObject> getEcnumbers() {
		return this.ecnumbers;
	}

	public void addEcnumber(KeggECObject ecnumber) {
		this.ecnumbers.add(ecnumber);
		this.koAndEcNumberIds.add(ecnumber.getEcId());
	}

	public HashSet<KeggCompoundObject> getCompounds() {
		return this.compounds;
	}

	public void addCompound(KeggCompoundObject comp) {
		this.compounds.add(comp);
	}

	public HashSet<KeggModuleObject> getModules() {
		return this.modules;
	}

	public void addModule(KeggModuleObject module) {
		this.modules.add(module);
	}

	public String getStochiometrySubstrates(String compoundid) {
		return this.stochiometrySubstrates.get(compoundid);
	}

	public KeggCompoundObject getSubstrate(String compoundid) {
		return this.substrateMap.get(compoundid);
	}

	public HashSet<KeggCompoundObject> getSubstrates() {
		return this.substrates;
	}

	public void addSubstrate(KeggCompoundObject substrate, String stochCoeff) {
		this.compounds.add(substrate);
		this.substrates.add(substrate);
		this.substrateMap.put(substrate.getCompoundId(), substrate);
		this.stochiometrySubstrates.put(substrate.getCompoundId(), stochCoeff);
	}

	public String getStochiometryProducts(String compoundid) {
		return this.stochiometryProducts.get(compoundid);
	}

	public KeggCompoundObject getProduct(String compoundid) {
		return this.productMap.get(compoundid);
	}

	public HashSet<KeggCompoundObject> getProducts() {
		return this.products;
	}

	public void addProduct(KeggCompoundObject product, String stochCoeff) {
		this.compounds.add(product);
		this.products.add(product);
		this.productMap.put(product.getCompoundId(), product);
		this.stochiometryProducts.put(product.getCompoundId(), stochCoeff);
	}

	public HashSet<String> getKoAndEcNumberIds() {
		return koAndEcNumberIds;
	}


	public HashMap<String, KeggCompoundObject> getSubstrateMap() {
		return substrateMap;
	}

	public HashMap<String, KeggCompoundObject> getProductMap() {
		return productMap;
	}
	
	public KeggReaction toKeggReaction(KeggReactionObject reactionObject) {
		/*
		 * extracts reaction information from KeggReactionObjects and writes it to KeggReaction
		 */
		
		KeggReaction reaction = new KeggReaction(
				reactionObject.getReactionId(),
				reactionObject.getReactionName(),
				reactionObject.isForwardReaction());
		for (KeggECObject ec : reactionObject.getEcnumbers()) {
			reaction.addEcNumberString(ec.getEcId());
		}
		for (KeggKOObject ko : reactionObject.getKonumbers()) {
			reaction.addKONumberString(ko.getKoId());
		}
		reaction.addBiggReactionIds(reactionObject.getBiggReactionIds());
		reaction.setStochiometrySubstratesString(reactionObject.getStochiometrySubstrates());
		reaction.setStochiometryProductsString(reactionObject.getStochiometryProducts());
		
		return reaction;
	}


	

}

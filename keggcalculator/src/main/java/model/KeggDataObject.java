package model;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map.Entry;

import bigg.model.BiggCompoundObject;
/**
 * class that allows easy access to all data from KEGG
 * contains modules, reactions, ec- numbers, ko- numbers and compounds
 *
 */
public class KeggDataObject extends KeggData {


	private final HashMap<String, KeggModuleObject> moduleMap;
	private final HashSet<String> keyCompounds;
	private HashMap<String, KeggReactionObject> reactionMap;
	private final HashMap<String, KeggECObject> ecnumberMap;
	private final HashMap<String, KeggKOObject> koNumberMap;
	private final HashMap<String, KeggCompoundObject> compoundMap;
	private final HashMap<String, BiggCompoundObject> biggCompoundMap;
	private HashMap<String, HashMap<String, HashSet<String>>> kegg2biggCompound;
	protected final HashMap<String, KeggHsaObject> hsaMap;
	
	public KeggDataObject() {
		super();
		this.keyCompounds = new HashSet<>();
		this.moduleMap = new HashMap<String, KeggModuleObject>();
		this.reactionMap = new HashMap<String, KeggReactionObject>();
		this.ecnumberMap = new HashMap<String, KeggECObject>();
		this.koNumberMap = new HashMap<String, KeggKOObject>();
		this.compoundMap = new HashMap<String, KeggCompoundObject>();
		this.biggCompoundMap = new HashMap<String, BiggCompoundObject>();
		this.kegg2biggCompound = new HashMap<String, HashMap<String, HashSet<String>>>();
		
		this.hsaMap = new HashMap<>();
	}

	
	//clones all data stored in keggData
	public KeggDataObject cloneData() {
		KeggDataObject clonedData = new KeggDataObject();
		for(Entry<String, KeggHsaObject> hsa : getHsaMap().entrySet()) {
			KeggHsaObject hsaEntity = new KeggHsaObject(hsa.getValue().getHsaId(), hsa.getValue().getHsaName());
			clonedData.addHsa(hsaEntity);
		}
		// initialize new objects for cloning  
		for (KeggReactionObject reaction : getReactions()) {
			//set all reactions in cloned data
			KeggReactionObject clonedReaction = new KeggReactionObject(reaction.getReactionId(), reaction.getReactionName());
			clonedReaction.addBiggReactionIds(reaction.getBiggReactionIds());
			clonedData.addReaction(clonedReaction);
		}
		for (KeggModuleObject module : getModules()) {
			//set all modules in cloned data
			KeggModuleObject clonedModule = new KeggModuleObject(module.getModuleId(), module.getModuleName());
			clonedData.addModule(clonedModule);
		}
		for (KeggECObject ec : getEcnumbers()) {
			//set all ec- numbers in cloned data
			KeggECObject clonedEc = new KeggECObject(ec.getEcId(), ec.getEcName());
			clonedData.addEcnumber(clonedEc);
		}
		for (KeggKOObject ko : getKoNumbers()) {
			//set all ko- numbers in cloned data
			KeggKOObject clonedKo = new KeggKOObject(ko.getKoId(), ko.getKoName());
			clonedData.addKoNumber(clonedKo);
		}
		for (KeggCompoundObject comp : getCompounds()) {
			//set all compounds in cloned data
			KeggCompoundObject clonedCompound = new KeggCompoundObject(comp.getCompoundId(), comp.getCompoundName());
			clonedData.addCompound(clonedCompound);
		}
		
		for (BiggCompoundObject comp : getBiggCompounds()) {
			//set all compounds in cloned data
			BiggCompoundObject clonedCompound = new BiggCompoundObject(comp.getCompoundId(), comp.getCompoundName(), comp.getUniversalBiggId());
			clonedData.addBiggCompound(clonedCompound);
		}
				
		for (String keggComp : this.kegg2biggCompound.keySet()) {
			HashMap<String, HashSet<String>> biggIds = this.kegg2biggCompound.get(keggComp);
			clonedData.addKegg2BiggCompoundMap(keggComp, biggIds);
		}

		// fill modules of cloned data
		for (KeggModuleObject module : clonedData.getModules()) {
			KeggModuleObject originModule = getModule(module.getModuleId());
			for (KeggReactionObject originReaction : originModule.getReactions()) {
				module.addReaction(module.getReactions().size() + 1,
						clonedData.getReaction(originReaction.getReactionId()));
			}
			for (KeggKOObject originKo : originModule.getKoNumbers()) {
				module.addKoNumber(clonedData.getKoNumber(originKo.getKoId()));
			}
			for (KeggECObject originEc : originModule.getEcNumbers()) {
				module.addEcNumber(clonedData.getEcnumber(originEc.getEcId()));
			}
			for (KeggCompoundObject originComp : originModule.getCompounds()) {
				module.addCompound(clonedData.getCompound(originComp.getCompoundId()));
			}
		}
		// fill reactions of cloned data
		for (KeggReactionObject reaction : clonedData.getReactions()) {
			KeggReactionObject originReaction = getReaction(reaction.getReactionId());
			for (KeggKOObject originKo : originReaction.getKonumbers()) {
				//add ko- numbers in each reaction of the cloned data
				reaction.addKonumber(clonedData.getKoNumber(originKo.getKoId()));
			}
			for (KeggECObject originEc : originReaction.getEcnumbers()) {
				//add ec- numbers in each reaction of the cloned data
				reaction.addEcnumber(clonedData.getEcnumber(originEc.getEcId()));
			}

			for (KeggCompoundObject originSubstrate : originReaction.getSubstrates()) {
				//add substrates and their sochiometric coeff in each reaction of the cloned data
				String stochCoeff = originReaction.getStochiometrySubstrates(originSubstrate.getCompoundId());
				reaction.addSubstrate(clonedData.getCompound(originSubstrate.getCompoundId()), stochCoeff);
			}

			for (KeggCompoundObject originProduct : originReaction.getProducts()) {
				//add  products and their stochiometric coefficient in each reaction of the cloned data
				String stochCoeff = originReaction.getStochiometryProducts(originProduct.getCompoundId());
				KeggCompoundObject clonedProd;
				if (clonedData.getCompound(originProduct.getCompoundId()) != null) {
					// this check is necessary because of data inconsistency
					clonedProd = clonedData.getCompound(originProduct.getCompoundId());
				} else {
					clonedProd = new KeggCompoundObject(originProduct.getCompoundId(), "UNKNOWN");
					// TODO: also add compound to KeggData
				}
				reaction.addProduct(clonedProd, stochCoeff);
			}
			for (KeggModuleObject originModule : originReaction.getModules()) {
				//add modules in each reaction of the cloned data
				reaction.addModule(clonedData.getModule(originModule.getModuleId()));
			}
		}

		// fill KO- numbers of cloned data
		for (KeggKOObject ko : clonedData.getKoNumbers()) {
			KeggKOObject originKo = getKoNumber(ko.getKoId());
			for (KeggReactionObject reaction : originKo.getReactions()) {
				//add reactions in each ko- number of the cloned data
				ko.addReaction(clonedData.getReaction(reaction.getReactionId()));
			}
			for (KeggECObject ec : originKo.getEcNumbers()) {
				//add ec- numbers in each ko- number of the cloned data
				ko.addECNumber(clonedData.getEcnumber(ec.getEcId()));
			}
			for (KeggModuleObject module : originKo.getModules()) {
				//add modules in each ko- number of the cloned data
				ko.addModule(clonedData.getModule(module.getModuleId()));
			}
		}

		// fill ec- numbers of cloned data
		for (KeggECObject ec : clonedData.getEcnumbers()) {
			KeggECObject originEc = getEcnumber(ec.getEcId());
			for (KeggKOObject originKo : originEc.getkoNumbers()) {
				//add ko- numbers in each ec- number of the cloned data
				ec.addKoNumber(clonedData.getKoNumber(originKo.getKoId()));
			}
			for (KeggModuleObject originModule : originEc.getModules()) {
				//add modules in each ec- number of the cloned data
				ec.addModule(clonedData.getModule(originModule.getModuleId()));
			}
			for (KeggReactionObject originReaction : originEc.getReactions()) {
				//add reactions in each ec- number of the cloned data
				ec.addReaction(clonedData.getReaction(originReaction.getReactionId()));
			}
		}

		// fill compounds of cloned data
		for (KeggCompoundObject comp : clonedData.getCompounds()) {
			KeggCompoundObject originComp = getCompound(comp.getCompoundId());
			for (KeggModuleObject originModule : originComp.getModules()) {
				//add modules in each compounds of the cloned data
				comp.addModule(clonedData.getModule(originModule.getModuleId()));
			}
			for (KeggReactionObject originSubstReaction : originComp.getSubstrateReactions()) {
				//add reactions, where this compound is a substrate, in each compounds of the cloned data
				comp.addSubstrateReaction(clonedData.getReaction(originSubstReaction.getReactionId()));
			}
			for (KeggReactionObject originProdReaction : originComp.getProductReactions()) {
				//add reactions, where this compound is a products, in each compounds of the cloned data
				comp.addProductReaction(clonedData.getReaction(originProdReaction.getReactionId()));
			}
		}
		return clonedData;
	}

	public void addKeyCompound(String keyCompound){
		this.keyCompounds.add(keyCompound);
	}
	

	public HashSet<String> getKeyCompounds() {
		return keyCompounds;
	}


	//gets all existent modules
	public HashSet<KeggModuleObject> getModules() {
		return this.modules;
	}

	public KeggModuleObject getModule(String id) {
		return this.moduleMap.get(id);
	}

	public void addModule(KeggModuleObject m) {
		this.moduleMap.put(m.getModuleId(), m);
		this.modules.add(m);
	}

	//gets all existent reactions
	public HashSet<KeggReactionObject> getReactions() {
		return this.reactions;
	}

	public KeggReactionObject getReaction(String id) {
		return this.reactionMap.get(id);
	}

	public void addReaction(KeggReactionObject r) {
		this.reactionMap.put(r.getReactionId(), r);
		this.reactions.add(r);
	}
	
	/*
	 * following method is performed because pathways with same reactions but different taxonomies have to be removed after a pathway was parsed and module added
	 * thats why I deleted the "final" fromt reactions and reactionMap 
	 */
	public void removeReactions() {//removes all reactions from store
		this.reactions = new HashSet<KeggReactionObject>();
		this.reactionMap = new HashMap<String, KeggReactionObject>();
	}

	public HashSet<KeggECObject> getEcnumbers() {
		return this.ecnumbers;
	}
	
	//gets all existent ecNumbers
	public KeggECObject getEcnumber(String id) {
		return this.ecnumberMap.get(id);
	}

	public void addEcnumber(KeggECObject ec) {
		this.ecnumberMap.put(ec.getEcId(), ec);
		this.ecnumbers.add(ec);
	}

	public HashSet<KeggKOObject> getKoNumbers() {
		return this.koNumbers;
	}

	//gets all existent KO- numbers
	public KeggKOObject getKoNumber(String id) {
		return this.koNumberMap.get(id);
	}

	public void addKoNumber(KeggKOObject ko) {
		this.koNumberMap.put(ko.getKoId(), ko);
		this.koNumbers.add(ko);
	}

	public HashSet<KeggCompoundObject> getCompounds() {
		return this.compounds;
	}

	//gets all existent compounds
	public KeggCompoundObject getCompound(String id) {
		return this.compoundMap.get(id);
	}

	public void addCompound(KeggCompoundObject c) {
		this.compounds.add(c);
		this.compoundMap.put(c.getCompoundId(), c);
	}
	
	public HashSet<BiggCompoundObject> getBiggCompounds() {
		return this.biggCompounds;
	}
	
	public void addBiggCompound(BiggCompoundObject c) {
		this.biggCompounds.add(c);
		this.biggCompoundMap.put(c.getCompoundId(), c);
	}
	
	public void addKegg2BiggCompoundMap(String keggCompound, HashMap<String, HashSet<String>> biggIds) {
		this.kegg2biggCompound.put(keggCompound, biggIds);
	}
	
	public void setKegg2BiggCompoundMap(HashMap<String, HashMap<String, HashSet<String>>> kegg2Bigg) {
		this.kegg2biggCompound = kegg2Bigg;
	}
	
	public HashMap<String, HashMap<String, HashSet<String>>> getKegg2BiggCompoundMap() {
		return this.kegg2biggCompound;
	}
	
	public void addHsa(KeggHsaObject hsa) {
		this.hsaEntities.add(hsa);
		this.hsaMap.put(hsa.getHsaId(),hsa);
	}


	public KeggHsaObject getHsaEntitie(String hsaId) {
		return this.hsaMap.get(hsaId);
	}


	public HashMap<String, KeggHsaObject> getHsaMap() {
		return this.hsaMap;
	}
	
	public HashSet<KeggHsaObject> getHsaEntities(){
		return this.hsaEntities;
	}
	
}

package model;

import java.util.HashSet;

/**
 * CompoundClass
 * @return Id, name of a compound and their reactions (compound as substrate and compound as product) and module
 *
 */
public class KeggCompoundObject extends KeggCompound{
	private final HashSet<KeggReactionObject> reactions;
	private final HashSet<KeggModuleObject> modules;
	private final HashSet<KeggReactionObject> substrateReactions;
	private final HashSet<KeggReactionObject> productReactions;

	public KeggCompoundObject(String id, String name) {
		super(id, name);
		this.reactions = new HashSet<KeggReactionObject>();
		this.modules = new HashSet<KeggModuleObject>();
		this.substrateReactions = new HashSet<KeggReactionObject>();
		this.productReactions = new HashSet<KeggReactionObject>();
	}

	
	//all reactions of a compound
	public HashSet<KeggReactionObject> getReactions() {
		return this.reactions;
	}

	public HashSet<KeggModuleObject> getModules() {
		return this.modules;
	}

	public void addModule(KeggModuleObject module) {
		this.modules.add(module);
	}

	//reactions, in which a compound is a substrate
	public HashSet<KeggReactionObject> getSubstrateReactions() {
		return substrateReactions;
	}
	
	public void addSubstrateReaction(KeggReactionObject r) {
		this.reactions.add(r);
		this.substrateReactions.add(r);
	}

	//reactions, in which a compound is a product
	public HashSet<KeggReactionObject> getProductReactions() {
		return productReactions;
	}

	public void addProductReaction(KeggReactionObject r) {
		this.reactions.add(r);
		this.productReactions.add(r);
	}

}

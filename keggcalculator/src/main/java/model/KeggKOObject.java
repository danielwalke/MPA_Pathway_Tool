package model;

import java.util.HashSet;

/**
 * stores ko-numbers every ko-number contains an id, a name, a set of associated
 * ec-numbers and a set of reactions and modules, where this ko- number can be
 * found
 */
public class KeggKOObject extends KeggKO{
	private final HashSet<KeggECObject> ecNumbers;
	private final HashSet<KeggReactionObject> reactions;
	private final HashSet<KeggModuleObject> modules;

	public KeggKOObject(String id, String koName) {
		super(id, koName);
		this.ecNumbers = new HashSet<KeggECObject>();
		this.reactions = new HashSet<KeggReactionObject>();
		this.modules = new HashSet<KeggModuleObject>();
	}

	public Object clone() throws CloneNotSupportedException {
		return super.clone();
	}
	
	public String getKoId() {
		return this.koId;
	}

	public String getKoName() {
		return this.koName;
	}

	public HashSet<KeggECObject> getEcNumbers() {
		return this.ecNumbers;
	}

	public void addECNumber(KeggECObject ec) {
		this.ecNumbers.add(ec);
	}

	public HashSet<KeggReactionObject> getReactions() {
		return this.reactions;
	}

	public void addReaction(KeggReactionObject reaction) {
		this.reactions.add(reaction);
	}

	public HashSet<KeggModuleObject> getModules() {
		return this.modules;
	}

	public void addModule(KeggModuleObject module) {
		this.modules.add(module);
	}

}

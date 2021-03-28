package model;

import java.util.HashSet;

/**
 * stores ec-numbers every ec- number contains an id and a name, a set of
 * associated ko-numbers and a set of reactions and modules, where the ec-number
 * can be found
 * 
 * @author Daniel
 *
 */
public class KeggECObject extends KeggEc {
	private final HashSet<KeggKOObject> koNumbers;
	private final HashSet<KeggReactionObject> reactions;
	private final HashSet<KeggModuleObject> modules;

	public KeggECObject(String id, String ecName) {
		super(id, ecName);
		this.koNumbers = new HashSet<KeggKOObject>();
		this.reactions = new HashSet<KeggReactionObject>();
		this.modules = new HashSet<KeggModuleObject>();
	}

	public String getEcId() {
		return this.ecId;
	}

	public String getEcName() {
		return this.ecName;
	}

	public HashSet<KeggKOObject> getkoNumbers() {
		return this.koNumbers;
	}

	public void addKoNumber(KeggKOObject ko) {
		this.koNumbers.add(ko);
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

package model;

import java.util.HashMap;
import java.util.HashSet;

/**
 * stores modules every module contains an id, a name, a series of reactions, a
 * set of ko- and ec-numbers and a set of compounds
 * 
 * @author Daniel
 *
 */
public class KeggModuleObject extends KeggModule{

	private final HashMap<Integer, KeggReactionObject> reactionSteps;
	private final HashSet<KeggReactionObject> reactions;
	private final HashSet<KeggKOObject> koNumbers;
	private final HashSet<KeggECObject> ecNumbers;
	private final HashSet<KeggCompoundObject> compounds;

	public KeggModuleObject(String moduleId, String moduleName) {
		super(moduleId, moduleName);
		this.reactionSteps = new HashMap<Integer, KeggReactionObject>();
		this.reactions = new HashSet<KeggReactionObject>();
		this.koNumbers = new HashSet<KeggKOObject>();
		this.ecNumbers = new HashSet<KeggECObject>();
		this.compounds = new HashSet<KeggCompoundObject>();
	}

	public String getModuleId() {
		return this.moduleId;
	}

	public String getModuleName() {
		return this.moduleName;
	}

	public HashMap<Integer, KeggReactionObject> getReactionSteps() {
		return this.reactionSteps;
	}

	public HashSet<KeggReactionObject> getReactions() {
		return reactions;
	}

	public void addReaction(Integer num, KeggReactionObject r) {
		this.reactionSteps.put(num, r);
		this.reactions.add(r);
	}

	public HashSet<KeggKOObject> getKoNumbers() {
		return koNumbers;
	}

	public void addKoNumber(KeggKOObject ko) {
		this.koNumbers.add(ko);
	}

	public HashSet<KeggECObject> getEcNumbers() {
		return ecNumbers;
	}

	public void addEcNumber(KeggECObject ec) {
		this.ecNumbers.add(ec);
	}

	public HashSet<KeggCompoundObject> getCompounds() {
		return compounds;
	}

	public void addCompound(KeggCompoundObject comp) {
		this.compounds.add(comp);
	}

}

package model;

import java.util.HashSet;

import bigg.model.BiggCompoundObject;

public class KeggData {

	protected final HashSet<KeggModuleObject> modules;
	protected HashSet<KeggReactionObject> reactions;
	protected final HashSet<KeggECObject> ecnumbers;
	protected final HashSet<KeggKOObject> koNumbers;
	protected final HashSet<KeggCompoundObject> compounds;
	protected final HashSet<KeggHsaObject> hsaEntities;
	
	protected final HashSet<BiggCompoundObject> biggCompounds;
	
	public KeggData() {
		this.modules = new HashSet<KeggModuleObject>();
		this.reactions = new HashSet<KeggReactionObject>();
		this.ecnumbers = new HashSet<KeggECObject>();
		this.koNumbers = new HashSet<KeggKOObject>();
		this.compounds = new HashSet<KeggCompoundObject>();
		this.hsaEntities = new HashSet<KeggHsaObject>();
		
		this.biggCompounds = new HashSet<BiggCompoundObject>();
	}

}

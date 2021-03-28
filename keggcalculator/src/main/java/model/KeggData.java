package model;

import java.util.HashSet;

public class KeggData {

	protected final HashSet<KeggModuleObject> modules;
	protected final HashSet<KeggMapObject> maps;
	protected HashSet<KeggReactionObject> reactions;
	protected final HashSet<KeggECObject> ecnumbers;
	protected final HashSet<KeggKOObject> koNumbers;
	protected final HashSet<KeggCompoundObject> compounds;
	
	public KeggData() {
		this.maps = new HashSet<>();
		this.modules = new HashSet<KeggModuleObject>();
		this.reactions = new HashSet<KeggReactionObject>();
		this.ecnumbers = new HashSet<KeggECObject>();
		this.koNumbers = new HashSet<KeggKOObject>();
		this.compounds = new HashSet<KeggCompoundObject>();
		
	}

}

package model;

import java.util.HashSet;

public class SortedReactions {
	KeggCompound product;
	HashSet<KeggReaction> reactions;
	
	public SortedReactions(String id, String name) {
		this.product = new KeggCompound(id, name);
		this.reactions = new HashSet<KeggReaction>();
	}
	
	public void addReaction(KeggReaction reaction) {
		this.reactions.add(reaction);
	}
}

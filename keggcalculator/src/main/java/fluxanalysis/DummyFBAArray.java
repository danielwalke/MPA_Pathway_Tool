package fluxanalysis;

import java.util.ArrayList;

public class DummyFBAArray {
	ArrayList<DummyFBAReactionObj> reactionList;
	
	public DummyFBAArray() {
		this.reactionList = new ArrayList<DummyFBAReactionObj>();
	}
	
	public ArrayList<DummyFBAReactionObj> getDummyFBAArray() {
		return this.reactionList;
	}
	
	public int size() {
		return this.reactionList.size();
	}
}

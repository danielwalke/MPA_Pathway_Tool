package model;

import java.util.ArrayList;

public class DummyFBAArray {
	ArrayList<DummyFBAReactionObj> dummyReactionList;
	
	public DummyFBAArray() {
		this.dummyReactionList = new ArrayList<DummyFBAReactionObj>();
	}
	
	public ArrayList<DummyFBAReactionObj> getDummyFBAArray() {
		return this.dummyReactionList;
	}
	
	public int size() {
		return this.dummyReactionList.size();
	}
}

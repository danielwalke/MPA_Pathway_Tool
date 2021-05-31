package model;

import java.util.ArrayList;

public class TaxonomyList {
	ArrayList<TaxonomyListObject> taxonomyList;
	
	public TaxonomyList() {
		this.taxonomyList = new ArrayList<TaxonomyListObject>();
	}
	
	public ArrayList<TaxonomyListObject> getTaxonomyObjectList() {
		return this.taxonomyList;
	}
	
	public int size() {
		return this.taxonomyList.size();
	}
}

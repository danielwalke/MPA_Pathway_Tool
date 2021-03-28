package parser;

import java.util.ArrayList;
import java.util.HashSet;

/**
 * @return entries of String, which have been separated by ", " as list and as HashSet
 * not necessary with new calculator
 * @author Daniel
 *
 */
public class EntrySeparator {
	private ArrayList<String> list = new ArrayList<String>();
	private HashSet<String> hashSet = new HashSet<String>();
	private String listStringCsv;

	public HashSet<String> getHashSet() {
		String[] entries = getlistStringCsv().split(", ");
		for (int it = 0; it < entries.length; it++) {
			String entry = entries[it];
			hashSet.add(entry);
		}
		setHashSet(hashSet);
		return hashSet;
	}

	private void setHashSet(HashSet<String> hashSet) {
		this.hashSet = hashSet;
	}

	private String getlistStringCsv() {
		return listStringCsv;
	}

	public void setlistStringCsv(String listStringCsv) {
		this.listStringCsv = listStringCsv;
	}

	public ArrayList<String> getList() {
		String[] entries = getlistStringCsv().split(", ");
		for (int it = 0; it < entries.length; it++) {
			String entry = entries[it];
			list.add(entry);
		}
		setList(list);
		return list;
	}

	private void setList(ArrayList<String> list) {
		this.list = list;
	}

}

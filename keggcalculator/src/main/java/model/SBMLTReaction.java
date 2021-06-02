package model;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;

public class SBMLTReaction {
	private String id;
	private List<String> identifiers;
	private String name;
	private HashSet<String> ecNumbers;
	private HashSet<String> konumbers;
	private HashMap<String, String> taxonomy;
	
	public SBMLTReaction(String id, String name) {
		this.id = id;
		this.identifiers= new ArrayList<>();
		this.name = name;
		this.ecNumbers = new HashSet<>();
		this.konumbers = new HashSet<>();
		this.taxonomy = new HashMap<>();
	}
	
	public HashMap<String, String> getTaxonomy() {
		return taxonomy;
	}

	public void addTaxonomy(String taxonomicName, String rank) {
		this.taxonomy.put(taxonomicName, rank);
	}
	
	public void addEcNumber(String ecNUmber) {
		this.ecNumbers.add(ecNUmber);
	}
	
	public void addKoNumber(String koNumber) {
		this.konumbers.add(koNumber);
	}
		
	public String getName() {
		return name;
	}

	public void addIdentifier(String identifier) {
		this.identifiers.add(identifier);
	}

	public String getId() {
		return id;
	}

	public List<String> getIdentifiers() {
		return identifiers;
	}

	public HashSet<String> getEcNumbers() {
		return ecNumbers;
	}

	public HashSet<String> getKonumbers() {
		return konumbers;
	}

	public void setIdentifiers(List<String> identifiers) {
		this.identifiers = identifiers;
	}
	
	
}

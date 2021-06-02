package parser;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map.Entry;

import javax.swing.tree.TreeNode;
import javax.xml.stream.XMLStreamException;

import org.sbml.jsbml.Annotation;
import org.sbml.jsbml.ListOf;
import org.sbml.jsbml.Reaction;
import org.sbml.jsbml.SBMLDocument;
import org.sbml.jsbml.SBMLReader;

import model.SBMLTReaction;
import model.TaxonomyNcbi;
import model.KeggECObject;
import model.KeggKOObject;
import model.KeggModuleObject;
import model.KeggReactionObject;
import services.KeggCreatorService;

//Taxa till now only for complete module and not for single reactions-> is this possible?
//K numbers-> guessed only the respective link, but didnt found any sbml file which contains a k number
//delete R numbers
public class SbmlParser {
	//"C:\\Users\\danie\\Downloads\\MODEL1011010000_url.xml"; // MODEL5662377562_url
	// //BIOMD0000000064_url (2)
	public static KeggModuleObject parseSbmlFile(File file, KeggCreatorService creator){
		SBMLReader reader = new SBMLReader();
		List<SBMLTReaction> sbmlReactions = new ArrayList<>();
		try {
			//read sbml
			@SuppressWarnings("AbstractReaderWriter.java:111")
			SBMLDocument sbml = reader.readSBML(file.getPath());		
			HashMap<String, String> globalTaxa = getTaxa(sbml, creator);
			String moduleName = file.getName();
			String moduleId = sbml.getModel().getId();
			ListOf<Reaction> reactions = sbml.getModel().getListOfReactions();
			for (Reaction reaction : reactions) {
				String id = reaction.getId();
				String name = reaction.getName();
				SBMLTReaction sbmlReaction = new SBMLTReaction(id, name);
				Annotation annotation = reaction.getAnnotation();
				List<String> identifiers = new ArrayList<>();
				getTreeNode(annotation, identifiers, "");
				sbmlReaction.setIdentifiers(identifiers);
				sbmlReactions.add(sbmlReaction);
			}

			// fill sbml reaction with ec numbers and ko Numbers
			for (SBMLTReaction sbmlReaction : sbmlReactions) { 
				HashSet<String> ecNumbers = getEcNumbers(sbmlReaction.getIdentifiers());
				for (String ecNumber : ecNumbers) {
					sbmlReaction.addEcNumber(ecNumber);
				}
				HashSet<String> koNumbers = getKoNumbers(sbmlReaction.getIdentifiers());
				for (String koNumber : koNumbers) {
					sbmlReaction.addKoNumber(koNumber);
				}
				HashSet<String> taxonomyNumbers = getReactionTaxonomyNumbers(sbmlReaction.getIdentifiers());
				for(String id : taxonomyNumbers) {
					TaxonomyNcbi taxonomy = creator.getTaxonomy(id);
					sbmlReaction.addTaxonomy(taxonomy.getTaxonomicName(), taxonomy.getTaxonomicRank());
				}			
			}

			// add to Module
			KeggModuleObject module = new KeggModuleObject(moduleId, moduleName);
			int reactionCounter = 0;
			for (SBMLTReaction sbmlReaction : sbmlReactions) {
				String reactionId = sbmlReaction.getId();
				String reactionName = sbmlReaction.getName();
				KeggReactionObject reaction = new KeggReactionObject(reactionId, reactionName);
				for (String ec : sbmlReaction.getEcNumbers()) {
					KeggECObject ecNumber = new KeggECObject(ec, "");
					reaction.addEcnumber(ecNumber);
				}
				for (String ko : sbmlReaction.getKonumbers()) {
					KeggKOObject koNumber = new KeggKOObject(ko, "");
					reaction.addKonumber(koNumber);
				}
				if(!globalTaxa.isEmpty()) {
					for(Entry<String, String> taxon : globalTaxa.entrySet()) {
						reaction.addTaxonomy(taxon.getKey(), taxon.getValue());
					}
				}
				if(globalTaxa.isEmpty()) {
					for(Entry<String, String> taxon : sbmlReaction.getTaxonomy().entrySet()) {
						reaction.addTaxonomy(taxon.getKey(), taxon.getValue());
					}
				}		
				module.addReaction(reactionCounter, reaction);
				reactionCounter++;
			}
			for(KeggReactionObject reaction : module.getReactions()) {
				System.out.println(reaction.getReactionName());
				System.out.println(reaction.getKoAndEcNumberIds());
				System.out.println(reaction.getTaxa());
			}
			sbml = null;
			return module;
		} catch (XMLStreamException e) {
			e.printStackTrace();
			return new KeggModuleObject("", "");
		} catch (IOException e) {
			e.printStackTrace();
			return new KeggModuleObject("", "");
		}		
	}

	private static HashMap<String, String> getTaxa(SBMLDocument sbml, KeggCreatorService creator) throws IOException {
		HashMap<String, String> taxa = new HashMap();
		Annotation annotaion = sbml.getModel().getAnnotation();
		List<String> taxonomyIdentifiers = getTaxonomyIdentifier(annotaion);
		for(String identifier: taxonomyIdentifiers) {
			String[] identifierElements = identifier.split("\\/");
			String taxonomyId = identifierElements[identifierElements.length-1].trim();
			TaxonomyNcbi taxonomy = creator.getTaxonomy(taxonomyId);
			taxa.put(taxonomy.getTaxonomicName(), taxonomy.getTaxonomicRank());
		}
		return taxa;
	}

	private static List<String> getTaxonomyIdentifier(TreeNode annotaion) {
		List<String> taxonomyIdentifiers = new ArrayList<>();
		getTreeNode(annotaion, taxonomyIdentifiers, "taxonomy");
		return taxonomyIdentifiers;
	}
	
	private static void getTreeNode(TreeNode annotation, List<String> list, String condition) {
		for (int annotationChildIt = 0; annotationChildIt < annotation.getChildCount(); annotationChildIt++) {
			TreeNode annotationChild = annotation.getChildAt(annotationChildIt);
			if (annotationChild.getChildCount()>0) {
				getTreeNode(annotationChild,list, condition);
			}else {
				String childString = annotationChild.toString();
				if(childString.contains(condition)) {
					list.add(childString);
				}
			}
		}
		
	}

	private static HashSet<String> getKoNumbers(List<String> identifiers){
		HashSet<String> koNumbers = new HashSet<>();
		for (String identifier : identifiers) {
			if (identifier.contains("kegg.jp/entry/K")) {
				String[] identifierElements = identifier.split("\\/");
				String ecNumber = identifierElements[identifierElements.length - 1];
				koNumbers.add(ecNumber);
			}
		}
		return koNumbers;
	}
	
	private static HashSet<String> getEcNumbers(List<String> identifiers) {
		HashSet<String> ecNumbers = new HashSet<>();
		for (String identifier : identifiers) {
			if (identifier.contains("ec-code")) {
				String[] identifierElements = identifier.split("\\/");
				String ecNumber = identifierElements[identifierElements.length - 1];
				ecNumbers.add(ecNumber);
			}
		}
		return ecNumbers;
	}
	
	private static HashSet<String> getReactionTaxonomyNumbers(List<String> identifiers) {
		HashSet<String> taxonomyNumbers = new HashSet<>();
		for (String identifier : identifiers) {
			if (identifier.contains("taxonomy")) {
				String[] identifierElements = identifier.split("\\/");
				String taxonomyNumber = identifierElements[identifierElements.length - 1];
				taxonomyNumbers.add(taxonomyNumber);
			}
		}
		return taxonomyNumbers;
	}



}

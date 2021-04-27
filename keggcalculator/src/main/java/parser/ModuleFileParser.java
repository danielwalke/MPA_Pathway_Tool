package parser;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.util.ArrayList;
import java.util.Map.Entry;

import com.google.gson.Gson;

import model.KeggCompoundObject;
import model.KeggDataObject;
import model.KeggECObject;
import model.KeggKOObject;
import model.KeggModuleObject;
import model.KeggReactionObject;
import pathwayJsonModel.JSONCompound;
import pathwayJsonModel.JSONPathway;
import pathwayJsonModel.JSONReaction;

/**
 * parse module files from user format: stepID: reaction-number-Id,
 * ko-number-Ids, ec-number-Ids, stochiometric coefficient,type of compound,ke
 * compound, reversibilty and taxonomy
 * 
 * @author Daniel
 *
 */
public class ModuleFileParser {
	ArrayList<String> fileList;

	public ModuleFileParser() {
		this.fileList = new ArrayList<String>();
	}

	public void parseModuleFile(KeggDataObject keggdataUser) {
		for (String file : this.fileList) {
			if(file.endsWith(".csv")) {
				parseCsv(file, keggdataUser);
			
			}
			if(file.endsWith(".json")) {
				parseJson(file, keggdataUser);
			}
			if(file.endsWith(".xml")) {
				parseSbml(file, keggdataUser);
			}
			
		}

	}

	private void parseSbml(String file, KeggDataObject keggdataUser) {
		// TODO Auto-generated method stub
		
	}

	private void parseJson(String file, KeggDataObject keggdataUser) {
		Gson gson = new Gson();
		String json = "{\"reactions\": ";
		try {
			BufferedReader br = new BufferedReader(new FileReader(new File(file)));
			String line = br.readLine();
			while(line != null) {
				json = json.concat(line);
				line = br.readLine();
			}
			json = json.concat("}");
		}catch (Exception e) {
			e.printStackTrace();
		}
		JSONPathway pathway = gson.fromJson(json, JSONPathway.class);
		String fileName = file.split("modules")[1];
		String moduleID = fileName.substring(1, fileName.length());
		String moduleName = fileName.substring(1, fileName.length());
		KeggModuleObject module = new KeggModuleObject(moduleID, moduleName);
		int reactionCounter = 0;
		for(JSONReaction jsonReaction : pathway.getReactions()) {
			KeggReactionObject reaction = new KeggReactionObject(jsonReaction.getReactionId(), jsonReaction.getReactionName());
			for(String ko : jsonReaction.getKoNumbersString()) {
				KeggKOObject koNumber = new KeggKOObject(ko, "");
				reaction.addKonumber(koNumber);
			}
			for(String ec : jsonReaction.getEcNumbersString()) {
				KeggECObject ecNumber = new KeggECObject(ec, "");
				reaction.addEcnumber(ecNumber);
			}
			for(Entry<String, String> taxonEntry : jsonReaction.getTaxa().entrySet()) {
//				String[] taxonEntries = rawTaxon.split(":");
				String taxonomicRank = taxonEntry.getValue();
				String taxon = taxonEntry.getKey();
				reaction.addTaxonomy(taxon, taxonomicRank);
			}
			for(JSONCompound substrate : jsonReaction.getSubstrates()) {
				String substrateId = substrate.getName().substring(substrate.getName().length()-6, substrate.getName().length()).trim();
				KeggCompoundObject compound = new KeggCompoundObject(substrateId, substrate.getName());
				reaction.addSubstrate(compound, substrate.getStochiometry());
			}
			for(JSONCompound product : jsonReaction.getProducts()) {
				String productId = product.getName().substring(product.getName().length()-6, product.getName().length()).trim();
				KeggCompoundObject compound = new KeggCompoundObject(productId, product.getName());
				reaction.addProduct(compound, product.getStochiometry());
			}
			module.addReaction(reactionCounter, reaction);
			reactionCounter++;
		}
		keggdataUser.addModule(module);
		
	}

	private void parseCsv(String file, KeggDataObject keggdataUser) {
		try {
			BufferedReader br = new BufferedReader(new FileReader(new File(file)));
			String line = br.readLine();
			line = br.readLine();
			String fileName = file.split("modules")[1];
			String moduleID = fileName.substring(1, fileName.length());
			String moduleName = fileName.substring(1, fileName.length());
			KeggModuleObject module = new KeggModuleObject(moduleID, moduleName);
			while (line != null) {
				String[] splitLine = line.split(";");
				String stepId = splitLine[0];
				String reactionNumberId = splitLine[1];
				String koNumberIds = splitLine[2];
				String[] splitKoNumber = koNumberIds.split(",");
				String ecNumberIds = splitLine[3];
				String[] splitEcNumber = ecNumberIds.split(",");
				String stochCoeff = splitLine[4];
				String compoundNumberId = splitLine[5];
				String typeOfComp = splitLine[6];
//				String keyComp = splitLine[7]; //TODO: delete
//				String reversibility = splitLine[8];
				String taxonmies = splitLine[8];
				String[] splitTaxonomies = taxonmies.split("&&");
				KeggReactionObject reaction;
				if (keggdataUser.getReaction(reactionNumberId) == null) {
					reaction = new KeggReactionObject(reactionNumberId, "");
				} else {
					reaction = keggdataUser.getReaction(reactionNumberId);
				}

				for (String koString : splitKoNumber) {
					KeggKOObject koNumber = new KeggKOObject(koString, "");
					if(koNumberIds.length()>0) {
						reaction.addKonumber(koNumber);
					}
					
				}
				for (String ecString : splitEcNumber) {
					KeggECObject ecNumber = new KeggECObject(ecString, "");
					if(ecNumberIds.length()>0) {
						reaction.addEcnumber(ecNumber);
					}						
				}
				for(String taxonomy : splitTaxonomies) {
					if(taxonmies.length()>0) {//if empty taxonomy dont add something -> results in non empty reaction set
						String[] splitTaxonomy = taxonomy.split(":");
						String taxonomicRank = splitTaxonomy[0];
						String taxon = splitTaxonomy[1]; //get lowest taxonomy rank 
						reaction.addTaxonomy(taxon, taxonomicRank);
					}
				}
				KeggCompoundObject compound = new KeggCompoundObject(compoundNumberId, "");
				if (typeOfComp.equals("substrate")) {
					reaction.addSubstrate(compound, stochCoeff);
				}
				if (typeOfComp.equals("product")) {
					reaction.addProduct(compound, stochCoeff);
				}
				keggdataUser.addReaction(reaction);
				module.addReaction(Integer.parseInt(stepId), reaction);
				line = br.readLine();
			}
			keggdataUser.addModule(module);
			keggdataUser.removeReactions();
			br.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
		
	}

	public void addFile(String file) {
		this.fileList.add(file);
	}
}
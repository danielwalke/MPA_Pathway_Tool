package services;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.InputStreamReader;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map.Entry;
import java.util.Random;
import java.util.Set;
import java.util.stream.Collectors;

import com.google.gson.Gson;
import com.google.gson.JsonElement;

import bigg.model.BiggCompound;
import bigg.model.BiggCompoundObject;
import constants.KeggCalculatorConstants;
import fluxanalysis.DummyFBAArray;
import fluxanalysis.DummyFBAReactionObj;
import fluxanalysis.DummyFBAResponseObj;
import fluxanalysis.TempFile;
import json.KeggCreatorJobJSON;
import model.KeggCompound;
import model.KeggCompoundObject;
import model.KeggDataObject;
import model.KeggECObject;
import model.KeggKO;
import model.KeggKOObject;
import model.KeggModuleObject;
import model.KeggReaction;
import model.KeggReactionObject;
import model.SortedReactions;
import model.TaxonomyList;
import model.TaxonomyListObject;
import model.TaxonomyNcbi;
import model.TaxonomyResponseListObj;
import parser.KeggDataParser;

/**
 * services for module- creator
 * 
 * @author Daniel
 *
 */
public class KeggCreatorService {

	public Gson gson;
	private KeggDataObject keggData;
	public HashMap<String, KeggCreatorJobJSON> currentJobs;
	private List<TaxonomyNcbi> taxonomyList;
	public HashMap<String, ArrayList<String>> requestAccess = new HashMap<>();

	public KeggCreatorService() {
		this.gson = new Gson();
		this.currentJobs = new HashMap<>();
		this.keggData = new KeggDataObject();
		this.taxonomyList = new ArrayList<>();
	}
	
	public void initRequestMap() {
		this.requestAccess.put("startJob", new ArrayList<>());
		this.requestAccess.put("csvMPA", new ArrayList<>());
		this.requestAccess.put("csvModule", new ArrayList<>());
		this.requestAccess.put("status", new ArrayList<>());
		this.requestAccess.put("download", new ArrayList<>());
		this.requestAccess.put("downloadunmatchedproteins", new ArrayList<>());
		this.requestAccess.put("compoundlist", new ArrayList<>());
		this.requestAccess.put("modulelist", new ArrayList<>());
		this.requestAccess.put("module", new ArrayList<>());
		this.requestAccess.put("reactiondatabysubstrate", new ArrayList<>());
		this.requestAccess.put("konumberlist", new ArrayList<>());
		this.requestAccess.put("ecnumberlist", new ArrayList<>());
		this.requestAccess.put("getreactionlistbyeclist", new ArrayList<>());
		this.requestAccess.put("getreactionlistbykolist", new ArrayList<>());
		this.requestAccess.put("getreaction", new ArrayList<>());
		this.requestAccess.put("reactions", new ArrayList<>());
		this.requestAccess.put("taxonomyId", new ArrayList<>());
		this.requestAccess.put("taxonomy", new ArrayList<>());
		this.requestAccess.put("taxonomyByArray", new ArrayList<>());
		this.requestAccess.put("taxonomylist", new ArrayList<>());
		this.requestAccess.put("detailedContent", new ArrayList<>());
		this.requestAccess.put("downloadDetails", new ArrayList<>());
		
		
	}

	// parse all data from kegg and store them in graph KeggData
	public void parseKeggData() {
		KeggDataParser.parseModule2ModuleName(keggData, KeggCalculatorConstants.MODULE_LIST_DIR);
		KeggDataParser.parseReaction2ReactionName(keggData, KeggCalculatorConstants.REACTION_LIST_DIR);
		KeggDataParser.parseKo2KoName(keggData, KeggCalculatorConstants.KO_NUMBER_LIST_DIR);
		KeggDataParser.parseEc2EcName(keggData, KeggCalculatorConstants.EC_NUMBER_LIST_DIR);
		KeggDataParser.parseCompound2CompoundName(keggData, KeggCalculatorConstants.COMPOUND_NUMBER_LIST_DIR);
		KeggDataParser.parseGlycan2GlycanName(keggData, KeggCalculatorConstants.GLYCAN_NUMBER_LIST_DIR);
		KeggDataParser.parseModule2Reaction(keggData, KeggCalculatorConstants.MODULE_TO_REACTION_DIR);
		KeggDataParser.parseModule2KoNumber(keggData, KeggCalculatorConstants.MODULE_TO_KO_NUMBER_DIR);
		KeggDataParser.parseModule2EcNumber(keggData, KeggCalculatorConstants.MODULE_TO_EC_NUMBER_DIR);
		KeggDataParser.parseModule2Compounds(keggData, KeggCalculatorConstants.MODULE_TO_COMPOUND_DIR);
		KeggDataParser.parseModule2Glycans(keggData, KeggCalculatorConstants.MODULE_TO_GLYCAN_DIR);
		KeggDataParser.parseKo2Reactions(keggData, KeggCalculatorConstants.KO_TO_REACTION_DIR);
		KeggDataParser.parseEc2Reaction(keggData, KeggCalculatorConstants.EC_TO_REACTION_DIR);
		KeggDataParser.parseSubstrate2Reaction(keggData, KeggCalculatorConstants.SUBSTRATE_TO_REACTION_DIR);
		KeggDataParser.parseProduct2Reaction(keggData, KeggCalculatorConstants.PRODUCT_TO_REACTION_DIR);
		KeggDataParser.parseKo2EcNumber(keggData, KeggCalculatorConstants.KO_TO_EC_DIR);
		KeggDataParser.parseHsa2HsaName(keggData, KeggCalculatorConstants.HSA_NUMBER_LIST_DIR);
		KeggDataParser.parseBiggCompounds(keggData, KeggCalculatorConstants.BIGG_COMPOUNDS);
		KeggDataParser.parseKegg2BiggCompounds(keggData, KeggCalculatorConstants.KEGG_TO_BIGG_COMPOUNDS);
		KeggDataParser.parseKegg2BiggReaction(keggData, KeggCalculatorConstants.KEGG_TO_BIGG_REACTIONS);
		KeggDataParser.parseBiggReactions(keggData, KeggCalculatorConstants.BIGG_REACTIONS);
//		KeggCalculatorServer server = new KeggCalculatorServer();
//		server.setKeggData(this.keggData);
	}

	// clones all data from created graph
	public synchronized KeggDataObject cloneKeggData() {
		return this.keggData.cloneData();
	}

	// returns set of all possible substrates the user can send to the creator
	public HashSet<KeggCompound> getSubstrateSet() {
//		KeggCalculatorServer server = new KeggCalculatorServer();
//		KeggData keggData = server.cloneKeggData();+
		KeggDataObject keggDataClone = cloneKeggData();
		HashSet<KeggCompoundObject> substrateSet = keggDataClone.getCompounds();
		// exclude all compounds with ID C00001- C00020-> excessive occurence in
		// reactions
//		for (int excNum = 0; excNum < 21; excNum++) {
//			String excCompId;
//			if (excNum < 10) {
//				excCompId = "C0000".concat(String.valueOf(excNum));
//			} else {
//				excCompId = "C000".concat(String.valueOf(excNum));
//			}
//			KeggCompoundObject excComp = keggDataClone.getCompound(excCompId);
//			substrateSet.remove(excComp);
//		}
		HashSet<KeggCompound> substrateSetComp = new HashSet<KeggCompound>();
		for (KeggCompoundObject substrate : substrateSet) {
			KeggCompound substrateComp = new KeggCompound(substrate.getCompoundId(), substrate.getCompoundName());
			substrateSetComp.add(substrateComp);
		}
		return substrateSetComp;
	}

	public HashSet<String> getModuleSet() {
		HashSet<String> moduleSet = new HashSet<>();
		KeggDataObject keggDataClone = cloneKeggData();
		for (KeggModuleObject module : keggDataClone.getModules()) {
			String moduleString = "";
			moduleString = module.getModuleName();
			moduleString += " ";
			moduleString += module.getModuleId();
			moduleSet.add(moduleString);
		}
		return moduleSet;
	}

	// returns all possible forward reactions for a substrate
	public HashSet<KeggReaction> getReactionSet(String substrateId) {
		KeggDataObject keggDataClone = cloneKeggData();
		KeggCompoundObject substrateReq = keggDataClone.getCompound(substrateId);
		HashSet<KeggReactionObject> reactionSetRaw = substrateReq.getSubstrateReactions();
		HashSet<KeggReaction> reactionSet = new HashSet<KeggReaction>();
		for (KeggReactionObject reactionRaw : reactionSetRaw) {
			KeggReaction reaction = new KeggReaction(reactionRaw.getReactionId(), reactionRaw.getReactionName(), true);
			reactionSet.add(reaction);
		}
		return reactionSet;
	}

	// return all possible forward reactions for a substrate and sort them according
	// to their products
	public HashSet<SortedReactions> getProductSortedReactions(String substrateId) {
		HashSet<SortedReactions> productSortedReactionSet = new HashSet<SortedReactions>();
		KeggDataObject keggDataClone = cloneKeggData();
		HashSet<KeggReaction> reactionSet = getReactionSet(substrateId);
		HashSet<KeggReactionObject> reactionSetRaw = new HashSet<KeggReactionObject>();
		for (KeggReaction reaction : reactionSet) {
			reactionSetRaw.add(keggDataClone.getReaction(reaction.getReactionId()));
		}
		HashMap<KeggCompound, HashSet<KeggReaction>> productSortedReactions = new HashMap<KeggCompound, HashSet<KeggReaction>>();
		HashSet<KeggCompoundObject> productsRaw = new HashSet<KeggCompoundObject>();
		for (KeggReactionObject reaction : reactionSetRaw) {
			for (KeggCompoundObject product : reaction.getProducts()) {
				productsRaw.add(product);
			}
		}
		for (KeggCompoundObject productRaw : productsRaw) {
			HashSet<KeggReaction> sortedReactionSet = new HashSet<KeggReaction>();
			for (KeggReactionObject productReactionRaw : productRaw.getProductReactions()) {
				if (reactionSetRaw.contains(productReactionRaw)) {
					KeggReaction substrateReaction = new KeggReaction(productReactionRaw.getReactionId(),
							productReactionRaw.getReactionName(), true);
					substrateReaction.setStochiometrySubstratesString(productReactionRaw.getStochiometrySubstrates());
					substrateReaction.setStochiometryProductsString(productReactionRaw.getStochiometryProducts());
					for (KeggKOObject ko : productReactionRaw.getKonumbers()) {
						substrateReaction.addKONumberString(ko.getKoId());
					}
					for (KeggECObject ec : productReactionRaw.getEcnumbers()) {
						substrateReaction.addEcNumberString(ec.getEcId());
					}
					sortedReactionSet.add(substrateReaction);
				}
			}
			KeggCompound product = new KeggCompound(productRaw.getCompoundId(), productRaw.getCompoundName());
			Gson gson = new Gson();
			productSortedReactions.put(product, sortedReactionSet);
			SortedReactions productSortedReactionsObj = new SortedReactions(product.getCompoundId(),
					product.getCompoundName());
			for (KeggReaction reaction : sortedReactionSet) {
				productSortedReactionsObj.addReaction(reaction);
			}
			productSortedReactionSet.add(productSortedReactionsObj);

		}

		return productSortedReactionSet;
	}
	//

	// returns all possible backward reactions for a substrate
	public HashSet<KeggReaction> getReactionSetReverse(String substrateId) {
		KeggDataObject keggDataClone = cloneKeggData();
		KeggCompoundObject substrateReq = keggDataClone.getCompound(substrateId);
		HashSet<KeggReactionObject> reactionSetRevRaw = substrateReq.getProductReactions();
		HashSet<KeggReaction> reactionSetRev = new HashSet<KeggReaction>();
		for (KeggReactionObject reactionRevRaw : reactionSetRevRaw) {
			KeggReaction reactionRev = new KeggReaction(reactionRevRaw.getReactionId(),
					reactionRevRaw.getReactionName(), false);
			reactionSetRev.add(reactionRev);
		}
		return reactionSetRev;
	}

	// return all possible backward reactions for a substrate and sort them
	// according to their products
	public HashSet<SortedReactions> getProductSortedReactionsReverse(String substrateId) {
		KeggDataObject keggDataClone = cloneKeggData();
		HashSet<SortedReactions> substrateSortedReactionSet = new HashSet<SortedReactions>();
		HashSet<KeggReaction> reactionSetRev = getReactionSetReverse(substrateId);
		HashSet<KeggReactionObject> reactionSetRevRaw = new HashSet<KeggReactionObject>();
		for (KeggReaction reactionRev : reactionSetRev) {
			reactionSetRevRaw.add(keggDataClone.getReaction(reactionRev.getReactionId()));
		}
		HashMap<KeggCompound, HashSet<KeggReaction>> productSortedReactionsRev = new HashMap<KeggCompound, HashSet<KeggReaction>>();
		HashSet<KeggCompoundObject> substratesRaw = new HashSet<KeggCompoundObject>();
		for (KeggReactionObject reaction : reactionSetRevRaw) {
			for (KeggCompoundObject substrateRaw : reaction.getSubstrates()) {
				substratesRaw.add(substrateRaw);
			}
		}
		for (KeggCompoundObject substrateRaw : substratesRaw) {
			HashSet<KeggReaction> sortedReactionSetRev = new HashSet<KeggReaction>();
			for (KeggReactionObject substrateReactionRaw : substrateRaw.getSubstrateReactions()) {
				if (reactionSetRevRaw.contains(substrateReactionRaw)) {
					KeggReaction substrateReaction = new KeggReaction(substrateReactionRaw.getReactionId(),
							substrateReactionRaw.getReactionName(), false);
					sortedReactionSetRev.add(substrateReaction);
					substrateReaction.setStochiometrySubstratesString(substrateReactionRaw.getStochiometrySubstrates());
					substrateReaction.setStochiometryProductsString(substrateReactionRaw.getStochiometryProducts());
					for (KeggKOObject ko : substrateReactionRaw.getKonumbers()) {
						substrateReaction.addKONumberString(ko.getKoId());
					}
					for (KeggECObject ec : substrateReactionRaw.getEcnumbers()) {
						substrateReaction.addEcNumberString(ec.getEcId());
					}
				}
			}
			KeggCompound substrate = new KeggCompound(substrateRaw.getCompoundId(), substrateRaw.getCompoundName());
			Gson gson = new Gson();
			productSortedReactionsRev.put(substrate, sortedReactionSetRev);
			SortedReactions substrateSortedReactionsObj = new SortedReactions(substrate.getCompoundId(),
					substrate.getCompoundName());
			for (KeggReaction reaction : sortedReactionSetRev) {
				substrateSortedReactionsObj.addReaction(reaction);
			}
			substrateSortedReactionSet.add(substrateSortedReactionsObj);
		}
		return substrateSortedReactionSet;
	}

	public HashSet<String> getKoNumberSet() {
		KeggDataObject keggData = cloneKeggData();
		HashSet<String> koSet = new HashSet<>();
		for (KeggKOObject ko : keggData.getKoNumbers()) {
			String koString = "";
			koString += ko.getKoName();
			koString += " ";
			koString += ko.getKoId();
			koSet.add(koString);
		}
		return koSet;
	}

	public HashSet<String> getEcNumberSet() {
		KeggDataObject keggData = cloneKeggData();
		HashSet<String> ecSet = new HashSet<>();
		for (KeggECObject ec : keggData.getEcnumbers()) {
			String ecString = "";
			ecString += ec.getEcName();
			ecString += " ";
			ecString += ec.getEcId();
			ecSet.add(ecString);
		}
		return ecSet;
	}

	public HashMap<String, HashSet<String>> getEcNumberMap(HashSet<String> ecSet) {
		HashMap<String, HashSet<String>> ecMap = new HashMap<String, HashSet<String>>();
		KeggDataObject keggData = cloneKeggData();
		for (String ecString : ecSet) {
			HashSet<String> reactionSet = new HashSet<>();
			for (KeggReactionObject reaction : keggData.getEcnumber(ecString).getReactions()) {
				String reactionString = "";
				reactionString += reaction.getReactionName();
				reactionString += " ";
				reactionString += reaction.getReactionId();
				reactionSet.add(reactionString);
			}
			ecMap.put(ecString, reactionSet);
		}
		return ecMap;
	}

	public HashMap<String, HashSet<String>> getEcNumberMapException(HashSet<String> ecSet) {
		HashMap<String, HashSet<String>> ecMap = new HashMap<String, HashSet<String>>();
		KeggDataObject keggData = cloneKeggData();
		for (String ecString : ecSet) {
			HashSet<String> reactionSet = new HashSet<>();
			for (KeggECObject ec : keggData.getEcnumbers()) {
				String[] ecIdEntries = ec.getEcId().split("\\.");
				String ecId = ecIdEntries[0].concat(".").concat(ecIdEntries[1]).concat(".").concat(ecIdEntries[2])
						.concat(".");
				if (ecId.equals(ecString)) {
					System.out.println(ecId);
					HashSet<KeggReactionObject> reactions = ec.getReactions();
					for (KeggReactionObject reaction : reactions) {
						String reactionString = "";
						reactionString += reaction.getReactionName();
						reactionString += " ";
						reactionString += reaction.getReactionId();
						reactionSet.add(reactionString);
					}

				}
			}
			ecMap.put(ecString, reactionSet);
		}
		return ecMap;
	}

	public HashMap<String, HashSet<String>> getKoNumberMap(HashSet<String> koSet) {
		HashMap<String, HashSet<String>> koMap = new HashMap<String, HashSet<String>>();
		KeggDataObject keggData = cloneKeggData();
		for (String koString : koSet) {
			HashSet<String> reactionSet = new HashSet<>();
			for (KeggReactionObject reaction : keggData.getKoNumber(koString).getReactions()) {
				String reactionString = "";
				reactionString += reaction.getReactionName();
				reactionString += " ";
				reactionString += reaction.getReactionId();
				reactionSet.add(reactionString);
			}
			koMap.put(koString, reactionSet);
		}
		return koMap;
	}
	
	public void parseNcbiTaxonomy() {
		try {
			BufferedReader reader = new BufferedReader(new FileReader(new File(KeggCalculatorConstants.TAXONOMY_TREE)));
			String line = reader.readLine();
			line = reader.readLine();
			while (line != null) {
				String[] taxonomyEntries = line.split("\t");
				String id = taxonomyEntries[0].trim();
				String scientificName = taxonomyEntries[1];
				String rank = taxonomyEntries[2];
				TaxonomyNcbi taxonomy = new TaxonomyNcbi(id, rank, scientificName);
				this.taxonomyList.add(taxonomy);
				line = reader.readLine();
			}
			reader.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * 
	 * @return list of taxonomy from ncbi
	 */
	public List<TaxonomyNcbi> getTaxonomyList() {
		return this.taxonomyList;
	}

	public String getTaxonomyId(String taxonomicName, String taxonomicRank) {
		String id = "";
		for(TaxonomyNcbi taxonomy : this.taxonomyList) {
			if(taxonomy.getTaxonomicName().equals(taxonomicName) && taxonomy.getTaxonomicRank().equals(taxonomicRank)) {
				id = taxonomy.getId();
				break;
			}
		}
		return id;
	}
	
	public ArrayList<TaxonomyResponseListObj> getTaxonomyIdList(TaxonomyList taxonomyObjectList) {
		
		ArrayList<TaxonomyResponseListObj> ids = new ArrayList<TaxonomyResponseListObj>();
		
		for(TaxonomyListObject taxonomyObject : taxonomyObjectList.getTaxonomyObjectList()) {
				
			String reactionId = taxonomyObject.getReactionId();
			String name = taxonomyObject.getName();
			String rank = taxonomyObject.getRank();
			
			for(TaxonomyNcbi taxonomy : this.taxonomyList) {
				
				String id = taxonomy.getId();
				
				if(taxonomy.getTaxonomicName().equals(name) &&
						taxonomy.getTaxonomicRank().equals(rank)) {
					ids.add(new TaxonomyResponseListObj(reactionId, name, rank, id));
					
					break;
				}
			}
		}
		
		return ids;
	}

	public TaxonomyNcbi getTaxonomy(String id) {
		for(TaxonomyNcbi taxonomy : this.taxonomyList) {
			if(taxonomy.getId().equals(id)) {
				return taxonomy;
			}
		}
		return null;
	}

	public String getModuleFile(KeggCreatorService creator, String moduleId) {
		KeggDataObject keggData = creator.cloneKeggData();
		KeggModuleObject module = keggData.getModule(moduleId);
		String outputString = "stepId;ReactionNumberId;koNumberIds;ecNumberIds;stochCoeff;compoundId;typeOfCompound;reversibility;taxonomy;reactionX;reactionY;CompoundX;CompoundY;reactionAbbr;compoundAbbr;keyComp\n";
		int stepId =1;
		for(KeggReactionObject reaction : module.getReactions()) {
				for(Entry<String, String> entry : reaction.getStochiometrySubstrates().entrySet()) {
					outputString = outputString.concat(String.valueOf(stepId) +";");
					outputString = outputString.concat(reaction.getReactionName().replaceAll(";", "\t").concat(" " + reaction.getReactionId() + ";"));
					int koIt= 0;
					for(KeggKOObject ko : reaction.getKonumbers()) {
						outputString += ko.getKoId();
						if(koIt<reaction.getKonumbers().size()-1) {
							outputString += ",";
						}
						koIt++;
					}
					outputString+=";";
					int ecIt= 0;
					for(KeggECObject ec : reaction.getEcnumbers()) {
						outputString += ec.getEcId();
						if(ecIt<reaction.getEcnumbers().size()-1) {
							outputString += ",";
						}
						ecIt++;
					}
					outputString+=";";
					String stochCoeff = entry.getValue();
					String substString = entry.getKey();
					outputString += stochCoeff;
					outputString += ";";
					KeggCompoundObject subst = reaction.getSubstrate(substString);
					outputString+= subst.getCompoundName().replaceAll(";", "\t");
					outputString += " ";
					outputString += subst.getCompoundId();	
					outputString += ";";
					outputString += "substrate;";
					outputString += "reversible;";
					outputString += ";";//tax
					outputString += ";";//reactionX
					outputString += ";";//reactionY
					outputString += ";";//compX
					outputString += ";"; //compY
					outputString += reaction.getReactionName().replaceAll(";", "\t").concat(" " + reaction.getReactionId() + ";");
					outputString +=	subst.getCompoundName().replaceAll(";", "\t").concat(" " + subst.getCompoundId());
					outputString+= ";"; 
					outputString += "true;";
					outputString+= "\n";
				}	
				for(Entry<String, String> entry : reaction.getStochiometryProducts().entrySet()) {
					outputString = outputString.concat(String.valueOf(stepId) +";");
					outputString = outputString.concat(reaction.getReactionName().replaceAll(";", "\t").concat(" " + reaction.getReactionId() + ";"));
					int koIt= 0;
					for(KeggKOObject ko : reaction.getKonumbers()) {
						outputString += ko.getKoId();
						if(koIt<reaction.getKonumbers().size()-1) {
							outputString += ",";
						}
						koIt++;
					}
					outputString+=";";
					int ecIt= 0;
					for(KeggECObject ec : reaction.getEcnumbers()) {
						outputString += ec.getEcId();
						if(ecIt<reaction.getEcnumbers().size()-1) {
							outputString += ",";
						}
						ecIt++;
					}
					outputString+=";";
					String stochCoeff = entry.getValue();
					String prodString = entry.getKey();
					outputString += stochCoeff;
					outputString += ";";
					KeggCompoundObject prod = reaction.getProduct(prodString);
					outputString+= prod.getCompoundName().replaceAll(";", "\t");
					outputString += " ";
					outputString += prod.getCompoundId();	
					outputString += ";";
					outputString += "product;";
					outputString += "irreversible;";
					outputString += ";";//tax
					outputString += ";";//reactionX
					outputString += ";";//reactionY
					outputString += ";";//compX
					outputString += ";"; //compY
					outputString += reaction.getReactionName().replaceAll(";", "\t").concat(" " + reaction.getReactionId() + ";");
					outputString +=	prod.getCompoundName().replaceAll(";", "\t").concat(" " + prod.getCompoundId());
					outputString+= ";"; 
					outputString += "true;";
					outputString+= "\n";
				}
		
				stepId++;
		}
		return outputString;
	}
	
	public static String getAccessDate() {
		SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");  
	    Date date = new Date();  
	    String dateString = formatter.format(date);
	    return dateString;
	}

	public void getRequestAccess() {
		try {
			String requestsOutput = "Endpoint\tAccess-Dates\n";
			for(Entry<String, ArrayList<String>> entry : this.requestAccess.entrySet()) {
				requestsOutput += entry.getKey();
				requestsOutput += "\t";
				requestsOutput += entry.getValue().toString().replace("[", "").replace("]", "");
				requestsOutput +="\n";
			}
			BufferedWriter writer = new BufferedWriter(new FileWriter(new File(KeggCalculatorConstants.REQUEST_ACCESS_FILE)));
			writer.write(requestsOutput.trim());
			writer.flush();
			writer.close();
		}catch(Exception e) {
			e.printStackTrace();
		}
		
	}

	public ArrayList<DummyFBAResponseObj> getDummyFBA(DummyFBAArray reactionsArray) {
			
		Random r = new Random();
		ArrayList<DummyFBAResponseObj> dummyFluxes = new ArrayList<DummyFBAResponseObj>();
		
			for(DummyFBAReactionObj reaction : reactionsArray.getDummyFBAArray()) {
				double flux = r.nextGaussian()*1000;
				
				if (flux > 1000) {
					flux = 1000;
				} else if (flux < -1000) {
					flux = -1000;
				}
				
				dummyFluxes.add(new DummyFBAResponseObj(reaction.getReactionId(), flux));
			}
		return dummyFluxes;
	}
	
	public String startPythonProcess(String modelContainer) {
		String results;
		
		try {
			TempFile.createTempFile();
			TempFile.writeModelToTempFile(modelContainer);
			
			String pythonPath = new File("Python/pythonProject/main.py").getAbsolutePath();
						
			ProcessBuilder builder = new ProcessBuilder(Arrays.asList(
					"C:\\Python39\\python",
					pythonPath,
					"temp\\tempModel.txt"));

			builder.redirectErrorStream(true); // print Errors from Python
			Process process = builder.start();
			
			BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
			StringBuilder strBuilder = new StringBuilder();
			
			String line;
			
			while((line=reader.readLine())!=null) strBuilder.append(line);
			
            System.out.println("Running Python starts");
            
            int exitCode = process.waitFor();
            System.out.println(strBuilder.toString());
            System.out.println("Exit Code : "+ exitCode);
			results = TempFile.readTempFile("temp/tempResults.txt");
            
            return results;
			
			} catch (RuntimeException e) {
	            e.printStackTrace();
	            return "";
	        } catch (Exception e) {
	            e.printStackTrace();
	            return "";
	        } finally {
	            TempFile.deleteTempFile("temp/tempModel.txt");
	            TempFile.deleteTempFile("temp/tempResults.txt");
	            System.out.println("Done");
	        }
	}

	public HashSet<String> getTaxonomicNames(String rank) {
		HashSet<String> names = new HashSet<>();
		for(TaxonomyNcbi taxonomy : this.taxonomyList) {
			if(taxonomy.getTaxonomicRank().equals(rank) && names.size()<101) {
				names.add(taxonomy.getTaxonomicName());
			}
			
		}
		return names;
	}

	public HashSet<String> getFilteredTaxonomicNames(String rank, String subName) {
		HashSet<String> names = new HashSet<>();
		for(TaxonomyNcbi taxonomy : this.taxonomyList) {
			if(taxonomy.getTaxonomicRank().equals(rank) && taxonomy.getTaxonomicName().toLowerCase().contains(subName)&& names.size()<101) {
				names.add(taxonomy.getTaxonomicName());
			}
			
		}
		return names;
	}

	public HashSet<KeggReaction> filteredKeggReactions(String nameInput) {
		HashSet<KeggReaction> reactions = new HashSet<>();
//		KeggDataObject keggDataClone = cloneKeggData();
		
		for(KeggReactionObject reaction : this.keggData.getReactions()) {
			if(reaction.getReactionName().toLowerCase().contains(nameInput.toLowerCase()) && 
					reactions.size()<101) {
				
				reactions.add(reaction.toKeggReaction(reaction));
			}
		}
		return reactions;
	}
	
	public HashSet<KeggReaction> filteredKeggReactionIds(String idInput) {
		HashSet<KeggReaction> reactions = new HashSet<>();
		
		HashSet<KeggReactionObject> keggDataReactions = this.keggData.getReactions();
		
		for (KeggReactionObject id : keggDataReactions) {
			if(id.getReactionId().toLowerCase().contains(idInput.toLowerCase()) && 
					reactions.size()<101) {
				
				reactions.add(id.toKeggReaction(id));
			}
		}
		
		return reactions;
	}
	
	public HashSet<KeggReaction> getfilteredBiggReactionIds(String biggId) {
		HashSet<KeggReaction> reactions = new HashSet<>();
		
		HashSet<KeggReactionObject> keggDataReactions = this.keggData.getReactions();
		
		for (KeggReactionObject id : keggDataReactions) {
			HashSet<String> dataBiggIds = id.getBiggReactionIds();
			for (String item : dataBiggIds) {
				if(item.toLowerCase().contains(biggId.toLowerCase()) && reactions.size()<101) {
					reactions.add(id.toKeggReaction(id));
				}
			}
		}
		
		return reactions;
	}

	public HashSet<KeggReaction> getReactionDataByCompounds(String compoundIds) {
	
		String[] compounds = compoundIds.split(";");
		LinkedHashSet<String> compoundSet = new LinkedHashSet<String>(Arrays.asList(compounds));
		KeggDataObject keggDataClone = cloneKeggData();
		
		// initialize reaction sets with the first compound
		HashSet<KeggReactionObject> initialReactionSet = getReactionsFromQueryCompound(keggDataClone, compounds[0]);
		
//		HashSet<KeggReactionObject> allReactionHits = new HashSet<>(initialReactionSet);
		HashSet<KeggReactionObject> sharedReactionHits = new HashSet<>(initialReactionSet);
		
		// drop first compound		
		compoundSet.remove(compounds[0]);
		
		// iterate over remaining compounds		
		for (String compound : compoundSet) {
			HashSet<KeggReactionObject> reactionsFromCompound = getReactionsFromQueryCompound(keggDataClone, compound);
//			allReactionHits.addAll(reactionsFromCompound);
			// keeps only elements that are also included in the assigned Hashset (reactionsFromCompound)	
			sharedReactionHits.retainAll(reactionsFromCompound);
		}
		
		HashSet<KeggReaction> reactionsForResponse = new HashSet<>();
		
		for (KeggReactionObject reactionObject : sharedReactionHits) {
			reactionsForResponse.add(reactionObject.toKeggReaction(reactionObject));
			
			if (reactionsForResponse.size() == 100) {
				break;
			}
		}
		
//		for (KeggReactionObject reaction : allReactionHits) {
//			System.out.println(reaction.getReactionName());
//		}
//		System.out.println(allReactionHits.size());
//		System.out.println("----------------------------------------");
//		for (KeggReactionObject reaction : sharedReactionHits) {
//			System.out.println(reaction.getReactionName());
//		}
		System.out.println(reactionsForResponse.size());

		return reactionsForResponse;
	}
	
	public static HashSet<KeggReactionObject> getReactionsFromQueryCompound(KeggDataObject keggData, String compound) {
		KeggCompoundObject keggCompound = keggData.getCompound(compound);
		HashSet<KeggReactionObject> reactionsFromCompound = keggCompound.getReactions();
		return reactionsFromCompound;
	}

	public HashSet<String> getBiggReactionIds(String biggName) {
		
		HashMap<String, String> biggReactions = this.keggData.getBiggReactionsMap();
		HashSet<String> responseReactions = new HashSet<String>();
		 
		for (String reactionString : biggReactions.keySet()) {
			if (reactionString.toLowerCase().contains(biggName.toLowerCase()) && responseReactions.size()<101) {
				responseReactions.add(reactionString);
			}
		}
		
		return responseReactions;
	}

	public HashSet<String> keggReactionFromIdAndName(String reactionString) {
		// creates hashmap for reaction name - id combination
		HashSet<String> responseIds = new HashSet<String>();
		HashSet<String> keggReactions = this.keggData.getReactionNameIdSet();
		
		for (String keggId : keggReactions) {
			if (keggId.toLowerCase().contains(reactionString.toLowerCase()) && responseIds.size()<101) {
				responseIds.add(keggId);
			}
		}
		
		return responseIds;
	}

	public HashSet<String> filteredEcNumberList(String reactionString) {
		HashSet<String> ecNumbersResponse = new HashSet<String>();
		HashSet<String> ecNumbers = getEcNumberSet();
		
		for (String ecNumber : ecNumbers) {
			if (ecNumber.toLowerCase().contains(reactionString.toLowerCase()) && ecNumbersResponse.size()<101) {
				ecNumbersResponse.add(ecNumber);
			}
		}
		
		return ecNumbersResponse;
	}

	public HashSet<String> filteredKNumberSet(String reactionString) {
		HashSet<String> kNumberSet = new HashSet<String>();
		HashSet<String> kNumberResponseSet = new HashSet<String>();
		HashSet<KeggKOObject> kNumbers = keggData.getKoNumbers();
		
		for (KeggKOObject ko : kNumbers) {
			String kNumberString = ko.getKoName() + " " + ko.getKoId();
			
			kNumberSet.add(kNumberString);
		}
		
		for (String kNumber : kNumberSet) {
			if (kNumber.toLowerCase().contains(reactionString.toLowerCase()) && kNumberResponseSet.size()<101) {
				kNumberResponseSet.add(kNumber);
			}
		}
			
		return kNumberResponseSet;
	}

	public HashSet<String> filteredKeggCompoundSet(String compoundString) {
		HashSet<String> compoundSet = new HashSet<String>();
		HashSet<String> compoundSetResponseSet = new HashSet<String>();
		HashSet<KeggCompoundObject> compounds = keggData.getCompounds();
		
		for (KeggCompoundObject compound : compounds) {
			String compoundIdString = compound.getCompoundId() + " " + compound.getCompoundName();
			
			compoundSet.add(compoundIdString);
		}
		
		for (String compound : compoundSet) {
			if (compound.toLowerCase().contains(compoundString.toLowerCase()) && compoundSetResponseSet.size()<101) {
				compoundSetResponseSet.add(compound);
			}
		}
			
		return compoundSetResponseSet;
	}

	public HashSet<String> filteredBiggIdSet(String compoundString) {
		HashSet<String> biggCompoundSet = new HashSet<String>();
		HashSet<String> biggCompoundResponseSet = new HashSet<String>();
		HashSet<BiggCompoundObject> biggCompounds = keggData.getBiggCompounds();
		
		for (BiggCompoundObject compound : biggCompounds) {
			String compoundIdString =  compound.getCompoundName() + "  |  " + compound.getUniversalBiggId();
			
			biggCompoundSet.add(compoundIdString);
		}
		
		for (String compound : biggCompoundSet) {
			if (compound.toLowerCase().contains(compoundString.toLowerCase()) && biggCompoundResponseSet.size()<101) {
				biggCompoundResponseSet.add(compound);
			}
		}
		return biggCompoundResponseSet;
	}

}

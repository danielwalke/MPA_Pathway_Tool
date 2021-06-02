package parser;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;

import model.KeggCompoundObject;
import model.KeggDataObject;
import model.KeggECObject;
import model.KeggHsaObject;
import model.KeggKOObject;
import model.KeggModuleObject;
import model.KeggReactionObject;

/**
 * parse all csv files with kegg data and saves data in KeggData
 * @author Daniel
 *
 */
// rn:R04347
public class KeggDataParser {
	
	//parse module-Id to module-name connection
	public static void parseModule2ModuleName(KeggDataObject keggdata, String file) {
		try {
			BufferedReader br = new BufferedReader(new FileReader(new File(file)));
			String line = br.readLine();
			line = br.readLine(); // skip header
			while (line != null) {
				// lesen
				String[] splitLine = line.split("\t");
				String moduleID = splitLine[0];
				String moduleName = splitLine[1];
				KeggModuleObject module = new KeggModuleObject(moduleID, moduleName);
				keggdata.addModule(module);
				line = br.readLine();
			}
			br.close();
		} catch (Exception e) {
			// handle me :>
			e.printStackTrace();
		}
	}

	//parse reaction to reaction-name connection
	public static void parseReaction2ReactionName(KeggDataObject keggdata, String file) {
		try {
			BufferedReader br = new BufferedReader(new FileReader(new File(file)));
			String line = br.readLine();
			line = br.readLine(); // skip header
			while (line != null) {
				// lesen
				String[] splitLine = line.split("\t");
				String reactionId = splitLine[0];
				String reactionName = splitLine[1];
				KeggReactionObject reaction = new KeggReactionObject(reactionId, reactionName);
				keggdata.addReaction(reaction);
				line = br.readLine();
			}
			br.close();
		} catch (Exception e) {
			// handle me :>
			e.printStackTrace();
		}
	}

	//parse ko- Id to ko-name connection
	public static void parseKo2KoName(KeggDataObject keggdata, String file) {
		try {
			BufferedReader br = new BufferedReader(new FileReader(new File(file)));
			String line = br.readLine();
			line = br.readLine(); // skip header
			while (line != null) {
				// lesen
				String[] splitLine = line.split("\t");
				String koID = splitLine[0];
				String koName = splitLine[1];
				KeggKOObject ko = new KeggKOObject(koID, koName);
				keggdata.addKoNumber(ko);
				line = br.readLine();
			}
			br.close();
		} catch (Exception e) {
			// handle me :>
			e.printStackTrace();
		}
	}

	//parse ec-Id to ec-name connection
	public static void parseEc2EcName(KeggDataObject keggdata, String file) {
		try {
			BufferedReader br = new BufferedReader(new FileReader(new File(file)));
			String line = br.readLine();
			line = br.readLine(); // skip header
			while (line != null) {
				// lesen
				String[] splitLine = line.split("\t");
				String ecID = splitLine[0];
				String ecName = splitLine[1];
				KeggECObject ec = new KeggECObject(ecID, ecName);
				keggdata.addEcnumber(ec);
				line = br.readLine();
			}
			br.close();
		} catch (Exception e) {
			// handle me :>
			e.printStackTrace();
		}
	}

	//parse compound-Id to compound name connection
	public static void parseCompound2CompoundName(KeggDataObject keggdata, String file) {
		try {
			BufferedReader br = new BufferedReader(new FileReader(new File(file)));
			String line = br.readLine();
			line = br.readLine(); // skip header
			while (line != null) {
				// lesen
				String[] splitLine = line.split("\t");
				String compoundID = splitLine[0];
				String compoundName = splitLine[1];
				KeggCompoundObject compound = new KeggCompoundObject(compoundID, compoundName);
				keggdata.addCompound(compound);
				line = br.readLine();
			}
			br.close();
		} catch (Exception e) {
			// handle me :>
			e.printStackTrace();
		}
	}

	//parse glycan- Id to glycan-name connection
	public static void parseGlycan2GlycanName(KeggDataObject keggdata, String file) {
		try {
			BufferedReader br = new BufferedReader(new FileReader(new File(file)));
			String line = br.readLine();
			line = br.readLine(); // skip header
			while (line != null) {
				// lesen
				String[] splitLine = line.split("\t");
				String glycanID = splitLine[0];
				String glycanName = splitLine[1];
				KeggCompoundObject compound = new KeggCompoundObject(glycanID, glycanName);
				keggdata.addCompound(compound);
				line = br.readLine();
			}
			br.close();
		} catch (Exception e) {
			// handle me :>
			e.printStackTrace();
		}
	}

	//parse module-Id to reaction-Id connection
	public static void parseModule2Reaction(KeggDataObject keggdata, String file) {
		try {
			BufferedReader br = new BufferedReader(new FileReader(new File(file)));
			String line = br.readLine();
			line = br.readLine(); // skip header
			while (line != null) {
				// lesen
				String[] splitLine = line.split("\t");
				String moduleID = splitLine[0];
				String reactionID = splitLine[1];
				KeggModuleObject module = keggdata.getModule(moduleID);
				KeggReactionObject reaction = keggdata.getReaction(reactionID);
				// TODO: this is somewhat bad:
				// reaction step is assigned by order of appearance of reaction in file
				module.addReaction(module.getReactions().size() + 1, reaction);
				reaction.addModule(module);
//				keggdata.addModule(module);
//				keggdata.addReaction(reaction);
				line = br.readLine();
			}
			br.close();
		} catch (Exception e) {
			// handle me :>
			e.printStackTrace();
		}
	}

	//parse module-Id to ko-Id connection
	public static void parseModule2KoNumber(KeggDataObject keggdata, String file) {
		try {
			BufferedReader br = new BufferedReader(new FileReader(new File(file)));
			String line = br.readLine();
			line = br.readLine(); // skip header
			while (line != null) {
				// lesen
				String[] splitLine = line.split("\t");
				String moduleID = splitLine[0];
				String koID = splitLine[1];
				KeggModuleObject module = keggdata.getModule(moduleID);
				KeggKOObject koNumber = keggdata.getKoNumber(koID);
				// TODO: this is somewhat bad:
				// reaction step is assigned by order of appearance of reaction in file
				module.addKoNumber(koNumber);
				koNumber.addModule(module);
				line = br.readLine();
			}
			br.close();
		} catch (Exception e) {
			// handle me :>
			e.printStackTrace();
		}
	}

	//parsemodule-Id to ec-Id connection
	public static void parseModule2EcNumber(KeggDataObject keggdata, String file) {
		try {
			BufferedReader br = new BufferedReader(new FileReader(new File(file)));
			String line = br.readLine();
			line = br.readLine(); // skip header
			while (line != null) {
				// lesen
				String[] splitLine = line.split("\t");
				String moduleID = splitLine[0];
				String ecID = splitLine[1];
				KeggModuleObject module = keggdata.getModule(moduleID);
				KeggECObject ecNumber = keggdata.getEcnumber(ecID);
				// TODO: this is somewhat bad:
				// reaction step is assigned by order of appearance of reaction in file
				module.addEcNumber(ecNumber);
				ecNumber.addModule(module);
				line = br.readLine();
			}
			br.close();
		} catch (Exception e) {
			// handle me :>
			e.printStackTrace();
		}
	}

	//parse module-Id to compound-Id connection
	public static void parseModule2Compounds(KeggDataObject keggdata, String file) {
		try {
			BufferedReader br = new BufferedReader(new FileReader(new File(file)));
			String line = br.readLine();
			line = br.readLine(); // skip header
			while (line != null) {
				// lesen
				String[] splitLine = line.split("\t");
				String moduleID = splitLine[0];
				String compoundID = splitLine[1];
				KeggModuleObject module = keggdata.getModule(moduleID);
				KeggCompoundObject compound = keggdata.getCompound(compoundID);
				// TODO: this is somewhat bad:
				// reaction step is assigned by order of appearance of reaction in file
				module.addCompound(compound);
				compound.addModule(module);
				line = br.readLine();
			}
			br.close();
		} catch (Exception e) {
			// handle me :>
			e.printStackTrace();
		}
	}

	
	//parse module-Id to glycan-Id connection
	public static void parseModule2Glycans(KeggDataObject keggdata, String file) {
		try {
			BufferedReader br = new BufferedReader(new FileReader(new File(file)));
			String line = br.readLine();
			line = br.readLine(); // skip header
			while (line != null) {
				// lesen
				String[] splitLine = line.split("\t");
				String moduleID = splitLine[0];
				String glycanID = splitLine[1];
				KeggModuleObject module = keggdata.getModule(moduleID);
				KeggCompoundObject glycan = keggdata.getCompound(glycanID);
				// TODO: this is somewhat bad:
				// reaction step is assigned by order of appearance of reaction in file
				module.addCompound(glycan);
				glycan.addModule(module);
				line = br.readLine();
			}
			br.close();
		} catch (Exception e) {
			// handle me :>
			e.printStackTrace();
		}
	}

	//parse ko-Id to reaction- ID connection
	public static void parseKo2Reactions(KeggDataObject keggdata, String file) {
		try {
			BufferedReader br = new BufferedReader(new FileReader(new File(file)));
			String line = br.readLine();
			line = br.readLine(); // skip header
			while (line != null) {
				// lesen
				String[] splitLine = line.split("\t");
				String koID = splitLine[0];
				String reactionID = splitLine[1];
				KeggReactionObject reaction = keggdata.getReaction(reactionID);
				KeggKOObject konumber = keggdata.getKoNumber(koID);
				reaction.addKonumber(konumber);
				konumber.addReaction(reaction);
				line = br.readLine();
			}
			br.close();
		} catch (Exception e) {
			// handle me :>
			e.printStackTrace();
		}
	}

	//parse ec-Id to reaction-Id connection
	public static void parseEc2Reaction(KeggDataObject keggdata, String file) {
		try {
			BufferedReader br = new BufferedReader(new FileReader(new File(file)));
			String line = br.readLine();
			line = br.readLine(); // skip header
			while (line != null) {
				// lesen
				String[] splitLine = line.split("\t");
				String ecID = splitLine[0];
				String reactionID = splitLine[1];
				KeggReactionObject reaction = keggdata.getReaction(reactionID);
				KeggECObject ecNumber = keggdata.getEcnumber(ecID);		
				reaction.addEcnumber(ecNumber);
				ecNumber.addReaction(reaction);
				line = br.readLine();
			}
			br.close();
		} catch (Exception e) {
			// handle me :>
			e.printStackTrace();
		}
	}

	//parse substrate-Id and respective stochiometric-coefficient to reaction-Id connection
	public static void parseSubstrate2Reaction(KeggDataObject keggdata, String file) {
		try {
			BufferedReader br = new BufferedReader(new FileReader(new File(file)));
			String line = br.readLine();
			line = br.readLine(); // skip header
			while (line != null) {
				// lesen
				String[] splitLine = line.split("\t");
				String reactionID = splitLine[0];
				String stochCoeff = splitLine[1]; // includes glycans
				String compoundID = splitLine[2];
				// TODO: deal with names (and description?)
				KeggCompoundObject compound = keggdata.getCompound(compoundID);
				KeggReactionObject reaction = keggdata.getReaction(reactionID);
				reaction.addSubstrate(compound, stochCoeff);
				compound.addSubstrateReaction(reaction);
				line = br.readLine();
			}
			br.close();
		} catch (

		Exception e) {
			// handle me :>
			e.printStackTrace();
		}
	}

	//parse product-Id and respective stochiometric-coefficient to reaction-Id connection
	public static void parseProduct2Reaction(KeggDataObject keggdata, String file) {
		try {
			BufferedReader br = new BufferedReader(new FileReader(new File(file)));
			String line = br.readLine();
			line = br.readLine(); // skip header
			while (line != null) {
				// lesen
				String[] splitLine = line.split("\t");
				String reactionID = splitLine[0];
				String stochCoeff = splitLine[1]; // includes glycans
				String compoundID = splitLine[2];

				KeggCompoundObject compound;
				if (keggdata.getCompound(compoundID) != null) {
					compound = keggdata.getCompound(compoundID);
				} else {
					compound = new KeggCompoundObject(compoundID, "UNKNOWN");
					// https://www.genome.jp/dbget-bin/www_bget?rn:R12316
				}
				KeggReactionObject reaction = keggdata.getReaction(reactionID);
				reaction.addProduct(compound, stochCoeff);
				compound.addProductReaction(reaction);
				line = br.readLine();
			}
			br.close();
		} catch (Exception e) {
			// handle me :>
			e.printStackTrace();
		}
	}

	//parse ko-Id to ec-ID connection
	public static void parseKo2EcNumber(KeggDataObject keggdata, String file) {
		try {
			BufferedReader br = new BufferedReader(new FileReader(new File(file)));
			String line = br.readLine();
			line = br.readLine(); // skip header
			while (line != null) {
				// lesen
				String[] splitLine = line.split("\t");
				String koID = splitLine[0];
				String ecID = splitLine[1];
				KeggKOObject konumber = keggdata.getKoNumber(koID);				
				KeggECObject ecNumber;
				if (keggdata.getEcnumber(ecID) != null) {
					ecNumber = keggdata.getEcnumber(ecID);
				} else {
					ecNumber = new KeggECObject(ecID, "UNKNOWN");
				}

				konumber.addECNumber(ecNumber);
				ecNumber.addKoNumber(konumber);
				line = br.readLine();
			}
			br.close();
		} catch (Exception e) {
			// handle me :>
			e.printStackTrace();
		}
	}
	
	public static void parseModule2KeyCompounds(KeggDataObject keggData, String file) {
		try {
			BufferedReader br = new BufferedReader(new FileReader(new File(file)));
			String line = br.readLine();
			
			line = br.readLine(); // skip header
			while (line != null) {
				// lesen
				String[] splitLine = line.split("\t");
				String compoundId = splitLine[1];
				keggData.addKeyCompound(compoundId);;
				line = br.readLine();
			}
			br.close();
		}catch(Exception e) {
			e.printStackTrace();
		}
	}

	public static void parseHsa2HsaName(KeggDataObject keggData, String file) {
		try {
			BufferedReader br = new BufferedReader(new FileReader(new File(file)));
			String line = br.readLine();
			line = br.readLine(); // skip header
			while (line != null) {
				String[] splitLine = line.split("\t");
				String hsaId = splitLine[0];
				String hsaName = splitLine[1];
				KeggHsaObject hsaEntity = new KeggHsaObject(hsaId, hsaName);
				keggData.addHsa(hsaEntity);
				line = br.readLine();
			}
			br.close();
		}catch(Exception e) {
			e.printStackTrace();
		}
		
	}

}

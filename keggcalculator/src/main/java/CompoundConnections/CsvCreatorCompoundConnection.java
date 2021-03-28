package CompoundConnections;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.InputStreamReader;
import java.net.URL;
import java.util.HashSet;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import constants.KeggCalculatorConstants;
import model.KeggDataObject;
import model.KeggModuleObject;
import parser.KeggDataParser;
import substrateAndProductParser.Reactions;
//TODO add glycans
public class CsvCreatorCompoundConnection {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		try {
			BufferedWriter writerKeys = new BufferedWriter(
					new FileWriter(new File("src/main/resources/KEGG/essentialFiles/KeyCompoundList.csv")));
			HashSet<String> keyCompounds = new HashSet<String>();
			
			BufferedWriter writer = new BufferedWriter(
					new FileWriter(new File("src/main/resources/KEGG/essentialFiles/CompoundConnectionsDownload.csv"))); //delete?
			writer.write("Substrate;Product");
			writer.newLine();
			KeggDataObject keggData = new KeggDataObject();
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
			for (KeggModuleObject module : keggData.getModules()) {
			String moduleId = module.getModuleId();
			System.out.println(moduleId);
			URL modulesDetailsURL = new URL("http://rest.kegg.jp/get/module:" + moduleId);
			BufferedReader moduleDetailsReader = new BufferedReader(
					new InputStreamReader(modulesDetailsURL.openStream()));
			String moduleDetailsString;
			while ((moduleDetailsString = moduleDetailsReader.readLine()) != null) {
				Pattern patternEquation = Pattern.compile(".*" + "->" + ".*");
				Matcher matcherEquation = patternEquation.matcher(moduleDetailsString);
				while (matcherEquation.find()) {
					String reaction = matcherEquation.group();
//						System.out.println(reaction);
					if (reaction.contains("-> ")) {
						String[] reactionSplit = reaction.split("-> ");
						String substrateSide = reactionSplit[0];
						String productSide = reactionSplit[1];
						Pattern patternCompound = Pattern.compile("C" + "[0-9][0-9][0-9][0-9][0-9]");
						Matcher matcherCompoundSubstrates = patternCompound.matcher(substrateSide);
						while (matcherCompoundSubstrates.find()) {

							Matcher matcherCompoundProducts = patternCompound.matcher(productSide);
							while (matcherCompoundProducts.find()) {
								keyCompounds.add(matcherCompoundProducts.group());
								keyCompounds.add(matcherCompoundSubstrates.group());
								writer.write(matcherCompoundSubstrates.group());
								writer.write(";");
								writer.write(matcherCompoundProducts.group());
								writer.newLine();
							}
						}
					}
				}
			}
			}
			writer.flush();
			writer.close();
			for(String key : keyCompounds) {
				writerKeys.write(key);
				writerKeys.newLine();
			}
			writerKeys.flush();
			writerKeys.close();

		} catch (Exception e) {
			e.printStackTrace();
		}
	}

}

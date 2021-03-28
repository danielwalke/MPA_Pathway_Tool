package main;

import java.io.File;

import calculator.CalculatorOutputList;
import constants.KeggCalculatorConstants;
import model.KeggDataObject;
import model.KeggModuleObject;
import model.KeggReactionObject;
import model.MpaProteine;
import parser.Calculator2;
import parser.KeggDataParser;
import parser.ModuleFileParser;
import parser.MpaFileParser2;
/**
 * class for testing new calculator 03.10.20
 * @author Daniel
 *
 */
public class TestCalc {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		//read keggdata
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
		KeggDataObject clone = keggData.cloneData();
		KeggDataObject keggDataUser = new KeggDataObject();
		
		//read new example module file
		ModuleFileParser moduleFileparser = new ModuleFileParser();
		String moduleFileName= "src/main/resources/KEGG/modules/acetoclasticMethanogenesisKEGGWithTax.csv";
		moduleFileparser.addFile(moduleFileName);
		moduleFileparser.parseModuleFile(keggDataUser);
//for(KeggModuleObject module : keggDataUser.getModules()) {
//	for(KeggReactionObject reaction : module.getReactions()) {
//		System.out.println(reaction.getKoAndEcNumberIds());
//	}
//}
		//read example mpa file
		String mpaFileName ="src/main/resources/KEGG/MPAfile.csv";
		
		
		//starts Calculator2
		CalculatorOutputList outputList = new CalculatorOutputList();
		MpaProteine proteins = new MpaProteine(mpaFileName);
		MpaFileParser2.parseMpaFile(proteins, mpaFileName, outputList);
		Calculator2 calc = new Calculator2();
		calc.loopModules(keggData, keggDataUser, proteins, outputList);
		
		//write output-file
		outputList.writeCSV(new File("src/main/resources/KEGG/CalcOutput_0310.csv"));
	}

}

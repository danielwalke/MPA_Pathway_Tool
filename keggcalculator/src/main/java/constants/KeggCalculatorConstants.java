/**
 * 
 */
package constants;

/**
 * contains all directions for files
 * @author Daniel
 *
 */
public class KeggCalculatorConstants {
	
	//directions for web-url uploads and downloads -> used in Calculator
	//public static final String UPLOAD_TEMP_LOCATION = "temp";
	public static final String WEB_URL = "http://localhost:80/";
	public static final String DOWNLOAD_DIR = "download/";
	public static final String UPLOAD_DIR = "upload/";
	public static final String UPLOAD_TEMP_DIR = UPLOAD_DIR + "/temp";
	public static final String GRAPH_DOWNLOAD_DIR = "graphDownload/";
	
	//lists of kegg
	public static final String REACTION_LIST_DIR = "src/main/resources/KEGG/essentialFiles/kegg_list_reaction_2020_09_30.csv";
	public static final String MODULE_LIST_DIR = "src/main/resources/KEGG/essentialFiles/kegg_list_module_2020_09_30.csv";
	public static final String EC_NUMBER_LIST_DIR = "src/main/resources/KEGG/essentialFiles/kegg_list_ec_2020_09_30.csv";
	public static final String KO_NUMBER_LIST_DIR = "src/main/resources/KEGG/essentialFiles/kegg_list_ko_2020_09_30.csv";
	public static final String COMPOUND_NUMBER_LIST_DIR = "src/main/resources/KEGG/essentialFiles/kegg_list_compounds_2020_09_30.csv";
	public static final String GLYCAN_NUMBER_LIST_DIR = "src/main/resources/KEGG/essentialFiles/kegg_list_glycans_2020_09_30.csv";
	public static final String HSA_NUMBER_LIST_DIR = "src/main/resources/KEGG/essentialFiles/kegg_list_hsa_060621.csv";

	//connections KEGG
	public static final String MODULE_TO_REACTION_DIR = "src/main/resources/KEGG/essentialFiles/kegg_connection_module2reaction_2020_09_30.csv";
	public static final String MODULE_TO_KO_NUMBER_DIR = "src/main/resources/KEGG/essentialFiles/kegg_connection_module2ko_2020_09_30.csv";
	public static final String MODULE_TO_EC_NUMBER_DIR = "src/main/resources/KEGG/essentialFiles/kegg_connection_module2ec_2020_09_30.csv";
	public static final String MODULE_TO_COMPOUND_DIR = "src/main/resources/KEGG/essentialFiles/kegg_connection_module2compound_2020_09_30.csv";
	public static final String MODULE_TO_GLYCAN_DIR = "src/main/resources/KEGG/essentialFiles/kegg_connection_module2glycan_2020_09_30.csv";
	public static final String EC_TO_REACTION_DIR="src/main/resources/KEGG/essentialFiles/kegg_connection_ec2reaction_2020_09_30.csv";
	public static final String KO_TO_REACTION_DIR="src/main/resources/KEGG/essentialFiles/kegg_connection_ko2reaction_2020_09_30.csv";
	public static final String KO_TO_EC_DIR="src/main/resources/KEGG/essentialFiles/kegg_connection_ko2ec_2020_09_30.csv";
	public static final String MODULE_TO_KEYCOMPOUNDS_DIR="src/main/resources/KEGG/essentialFiles/ModuleToKeyCompounds.csv";
	
	//list of substrates to reaction from kegg-api (contains substrates, stochiometric coefficient, polymerisation factor and reaction-number)
	public static final String SUBSTRATE_TO_REACTION_DIR="src/main/resources/KEGG/essentialFiles/kegg_list_reaction2substrate_300920.csv";
	//list of products to reaction from kegg-api (contains products, stochiometric coefficient, polymerisation factor and reaction-number)
	public static final String PRODUCT_TO_REACTION_DIR="src/main/resources/KEGG/essentialFiles/kegg_list_reaction2product_300920.csv";

	//SBML-file namespaces
	public static final String LEVEL1 = "http://www.sbml.org/sbml/level1";//according to devops depractated
	public static final String LEVEL2 = "http://www.sbml.org/sbml/level3/version1/core";//according to devops depractated
	public static final String LEVEL3 = "http://www.sbml.org/sbml/level3";
	
	//NCBI taxonomy files
	public static final String TAXONOMY_TREE = "src/main/resources/KEGG/essentialFiles/ncbiTaxonomy.csv";
	
	//output-file for requests
	public static final String REQUEST_ACCESS_FILE="src/main/resources/KEGG/essentialFiles/RequestAccess.csv";
	
	//Bigg Compounds
	public static final String BIGG_COMPOUNDS="src/main/resources/BIGG/bigg_compounds_2021-09-23.csv";
	public static final String KEGG_TO_BIGG_COMPOUNDS="src/main/resources/BIGG/kegg_compound2bigg_compound_2021-09-23.csv";
	public static final String KEGG_TO_BIGG_REACTIONS ="src/main/resources/BIGG/kegg_reaction2bigg_reaction_2021-09-23.csv";

}

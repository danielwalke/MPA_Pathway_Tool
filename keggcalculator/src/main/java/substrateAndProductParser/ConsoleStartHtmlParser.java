package substrateAndProductParser;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map.Entry;

/**
 * class to start parsing of substrates and products from reaction equations of KEGG
 * @author Daniel
 *
 */
public class ConsoleStartHtmlParser {
	
	//starts parsing
	public static void main(String[] args) {
		CompoundHtmlParser parser = new CompoundHtmlParser();

		//creates writer for all reaction equations with their reaction-number-Id
		try {
			BufferedWriter writer = new BufferedWriter(new FileWriter("src/main/resources/KEGG/essentialFiles/Reactions.csv"));
			writer.write("reaction-Number" + ";" + "reaction- equation");
			writer.newLine();
			for (String reactionId : parser.getReactionList()) {				
				parser.parseAPI(reactionId, writer);
			}
			writer.flush();
			writer.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		//reads created file with reaction equations and parse substrates and products (all reversible), stochiometric coefficients and polymerisation factors
		String fileName= "src/main/resources/KEGG/Reaction.csv";
		parser.parseCsv(fileName);
		HashSet<Reactions> reactionSetSubstAndProd = parser.getReactionSubAndProdList();
		System.out.println(reactionSetSubstAndProd.size());
		
		//writes all substrates, stochiometric coefficients and polymerisation factors and their reaction- number- ID in a file
		try {
			BufferedWriter writerSubstrates = new BufferedWriter(
					new FileWriter("src/main/resources/KEGG/essentialFiles/kegg_list_reaction2substrate_300920.csv"));
			writerSubstrates.write("ReactionID" + "	" + "StochCoeff" + "	" + "Substrates" + "	" + "other site");
			writerSubstrates.newLine();
			ArrayList<String> substList = new ArrayList<String>();
			for (Reactions reaction : reactionSetSubstAndProd) {
				String reactionID = reaction.getReactionID();
				HashMap<String, String> substrateMap = reaction.getStochiometrySubstrates();
				for (Entry<String, String> substrateEntry : substrateMap.entrySet()) {
					String substrateID = substrateEntry.getKey();
					String substrateStochCoeff = substrateEntry.getValue();
					substList.add(substrateID);
					writerSubstrates.write(reactionID + "	" + substrateStochCoeff + "	" + substrateID + "	"
							+ reaction.getOtherSiteSubst().get(substrateID));
					writerSubstrates.newLine();
				}

			}
			writerSubstrates.flush();
			writerSubstrates.close();
			
			//writes all products, stochiometric coefficients and polymerisation factors and their reaction- number- ID in a file
			BufferedWriter writerProducts = new BufferedWriter(
					new FileWriter("src/main/resources/KEGG/essentialFiles/kegg_list_reaction2product_300920.csv"));
			writerProducts.write("ReactionID" + "	" + "StochCoeff" + "	" + "Product" + "	" + "other site");
			writerProducts.newLine();
			for (Reactions reaction : reactionSetSubstAndProd) {
				String reactionID = reaction.getReactionID();

				HashMap<String, String> productMap = reaction.getStochiometryProducts();
				for (Entry<String, String> productEntry : productMap.entrySet()) {
					String productID = productEntry.getKey();
					String productStochCoeff = productEntry.getValue();
					writerProducts.write(reactionID + "	" + productStochCoeff + "	" + productID + "	"
							+ reaction.getOtherSiteProd().get(productID));
					writerProducts.newLine();
				}
			}
			writerProducts.flush();
			writerProducts.close();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}
}

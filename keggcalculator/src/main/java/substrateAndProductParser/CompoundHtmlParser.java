package substrateAndProductParser;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
//wir brauchen einen pathwayfinder der die beiden komponenten auf den verschiedenen Seiten jeder Reaktion als struktuell ähnlich erkennt
//einfachere Möglichkeit sind existente Connections in vorhandenen Modulen rauszusuchen
//map Compound, list of compounds connected to this in all modules
/**
 * 
 * @author Daniel parse kegg api reactions for subststrates and products and in
 *         each reaction
 */
public class CompoundHtmlParser {
	private final HashSet<Reactions> reactionSubAndProdSet;

	public CompoundHtmlParser() {
		this.reactionSubAndProdSet = new HashSet<Reactions>();
	}

	public void addReaction(Reactions reaction) {
		this.reactionSubAndProdSet.add(reaction);
	}

	// gets list of reaction IDs from file kegg_list_reaction_2020_09_30.csv
	public List<String> getReactionList() {
		List<String> reactionList = new ArrayList<String>();
		try {
			BufferedReader br = new BufferedReader(
					new FileReader("src/main/resources/KEGG/essentialFiles/kegg_list_reaction_2020_09_30.csv"));
			String line = br.readLine();
			while (line != null) {
				String[] splitLine = line.split("\t");
				String reactionId = splitLine[0];
				reactionList.add(reactionId);
				line = br.readLine();
			}
			br.close();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return reactionList;
	}

	// parse kegg-api and saves reaction- equations in a new file
	public void parseAPI(String rNum, BufferedWriter writer) {
		try {
			URL reactionDetailsURL = new URL("http://rest.kegg.jp/get/rn:" + rNum);
			System.out.println(rNum);
			Reactions reaction = new Reactions(rNum);
			BufferedReader reactionDetailsReader = new BufferedReader(
					new InputStreamReader(reactionDetailsURL.openStream()));
			String reactionDetailsString;
			while ((reactionDetailsString = reactionDetailsReader.readLine()) != null) {
				Pattern patternEquation = Pattern.compile("EQUATION" + ".*");
				Matcher matcherEquation = patternEquation.matcher(reactionDetailsString);
				while (matcherEquation.find()) {
					String reactionString = matcherEquation.group().substring(11, matcherEquation.group().length());
					writer.write(rNum + ";" + reactionString);
					writer.newLine();
				}
			}
		} catch (Exception e) {

		}
	}

	// parse created csv- file with reaction- equations
	// splits reaction equation in substrate side and product side
	public void parseCsv(String fileName) {
		try {
			BufferedReader reader = new BufferedReader(new FileReader(new File(fileName)));
			String line = reader.readLine();
			int counter = 0;
			while (line != null) {
				if (counter > 0) {
					String csvSeparator = "; ";
					String[] csvEntries = line.split(csvSeparator);
					String reactionNumber = csvEntries[0];
					String equation = csvEntries[1];
					Reactions reaction = new Reactions(reactionNumber);
					String[] reactionSides = equation.split(" <=> ");
					parseSubstrateSide(reactionSides[0], reaction);
					parseProductSide(reactionSides[1], reaction);
					addReaction(reaction);
				}

				counter++;
				line = reader.readLine();
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	// parse product side to get product- compounds/glycans, stochiometric
	// coefficient and polymerisation factor
	private void parseProductSide(String reactionSide, Reactions reaction) {
		String productSide = reactionSide.substring(0, reactionSide.length());
		// handles different states
		if (!productSide.contains(" + ")) {// Single component on this side
			if (productSide.contains("(") && !(productSide.contains(") "))) {// contains polymerisation- factor
				if (productSide.contains(" ")) { // contains stochiometric coefficient
					String[] productStochCoeffPolym = productSide.split("\\s");
					String stochCoeff = productStochCoeffPolym[0];
					String[] productPolym = productStochCoeffPolym[1].split("\\(");
					String productId = productPolym[0];
					String polym = productPolym[1];
					Products product = new Products(productId);
					reaction.addProduct(product, stochCoeff, "(" + polym);
				} else { // contains no stochiometric coefficient
					String[] productPolym = productSide.split("\\(");
					String productId = productPolym[0];
					String polym = productPolym[1];
					Products product = new Products(productId);
					reaction.addProduct(product, "1", "(" + polym);
				}
			} else {// contains no polymerisation- factor
				if (productSide.contains(" ")) { // contains stochiometric coefficient
					String[] productStochCoeff = productSide.split("\\s");
					String stochCoeff = productStochCoeff[0];
					String productId = productStochCoeff[1];
					Products product = new Products(productId);
					reaction.addProduct(product, stochCoeff, "");
				} else { // contains neither polymerisation- factor nor stochiometric coefficient
					String productId = productSide;
					Products product = new Products(productId);
					reaction.addProduct(product, "1", "");
				}
			}
		} else { // multiple component on product side
			String[] products = productSide.split("\\s\\+\\s");
			for (String productRaw : products) {
				if (productRaw.contains("(") && !(productRaw.contains(") "))) {// contains polymerisation-factor
					if (productRaw.contains(" ")) {// contains stochCoeff
						String[] productStochCoeffPolym = productRaw.split("\\s");
						String stochCoeff = productStochCoeffPolym[0];
						String[] productPolym = productStochCoeffPolym[1].split("\\(");
						String productId = productPolym[0];
						String polym = productPolym[1];
						Products product = new Products(productId);
						reaction.addProduct(product, stochCoeff, "(" + polym);
					} else { // contains no stochiometric coefficient
						String[] productPolym = productRaw.split("\\(");
						String productId = productPolym[0];
						String polym = productPolym[1];
						Products product = new Products(productId);
						reaction.addProduct(product, "1", "(" + polym);
					}
				} else { // contains no polymerisation-factor
					if (productRaw.contains(" ")) {// contains stochiometric coefficient
						String[] productStochCoeff = productRaw.split("\\s");
						String stochCoeff = productStochCoeff[0];
						String productId = productStochCoeff[1];
						Products product = new Products(productId);
						reaction.addProduct(product, stochCoeff, "");
					} else {// contains neither polymerisation- factor nor stochiometric coefficient
						String productId = productRaw;
						Products product = new Products(productId);
						reaction.addProduct(product, "1", "");
					}
				}
			}
		}
	}

	// parse substrate side to get substrate- compounds/glycans, stochiometric
	// coefficient and polymerisation factor
	private void parseSubstrateSide(String reactionSide, Reactions reaction) {
		String substrateSide = reactionSide.substring(0, reactionSide.length());
		if (!substrateSide.contains(" + ")) {// Single component
			if (substrateSide.contains("(") && !(substrateSide.contains(") "))) {// // contains polymerisation-factor
				if (substrateSide.contains(" ")) { //contains stochiometric coefficient
					String[] substrateStochCoeffPolym = substrateSide.split("\\s");
					String stochCoeff = substrateStochCoeffPolym[0];
					String[] substratePolym = substrateStochCoeffPolym[1].split("\\(");
					String substrateId = substratePolym[0];
					String polym = substratePolym[1];
					Substrates substrate = new Substrates(substrateId);
					reaction.addSubstrate(substrate, stochCoeff, "(" + polym);
				} else {//contains no stochiometric coefficient
					String[] substratePolym = substrateSide.split("\\(");
					String substrateId = substratePolym[0];
					String polym = substratePolym[1];
					Substrates substrate = new Substrates(substrateId);
					reaction.addSubstrate(substrate, "1", "(" + polym);
				}
			} else {// contains no polymerisation-factor
				if (substrateSide.contains(" ")) { // contains stochiometric coefficient
					String[] substrateStochCoeff = substrateSide.split("\\s");
					String stochCoeff = substrateStochCoeff[0];
					String substrateId = substrateStochCoeff[1];
					Substrates substrate = new Substrates(substrateId);
					reaction.addSubstrate(substrate, stochCoeff, "");
				} else {// contains neither polymerisation- factor nor stochiometric coefficient
					String substrateId = substrateSide;
					Substrates substrate = new Substrates(substrateId);
					reaction.addSubstrate(substrate, "1", "");
				}
			}
		} else { // multiple component
			String[] substrates = substrateSide.split("\\s\\+\\s");
			for (String substrateRaw : substrates) {
				if (substrateRaw.contains("(") && !(substrateRaw.contains(") "))) {// contains polymerisation-factor
					if (substrateRaw.contains(" ")) {// contains stochiometric coefficient
						String[] substrateStochCoeffPolym = substrateRaw.split("\\s");
						String stochCoeff = substrateStochCoeffPolym[0];
						String[] substratePolym = substrateStochCoeffPolym[1].split("\\(");
						String substrateId = substratePolym[0];
						String polym = substratePolym[1];
						Substrates substrate = new Substrates(substrateId);
						reaction.addSubstrate(substrate, stochCoeff, "(" + polym);
					} else { // contains no stochiometric coefficient
						String[] substratePolym = substrateRaw.split("\\(");
						String substrateId = substratePolym[0];
						String polym = substratePolym[1];
						Substrates substrate = new Substrates(substrateId);
						reaction.addSubstrate(substrate, "1", "(" + polym);
					}
				} else {// contains no polymerisation-factor
					if (substrateRaw.contains(" ")) {// contains stochiometric coefficient
						String[] substrateStochCoeff = substrateRaw.split("\\s");
						String stochCoeff = substrateStochCoeff[0];
						String substrateId = substrateStochCoeff[1];
						Substrates substrate = new Substrates(substrateId);
						reaction.addSubstrate(substrate, stochCoeff, "");
					} else {// contains neither polymerisation- factor nor stochiometric coefficient
						String substrateId = substrateRaw;
						Substrates substrate = new Substrates(substrateId);
						reaction.addSubstrate(substrate, "1", "");
					}
				}
			}
		}
	}

	public HashSet<Reactions> getReactionSubAndProdList() {
		return reactionSubAndProdSet;
	}

}

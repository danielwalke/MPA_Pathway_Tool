package main;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;

import model.KeggCompoundObject;
import model.KeggDataObject;
import model.KeggModuleObject;
import model.KeggReactionObject;
import parser.ModuleFileParser;


/**
 * class for writing an example module- file
 * data (module content) obtained from random reactions of pathway- Finder 
 * @author Daniel
 *
 */
public class testModuleFile {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		String moduleContent = "steps;reactionNumber;koNumbers;ecNumbers;stochCoeff;compound;compoundType;keyComponent;reversibility;taxonomy\n1;R01786;K12407,K00845,K00844;2.7.1.1,2.7.1.2;1;C00668;product;key;reversible;livingThing\n1;R01786;K12407,K00845,K00844;2.7.1.1,2.7.1.2;1;C00002;substrate;notKey;reversible;livingThing\n1;R01786;K12407,K00845,K00844;2.7.1.1,2.7.1.2;1;C00267;substrate;key;reversible;livingThing\n1;R01786;K12407,K00845,K00844;2.7.1.1,2.7.1.2;1;C00008;product;notKey;reversible;livingThing\n2;R02739;K01792,K15916,K01810,K13810,K06859;5.1.3.15,5.3.1.9;1;C00668;substrate;key;reversible;livingThing\n2;R02739;K01792,K15916,K01810,K13810,K06859;5.1.3.15,5.3.1.9;1;C01172;product;key;reversible;livingThing\n3;R03321;K15916,K01810,K13810,K06859;5.3.1.9;1;C05345;product;key;reversible;livingThing\n3;R03321;K15916,K01810,K13810,K06859;5.3.1.9;1;C01172;substrate;key;reversible;livingThing\n4;R02073;K21071,K00895;2.7.1.90;1;C05378;product;key;reversible;livingThing\n4;R02073;K21071,K00895;2.7.1.90;1;C05345;substrate;key;reversible;livingThing\n4;R02073;K21071,K00895;2.7.1.90;1;C00013;substrate;notKey;reversible;livingThing\n4;R02073;K21071,K00895;2.7.1.90;1;C00009;product;notKey;reversible;livingThing\n5;R01070;K16305,K01624,K11645,K01622,K16306,K01623;4.1.2.13;1;C05378;substrate;key;reversible;livingThing\n5;R01070;K16305,K01624,K11645,K01622,K16306,K01623;4.1.2.13;1;C00111;product;key;reversible;livingThing\n5;R01070;K16305,K01624,K11645,K01622,K16306,K01623;4.1.2.13;1;C00118;product;notKey;reversible;livingThing\n6;R12289;;2.3.1.277;1;C22065;product;notKey;reversible;livingThing\n6;R12289;;2.3.1.277;1;C00229;product;key;reversible;livingThing\n6;R12289;;2.3.1.277;1;C00111;substrate;key;reversible;livingThing\n6;R12289;;2.3.1.277;1;C22064;substrate;notKey;reversible;livingThing\n7;R06643;K05551,K05553,K05552;2.3.1.235;1;C00229;substrate;key;reversible;livingThing\n7;R06643;K05551,K05553,K05552;2.3.1.235;1;C12354;product;key;reversible;livingThing\n7;R06643;K05551,K05553,K05552;2.3.1.235;10;C00011;product;notKey;reversible;livingThing\n7;R06643;K05551,K05553,K05552;2.3.1.235;10;C00083;substrate;notKey;reversible;livingThing\n7;R06643;K05551,K05553,K05552;2.3.1.235;10;C00010;product;notKey;reversible;livingThing\n8;R09269;K15886;2.3.1.235;1;C12354;substrate;key;reversible;livingThing\n8;R09269;K15886;2.3.1.235;2;C00001;product;notKey;reversible;livingThing\n8;R09269;K15886;2.3.1.235;1;C18337;product;key;reversible;livingThing\n9;R09355;;;1;C00229;product;key;reversible;livingThing\n9;R09355;;;1;C12366;product;key;reversible;livingThing\n9;R09355;;;1;C18337;substrate;key;reversible;livingThing\n10;R06699;K15968;4.2.1.154;1;C00001;product;notKey;reversible;livingThing\n10;R06699;K15968;4.2.1.154;1;C12367;product;key;reversible;livingThing\n10;R06699;K15968;4.2.1.154;1;C12366;substrate;key;reversible;livingThing\n11;R06700;K15969;1.13.12.21;1;C00007;substrate;notKey;reversible;livingThing\n11;R06700;K15969;1.13.12.21;1;C12368;product;key;reversible;livingThing\n11;R06700;K15969;1.13.12.21;1;C00001;product;notKey;reversible;livingThing\n11;R06700;K15969;1.13.12.21;1;C12367;substrate;key;reversible;livingThing\n12;R06701;K15886;;1;C12368;substrate;key;reversible;livingThing\n12;R06701;K15886;;1;C12369;product;key;reversible;livingThing\n13;R06702;K15970;;1;C12370;product;key;reversible;livingThing\n13;R06702;K15970;;1;C12369;substrate;key;reversible;livingThing\n14;R06703;K15971;;1;C12370;substrate;key;reversible;livingThing\n14;R06703;K15971;;1;C00021;product;key;reversible;livingThing\n14;R06703;K15971;;1;C00019;substrate;notKey;reversible;livingThing\n14;R06703;K15971;;1;C12371;product;notKey;reversible;livingThing\n15;R00192;K01251;3.3.1.1;1;C00021;substrate;key;reversible;livingThing\n15;R00192;K01251;3.3.1.1;1;C00001;substrate;notKey;reversible;livingThing\n15;R00192;K01251;3.3.1.1;1;C00155;product;key;reversible;livingThing\n15;R00192;K01251;3.3.1.1;1;C00212;product;notKey;reversible;livingThing\n16;R01283;K17217;4.4.1.2;1;C00001;substrate;notKey;reversible;livingThing\n16;R01283;K17217;4.4.1.2;1;C00014;product;notKey;reversible;livingThing\n16;R01283;K17217;4.4.1.2;1;C00155;substrate;key;reversible;livingThing\n16;R01283;K17217;4.4.1.2;1;C00109;product;key;reversible;livingThing\n16;R01283;K17217;4.4.1.2;1;C00283;product;notKey;reversible;livingThing\n17;R06987;K00656;2.3.1.54;1;C00058;product;key;reversible;livingThing\n17;R06987;K00656;2.3.1.54;1;C00109;substrate;key;reversible;livingThing\n17;R06987;K00656;2.3.1.54;1;C00100;product;notKey;reversible;livingThing\n17;R06987;K00656;2.3.1.54;1;C00010;substrate;notKey;reversible;livingThing\n18;R11592;;1.1.98.6;1;C00677;product;key;reversible;livingThing\n18;R11592;;1.1.98.6;1;C00011;product;notKey;reversible;livingThing\n18;R11592;;1.1.98.6;1;C00001;product;notKey;reversible;livingThing\n18;R11592;;1.1.98.6;1;C00058;substrate;key;reversible;livingThing\n18;R11592;;1.1.98.6;1;C03802;substrate;notKey;reversible;livingThing\n19;R04315;K00527;1.17.4.2;1;C00677;substrate;key;reversible;livingThing\n19;R04315;K00527;1.17.4.2;1;C00001;substrate;notKey;reversible;livingThing\n19;R04315;K00527;1.17.4.2;1;C00343;substrate;key;reversible;livingThing\n19;R04315;K00527;1.17.4.2;1;C00342;product;key;reversible;livingThing\n19;R04315;K00527;1.17.4.2;1;C03802;product;notKey;reversible;livingThing\n20;R09506;K15717;1.11.1.20;1;C00427;substrate;notKey;reversible;livingThing\n20;R09506;K15717;1.11.1.20;1;C00343;product;key;reversible;livingThing\n20;R09506;K15717;1.11.1.20;1;C00639;product;notKey;reversible;livingThing\n20;R09506;K15717;1.11.1.20;1;C00342;substrate;key;reversible;livingThing\n21;R02024;K00526,K00525,K00524,K10807,K10808;1.17.4.1;1;C00112;product;key;reversible;livingThing\n21;R02024;K00526,K00525,K00524,K10807,K10808;1.17.4.1;1;C00001;substrate;notKey;reversible;livingThing\n21;R02024;K00526,K00525,K00524,K10807,K10808;1.17.4.1;1;C00343;substrate;key;reversible;livingThing\n21;R02024;K00526,K00525,K00524,K10807,K10808;1.17.4.1;1;C00705;substrate;notKey;reversible;livingThing\n21;R02024;K00526,K00525,K00524,K10807,K10808;1.17.4.1;1;C00342;product;key;reversible;livingThing\n22;R00514;K14641,K01510,K14642;3.6.1.5;1;C00112;substrate;key;reversible;livingThing\n22;R00514;K14641,K01510,K14642;3.6.1.5;1;C00001;substrate;notKey;reversible;livingThing\n22;R00514;K14641,K01510,K14642;3.6.1.5;1;C00055;product;key;reversible;livingThing\n22;R00514;K14641,K01510,K14642;3.6.1.5;1;C00009;product;notKey;reversible;livingThing\n23;R00510;K06966;3.2.2.10;1;C00001;substrate;notKey;reversible;livingThing\n23;R00510;K06966;3.2.2.10;1;C00055;substrate;key;reversible;livingThing\n23;R00510;K06966;3.2.2.10;1;C00380;product;key;reversible;livingThing\n23;R00510;K06966;3.2.2.10;1;C00117;product;notKey;reversible;livingThing\n24;R00974;K03365,K01485;3.5.4.1;1;C00106;product;key;reversible;livingThing\n24;R00974;K03365,K01485;3.5.4.1;1;C00001;substrate;notKey;reversible;livingThing\n24;R00974;K03365,K01485;3.5.4.1;1;C00014;product;notKey;reversible;livingThing\n24;R00974;K03365,K01485;3.5.4.1;1;C00380;substrate;key;reversible;livingThing\n25;R03131;;2.5.1.53;1;C00106;substrate;key;reversible;livingThing\n25;R03131;;2.5.1.53;1;C00033;product;key;reversible;livingThing\n25;R03131;;2.5.1.53;1;C03584;product;notKey;reversible;livingThing\n25;R03131;;2.5.1.53;1;C00979;substrate;notKey;reversible;livingThing\n26;R05508;K01026;2.8.3.1;1;C00033;substrate;key;reversible;livingThing\n26;R05508;K01026;2.8.3.1;1;C00827;substrate;notKey;reversible;livingThing\n26;R05508;K01026;2.8.3.1;1;C00186;product;key;reversible;livingThing\n26;R05508;K01026;2.8.3.1;1;C00024;product;notKey;reversible;livingThing\n27;R11996;;1.1.3.2;1;C00007;substrate;notKey;reversible;livingThing\n27;R11996;;1.1.3.2;1;C00022;product;key;reversible;livingThing\n27;R11996;;1.1.3.2;1;C00027;product;notKey;reversible;livingThing\n27;R11996;;1.1.3.2;1;C00186;substrate;key;reversible;livingThing\n";
		try {
			BufferedWriter writer = new BufferedWriter(new FileWriter(new File("src/main/resources/KEGG/moduleTest.csv")));
			writer.write(moduleContent);
			writer.flush();
			writer.close();
		}catch(Exception e) {
			e.printStackTrace();
		}
	try {
		KeggDataObject keggdataUser = new KeggDataObject();
		ModuleFileParser mopduleParser= new ModuleFileParser();
		mopduleParser.addFile( "src/main/resources/KEGG/moduleTest.csv");
		mopduleParser.parseModuleFile(keggdataUser);
		for(KeggModuleObject module : keggdataUser.getModules()) {
			System.out.println(module.getModuleId());
			for(KeggReactionObject r : module.getReactions()) {
				System.out.println(r.getReactionId());
//				System.out.println(r.getKonumbers());
//				System.out.println(r.getEcnumbers());
				for(KeggCompoundObject comp : r.getSubstrates()) {
					System.out.println(comp.getCompoundId());
				}
				for(KeggCompoundObject comp : r.getProducts()) {
					System.out.println(comp.getCompoundId());
				}
			}
		}
	} catch (Exception e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	}
	}

}

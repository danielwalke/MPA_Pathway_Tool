package cazy;

import java.util.HashMap;
import java.util.HashSet;

public class main {
	public static void main (String[] args) {
		String fileName = "src/main/java/cazy/ceToEc.csv";
		HashMap<String, HashSet<String>> ghObjects = new HashMap<String, HashSet<String>>();
		HashMap<String, String> ghToPathway = new HashMap<>(); //gh was the first and important family to fetch
		Parser parser = new Parser(fileName);
		parser.parseKeggData();
		parser.readFile(ghObjects);
		parser.createPathwayStrings(ghObjects, ghToPathway);
		parser.writeFiles("C:\\Users\\danie\\Desktop\\Cazy\\CE_Families", ghToPathway); //my own local directory
		System.out.println(ghToPathway);
	}
}

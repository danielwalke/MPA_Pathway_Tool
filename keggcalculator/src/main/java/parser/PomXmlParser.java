package parser;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.nio.CharBuffer;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;

import constants.KeggCalculatorConstants;

import java.io.File;
import java.io.FileNotFoundException;

public class PomXmlParser {

	public static void main(String[] args) throws IOException {
		// TODO Auto-generated method stub
		PomXmlParser parser = new PomXmlParser();
		HashSet<String> dependencies = parser.readPomXml();
		HashMap<String, String> dependencyMap = parser.readDependencies(dependencies);
		System.out.println(dependencyMap);
	

	}

	public HashMap<String, String> readDependencies(HashSet<String> dependencies) {
		HashMap<String, String> dependencyMap = new HashMap<>();
		for(String dependency : dependencies) {
			String artifactId = readArtefactId(dependency);
			String version = readVersion(dependency);
			dependencyMap.put(artifactId, version);
		}
		return dependencyMap;
	}
	
	private String readVersion(String dependency) {
		return readXmlTag(dependency, "version");
	}

	private static String readXmlTag(String xmlContent, String tagName) {
		String tag = "";
		String openingTag = "<".concat(tagName).concat(">");
		String closingTag = "</".concat(tagName).concat(">");
		String[] firstSplciedEntries = xmlContent.split(closingTag);
		String[]  fullSplicedEntries = new String[0];
		try{
			fullSplicedEntries = firstSplciedEntries[0].split(openingTag);
		}catch (IndexOutOfBoundsException e) {
			System.out.println("couldnt find opening tag");
			e.printStackTrace();
			return "";
		}
		try{
			tag = fullSplicedEntries[1];
		}catch (IndexOutOfBoundsException e) {
			System.out.println("couldnt find closing tag");
			e.printStackTrace();
			return "";
		}
		return tag;
	}

	private String readArtefactId(String dependency) {
		return readXmlTag(dependency, "artifactId");
	}

	public HashSet<String> readPomXml() throws IOException {
		try {
			BufferedReader reader = new BufferedReader(new FileReader(new File(KeggCalculatorConstants.POM_XML)));
			String line = reader.readLine();
			String dependency = "";
			HashSet<String> dependencies = new HashSet<>();
			while( line != null ) {
				if(line.contains("<dependency>")) {
					dependency = "";
				}
				dependency += line.trim();
				if(line.contains("</dependency>")) {
					dependencies.add(dependency);
					dependency = "";					
				}
				line = reader.readLine();
			}
			return dependencies;
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} 
		
		return null;
	}
	
	

}

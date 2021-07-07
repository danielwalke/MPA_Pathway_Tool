package fluxanalysis;

import java.io.*;
import java.util.Arrays;
import java.util.List;
import java.util.Scanner;

public class TempFile {
	
	public static void createTempFile() {
		try {
			File tempModel = new File("temp/tempModel.txt");
			if (tempModel.createNewFile()) {
				System.out.println("File created: " + tempModel.getName());
			} else {
				System.out.println("File already exists.");
			}
		} catch (IOException e) {
			System.out.println("An error occured.");
			e.printStackTrace();
		}
	}
	
	public static void writeModelToTempFile(String modelString ) {
		try {
		      FileWriter writer = new FileWriter("temp/tempModel.txt");
		      writer.write(modelString);
		      writer.close();
		      System.out.println("Successfully wrote to the file.");
		    } catch (IOException e) {
		      System.out.println("An error occurred.");
		      e.printStackTrace();
		    }
	}
	
	public static String readTempFile(String tempFileName) {
		try {
		      File tempFile = new File(tempFileName);
		      Scanner reader = new Scanner(tempFile);
		      
		      String data = "";
		      
		      while (reader.hasNextLine()) {
		        data += reader.nextLine();
		      }
		      reader.close();
		      return data;
		    } catch (FileNotFoundException e) {
		      System.out.println("An error occurred.");
		      e.printStackTrace();
		      return null;
		    }
	}
	
	public static void deleteTempFile(String tempFileName) {
		File tempFile = new File(tempFileName);
		if (tempFile.delete()) {
			System.out.println("Deleted File: " + tempFile.getName());
		} else {
			System.out.println("Failed to delete File.");
		}
	}
}

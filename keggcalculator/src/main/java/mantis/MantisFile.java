package mantis;

import java.util.ArrayList;
import java.util.HashMap;

public class MantisFile {
	private String fileName;
	private HashMap<String, MantisProtein> mantisProteins;	
	private String fastaFilePath;
	private ArrayList<String> sampleHeaders;
	
	
	public MantisFile() {
		this.mantisProteins = new HashMap<String, MantisProtein>();
		this.fastaFilePath = "";
		this.sampleHeaders = new ArrayList<>();
	}
	
	
	
	public ArrayList<String> getSampleHeaders() {
		return sampleHeaders;
	}

	public void addSampleHeader(String sampleHeader) {
		this.sampleHeaders.add(sampleHeader);
	}


	public String getFastaFilePath() {
		return fastaFilePath;
	}



	public void setFastaFilePath(String fastaFilePath) {
		this.fastaFilePath = fastaFilePath;
	}



	public void addMantisProtein(MantisProtein protein) {
		this.mantisProteins.put(protein.getUuid(), protein);
	}

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public HashMap<String, MantisProtein> getMantisProteins() {
		return mantisProteins;
	}
	
	public MantisProtein getMantisProtein(String uuid) {
		return this.mantisProteins.get(uuid);
	}
	
	
}

package mantis;

import java.util.HashSet;

public class MantisFile {
	private String fileName;
	private HashSet<MantisProtein> mantisProteins;	
	private String fastaFilePath;
	
	
	public MantisFile() {
		this.mantisProteins = new HashSet<>();
		this.fastaFilePath = "";
	}
	
	public String getFastaFilePath() {
		return fastaFilePath;
	}



	public void setFastaFilePath(String fastaFilePath) {
		this.fastaFilePath = fastaFilePath;
	}



	public void addMantisProtein(MantisProtein protein) {
		this.mantisProteins.add(protein);
	}

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public HashSet<MantisProtein> getMantisProteins() {
		return mantisProteins;
	}
	
	
	
}

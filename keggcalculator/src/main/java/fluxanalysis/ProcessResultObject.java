package fluxanalysis;

public class ProcessResultObject {
	
	private String results;
	private int exitCode;
	
	public ProcessResultObject(String results, int exitCode) {
		this.results = results;
		this.exitCode = exitCode;
	}

	public String getResults() {
		return results;
	}

	public int getExitCode() {
		return exitCode;
	}

}

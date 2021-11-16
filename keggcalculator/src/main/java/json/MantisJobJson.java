package json;

public class MantisJobJson {
	public String jobID;
	public String mantisFile;
	public String message;
	public String downloadLink;
	
	
	//clone data from job
	public void cloneFrom(MantisJobJson job) {
		if (job.jobID != null) {
			this.jobID = job.jobID;
		} else {
			this.jobID = "";
		}
		if (job.mantisFile != null) {
			this.mantisFile = job.mantisFile;
		} else {
			this.mantisFile = "";
		}
		if (job.message != null) {
			this.message = job.message;
		} else {
			this.message = "";
		}
		if (job.downloadLink != null) {
			this.downloadLink = job.downloadLink;
		} else {
			this.downloadLink = "";
		}
	}
}

package json;

public class FbaJobJson {
	public String jobId;
	public String networkName;
	public String message;
	public String jobCode; // 0 running, -1 fail, 1 done
	public String fbaSolution;
	
	public void cloneFrom(FbaJobJson fbaJob) {
		if (fbaJob.jobId != null) {
			this.jobId = fbaJob.jobId;
		} else {
			this.jobId = "";
		}
		
		if (fbaJob.networkName != null) {
			this.networkName = fbaJob.networkName;
		} else {
			this.networkName = "";
		}
		
		if (fbaJob.message != null) {
			this.message = fbaJob.message;
		} else {
			this.message = "";
		}
		
		if (fbaJob.fbaSolution != null) {
			this.fbaSolution = fbaJob.fbaSolution;
		} else {
			this.fbaSolution = "";
		}
		
		if (fbaJob.jobCode != null) {
			this.jobCode = fbaJob.jobCode;
		} else {
			this.jobCode = "";
		}
	}
}

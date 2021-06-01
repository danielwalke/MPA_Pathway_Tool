package json;

import java.util.LinkedList;
import java.util.List;

import services.KeggCreatorService;
/**
 * class for creating json
 * used for exchanging data (endpoints)
 * contains user-specific- job-ID, name of mpa- file, list of uploaded module-file-names, message about actual status of current job and downloadlink
 * @author Daniel
 *
 */
public class KeggCalculatorJobJSON {
	
	public String jobID;
	public String mpaCSVFile;
	public List<String> moduleFiles;
	public String message;
	public String downloadLink;
	public String downloadLinkUnmatchedProteinFile;
	
	
	//clone data from job
	public void cloneFrom(KeggCalculatorJobJSON job) {
		if (job.jobID != null) {
			this.jobID = job.jobID;
		} else {
			this.jobID = "";
		}
		if (job.mpaCSVFile != null) {
			this.mpaCSVFile = job.mpaCSVFile;
		} else {
			this.mpaCSVFile = "";
		}
		if (job.moduleFiles != null) {
			this.moduleFiles = job.moduleFiles;
		} else {
			this.moduleFiles = new LinkedList<String>();
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
		if (job.downloadLinkUnmatchedProteinFile != null) {
			this.downloadLinkUnmatchedProteinFile = job.downloadLinkUnmatchedProteinFile;
		} else {
			this.downloadLinkUnmatchedProteinFile = "";
		}
	}

}

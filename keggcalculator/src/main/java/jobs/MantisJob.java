package jobs;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Map.Entry;

import constants.KeggCalculatorConstants;
import json.MantisJobJson;
import mantis.MantisFile;
import mantis.MantisParser;
import mantis.MantisProtein;

public class MantisJob implements Runnable {

	private MantisJobJson job;
	private String mantisDir;

	public MantisJob(MantisJobJson job) {
		this.job = job;
		this.job.message = "created";
		this.mantisDir = "";
	}

	@Override
	public void run() {
		this.job.message = "started";
		System.out.println("Mantis job started");
		// timeout counter
		int count = 0;
		// wait for files
		while (true) {
			boolean mantisUpload = false;
			// check MPA csv file
			File mantisFile = new File("upload/" + this.job.jobID + "/" + this.job.mantisFile);
			if (mantisFile.exists())
				mantisUpload = true;
			// can we start?
			if (mantisUpload) {
				break;
			}
			if (count > 2000) {
				break;
			}
			// wait a bit
			try {
				Thread.sleep(100);
			} catch (Exception e) {
				e.printStackTrace();
			}
			count++;
		}
		// start calculator
		try {
			// read input file here
			String mantisFileName = "upload/" + this.job.jobID + "/" + this.job.mantisFile;
			MantisFile file = new MantisFile();
			file.setFileName(mantisFileName);
			String mantisFastaFile = "upload/" + this.job.jobID + "/" + this.job.mantisFile + "_fasta.faa";
			file.setFastaFilePath(mantisFastaFile);
			MantisParser.readFile(file);
			// write fast file for mantis
			MantisParser.writeFastaFile(file);
			for (Entry<String, MantisProtein> proteinEntry : file.getMantisProteins().entrySet()) {
				MantisProtein protein = proteinEntry.getValue();
				System.out.println(protein.getQuants());
			}

			String absoluteFastaPath = new File(mantisFastaFile).getAbsolutePath();

			startProcessBuilder(absoluteFastaPath);

			readMantisOutput(this.job.jobID, file);

			this.job.downloadLink = writeMpaFile(file);

			System.out.println("Mantis job finished");
			
			this.job.message = "finished";

		} catch (Exception e) {
			e.printStackTrace();
			this.job.message = "failed";
			this.job.downloadLink = null;
		}
	}

	private String writeMpaFile(MantisFile file) {
		new File(KeggCalculatorConstants.DOWNLOAD_DIR + this.job.jobID).mkdir();
		String outputPath = KeggCalculatorConstants.DOWNLOAD_DIR + this.job.jobID + "/mantisOutput.csv";
		try {
			BufferedWriter writer = new BufferedWriter(new FileWriter(new File(outputPath)));
			writeHeader(writer, file);
			writeProteins(writer, file);
			writer.flush();
			writer.close();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return outputPath;
	}

	private void writeProteins(BufferedWriter writer, MantisFile file) throws IOException {
		for (Entry<String, MantisProtein> proteinEntry : file.getMantisProteins().entrySet()) {
			writer.write("\n");
			MantisProtein protein = proteinEntry.getValue();
			writer.write(protein.getId() + "\t");
			int index = 0;
			writeKNumbers(writer, protein, index);
			index = 0;
			writeEcNumbers(writer, protein, index);
			writeTaxa(writer, protein);
			writer.write("\t" + protein.getDescription());
			for (double quant : protein.getQuants()) {
				writer.write("\t" + String.valueOf(quant));
			}
		}		
	}

	private void writeTaxa(BufferedWriter writer, MantisProtein protein) throws IOException {
		writer.write("\t" + protein.getTaxa().get("superkingdom"));
		writer.write("\t" + protein.getTaxa().get("kingdom"));
		writer.write("\t" + protein.getTaxa().get("phylum"));
		writer.write("\t" + protein.getTaxa().get("class"));
		writer.write("\t" + protein.getTaxa().get("order"));
		writer.write("\t" + protein.getTaxa().get("family"));
		writer.write("\t" + protein.getTaxa().get("genus"));
		writer.write("\t" + protein.getTaxa().get("species"));
		
	}

	private void writeEcNumbers(BufferedWriter writer, MantisProtein protein, int index) throws IOException {
		for (String ecNumber : protein.getEcNumbers()) {
			writer.write(ecNumber);
			if (index < protein.getEcNumbers().size() - 1) {
				writer.write("|");
			}
			index++;
		}
	}

	private void writeKNumbers(BufferedWriter writer, MantisProtein protein, int index) throws IOException {
		for (String kNumber : protein.getkNumbers()) {
			writer.write(kNumber);
			if (index < protein.getkNumbers().size() - 1) {
				writer.write("|");
			}
			index++;
		}
		writer.write("\t");
	}

	private void writeHeader(BufferedWriter writer, MantisFile file) throws IOException {
		writer.write(
				"id\tkoNumbers\tecNumbers\tsuperkingdom\tkingdom\tphylum\tclass\torder\tfamily\tgenus\tspecies\tdescription");
		for (String sampleHeader : file.getSampleHeaders()) {
			writer.write("\t" + sampleHeader);
		}

	}

	private void readMantisOutput(String jobID, MantisFile file) {
		String outFilePath = this.mantisDir + "/integrated_annotation.tsv";
		try {
			BufferedReader reader = new BufferedReader(new FileReader(new File(outFilePath)));
			String line = reader.readLine();
			line = reader.readLine();
			while (line != null) {
				String[] lineEntries = line.split("\t");
				String refFile = lineEntries[1];
				String id = lineEntries[0].trim();
				String kNumber = lineEntries[2].trim();
				HashSet<String> links = new HashSet<>();
				for (int linkIndex = 14; linkIndex < lineEntries.length; linkIndex++) {
					links.add(lineEntries[linkIndex].trim());
				}
				if (refFile == "kofam_merged") {
					fillInformationInProtein(id, kNumber, links, file);
				}
				line = reader.readLine();
			}
			reader.close();
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

	private void fillInformationInProtein(String id, String kNumber, HashSet<String> links, MantisFile file) {
		MantisProtein mantisProtein = file.getMantisProtein(id);
		mantisProtein.addKNumber(kNumber);
		addEcNumbers(links, mantisProtein);
	}

	private void addEcNumbers(HashSet<String> links, MantisProtein mantisProtein) {
		for (String link : links) {
			if (link.contains("enzyme_ec:")) {
				String[] linkEntries = link.split(":");
				mantisProtein.addEcNumber(linkEntries[1]);
			}
		}
	}

	private void startProcessBuilder(String absoluteFastaPath) {
		try {
			String shellPath = writeShellFile(absoluteFastaPath);
			List<String> commandList = Arrays.asList("/bin/bash", "-i", shellPath);
			ProcessBuilder mantisBuilder = new ProcessBuilder(commandList);
			mantisBuilder.redirectErrorStream(true);
			Process mantisProcess = mantisBuilder.start();
			BufferedReader mantisProcessReader = new BufferedReader(
					new InputStreamReader(mantisProcess.getInputStream()));
			String mantisProcessLine;
			while ((mantisProcessLine = mantisProcessReader.readLine()) != null) {
				System.out.println(mantisProcessLine);
			}

		} catch (RuntimeException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			System.out.println("Done");
		}
	}

	private String writeShellFile(String absoluteFastaPath) {
		String jobId = this.job.jobID;
		String filePath = "upload/" + jobId + "/" + jobId + ".sh";
		try {
			this.mantisDir = KeggCalculatorConstants.FULL_UPLOAD_PATH + "/" + jobId + "/mantis";
			new File(this.mantisDir).mkdir();
			BufferedWriter writer = new BufferedWriter(new FileWriter(new File(filePath)));
			writer.write("conda init --all\n" + "echo \"conda initialized\"\n" + "conda activate mantis_env\n"
					+ "conda env list\n" + "echo \"environtment setted\"\n" + KeggCalculatorConstants.PYTHON_PATH + " "
					+ KeggCalculatorConstants.MANTIS_PATH + " run_mantis -t " + absoluteFastaPath + " -o "
					+ this.mantisDir + "\necho \"mantis finished\"\n");
			writer.flush();
			writer.close();
			return filePath;
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return "";
		}

	}
}

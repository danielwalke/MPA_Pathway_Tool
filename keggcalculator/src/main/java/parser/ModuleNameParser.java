package parser;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.InputStreamReader;

/**
 * parse module name for each given module-ID
 * not necessary with new calculator
 * @author Daniel
 *
 */
public class ModuleNameParser {
	String moduleId;
	String moduleName;

	public ModuleNameParser() {
		this.moduleName = "";
	}

	private String getModuleId() {
		return moduleId;
	}

	public void setModuleId(String moduleId) {
		this.moduleId = moduleId;
	}

	public String getModuleName() {
		return moduleName;
	}

	private void setModuleName(String moduleName) {
		this.moduleName = moduleName;
	}

	public void parseModuleName() {
		this.moduleId = getModuleId();
		try {
			InputStream input = new FileInputStream(
					"C:\\Users\\Daniel\\git\\keggMpa\\kegg-mpa\\keggcalculator\\src\\main\\resources\\KEGG\\kegg_list_module_2020_05_13.csv");
			InputStreamReader inputReader = new InputStreamReader(input);
			BufferedReader reader = new BufferedReader(inputReader);
			int ignoreHeader = 0;
			String line = "";
			while ((line = reader.readLine()) != null) {
				if (ignoreHeader > 0) {
					String csvSeperator = "\t";
					String[] entries = line.split(csvSeperator);				
					if (entries[0].equals(getModuleId())) {
						this.moduleName = entries[1];
						setModuleName(moduleName);
					}
				}
				ignoreHeader++;
			}
		} catch (Exception e) {
		}
	}
}

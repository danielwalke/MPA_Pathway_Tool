package main;

import java.io.File;
import java.io.IOException;

import calculator.CalculatorOutput;
import calculator.CalculatorOutputList;
import calculator.ModuleLoop;

/**
 * starting-console to test Calculator 1
 * 
 * @author Daniel
 *
 */
public class KeggCalculatorConsole {

	public static void main(String[] args) throws IOException {
		ModuleLoop loop = new ModuleLoop();
		//add module file
		loop.addModuleFiles("src/main/resources/KEGG/modules");
		//set mpa file
		loop.setMpaFile("src/main/resources/KEGG/Calc_test1907.csv");
		//starts calculator
		loop.loopModules();

		// show results
		CalculatorOutputList calculatorOutputList = loop.getCalcOutputList();
		calculatorOutputList.writeCSV(new File("Output.csv"));
		for (CalculatorOutput calculatorOutput : calculatorOutputList.getCalcOutputList()) {
			int csvPatternInt = calculatorOutput.getModule().indexOf(".csv");
			System.out.println(calculatorOutput.getModule().substring(csvPatternInt-6, csvPatternInt));
			System.out.println(calculatorOutput.getStepMpa());
			System.out.println(calculatorOutput.getStepTotal());
			System.out.println(calculatorOutput.getQuantList());
		}
	}

}

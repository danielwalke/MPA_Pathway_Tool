package calculator;

import java.util.ArrayList;
/**
 * @return specific module-Id and list of steps 
 * @author Daniel
 *
 */
public class Module {
	private String id;
	private ArrayList<Steps> stepList;
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public ArrayList<Steps> getStepList() {
		return stepList;
	}
	public void setStepList(ArrayList<Steps> stepList) {
		this.stepList = stepList;
	}

}

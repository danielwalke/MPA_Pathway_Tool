package calculator;

import java.util.ArrayList;
/**
 * @return list of summed lists
 * @example: [[0,1,2,4],[2,3,2,3]] -> [2,4,4,7]
 * @author Daniel
 *
 */
public class ListSum {
	private ArrayList<ArrayList<Double>> numberNestedQuantList;
	private ArrayList<Double> listSumList = new ArrayList<Double>();
	private double[] quantArray;
	
	public double[] getQuantArray() {
		return quantArray;
	}

	public void setQuantArray(double[] quantArray) {
		this.quantArray = quantArray;
	}

	public ArrayList<ArrayList<Double>> getNumberNestedQuantList() {
		return numberNestedQuantList;
	}

	public void setNumberNestedQuantList(ArrayList<ArrayList<Double>> numberNestedQuantList) {
		this.numberNestedQuantList = numberNestedQuantList;
	}

	public void setListSumList(ArrayList<Double> listSumList) {
		this.listSumList = listSumList;
	}

	public ArrayList<Double> getListSumList() {
		double[] quantArray;
		for (ArrayList<Double> list : getNumberNestedQuantList()) {
			quantArray = new double[list.size()];
			setQuantArray(quantArray);
		}
		quantArray= getQuantArray();
		
		for (ArrayList<Double> list : getNumberNestedQuantList()) {
			for(int it=0; it<list.size(); it++) {
			quantArray[it] = quantArray[it] + list.get(it);
			setQuantArray(quantArray);
			}
		}
		try { //NullpointerException initialization in for-loop
		for(int it= 0; it<getQuantArray().length; it++) {
			listSumList.add(quantArray[it]);
		}
		}catch(Exception e) {			
		}
		setListSumList(listSumList);
		return listSumList;
	}

	

}

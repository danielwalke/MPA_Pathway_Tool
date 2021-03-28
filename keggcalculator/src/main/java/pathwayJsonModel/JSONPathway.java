package pathwayJsonModel;

import java.util.ArrayList;

public class JSONPathway {
	private final ArrayList<JSONReaction> reactions;
	
	public JSONPathway() {
		this.reactions = new ArrayList<>();
	}

	public ArrayList<JSONReaction> getReactions() {
		return reactions;
	}

	
}

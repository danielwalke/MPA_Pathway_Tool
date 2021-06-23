package fluxanalysis;

public class DummyFBAResultObj {
	private String reactionId;
	private double dummyFBAFlux;
	
	public DummyFBAResultObj(String reactionId, double dummyFBAFlux) {
		this.reactionId = reactionId;
		this.dummyFBAFlux = dummyFBAFlux;
	}
	
	public String getReactionId() {
		return this.reactionId;
	}
	
	public double getDummyFBAFlux() {
		return this.dummyFBAFlux;
	}
}

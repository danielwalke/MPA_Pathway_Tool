package fluxanalysis;

public class DummyFBAResponseObj {
	private String reactionId;
	private double fbaFlux;
	
	public DummyFBAResponseObj(String reactionId, double fbaFlux) {
		this.reactionId = reactionId;
		this.fbaFlux = fbaFlux;
	}
	
	public String getReactionId() {
		return this.reactionId;
	}
	
	public double getDummyFBAFlux() {
		return this.fbaFlux;
	}
}

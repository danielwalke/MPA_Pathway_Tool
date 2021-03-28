package pathwayJsonModel;

public class JSONCompound {
	private final String name;
	private final String abbreviation;
	private final String stochiometry;
	private final String x;
	private final String y;
	private final double opacity;
	
	public JSONCompound() {
		this.name = "";
		this.abbreviation = "";
		this.stochiometry = "";
		this.x = "";
		this.y = "";
		this.opacity = 0.0;
	}

	public String getName() {
		return name;
	}

	public String getAbbreviation() {
		return abbreviation;
	}

	public String getStochiometry() {
		return stochiometry;
	}

	public String getX() {
		return x;
	}

	public String getY() {
		return y;
	}

	public double getOpacity() {
		return opacity;
	}
	
}

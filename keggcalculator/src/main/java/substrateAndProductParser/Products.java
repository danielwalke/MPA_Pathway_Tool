package substrateAndProductParser;
/**
 * class for products
 * used for parsing of reaction equations
 * @author Daniel
 *
 */
public class Products {
	private final String productId;

	public Products(String productId) {
		this.productId = productId;
	}

	public String getProductId() {
		return productId;
	}

}

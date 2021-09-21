export class Reaction {
    _reactionName
    _opacity
    _x
    _y
    _abbreviation
    _substrates
    _products
    _reversible

    //added
    _linkedTo
    _ecList
    _koList
    _substrateObjects
    _productObjects
    _taxonomy

    constructor(name) {
        this._reactionName = name
        this._reversible = false
        this._products = []
        this._substrates = []
        this._linkedTo = []
        this._ecList = []
        this._koList = []
        this._substrateObjects = []
        this._productObjects = []
        this._taxonomy = {}
    }

    addProductObject(compound, coefficient) {
        const product = {
            compound: compound,
            coefficient: coefficient
        }
        this._productObjects.push(product)
    }

    addSubstrateObject(compound, coefficient) {
        const substrate = {
            compound: compound,
            coefficient: coefficient
        }
        this._substrateObjects.push(substrate)
    }

    get ecList() {
        return this._ecList;
    }

    set ecList(value) {
        this._ecList = value;
    }

    get koList() {
        return this._koList;
    }

    set koList(value) {
        this._koList = value;
    }

    addSubstrate = (substrate) => {
        this._substrates.push(substrate)
    }

    addProduct = (product) => {
        this._products.push(product)
    }

    addLinkToReaction = (nodeId) => {
        this._linkedTo.push(nodeId)
    }

    get linkedTo() {
        return this._linkedTo
    }

    /**
     *
     * @returns reactionName
     */
    get reactionName() {
        return this._reactionName;
    }

    get opacity() {
        return this._opacity;
    }

    /**
     * set opacity to class
     * @param opacity
     */
    set opacity(value) {
        this._opacity = value;
    }

    get x() {
        return this._x;
    }

    set x(value) {
        this._x = value;
    }

    get y() {
        return this._y;
    }

    set y(value) {
        this._y = value;
    }

    get abbreviation() {
        return this._abbreviation;
    }

    set abbreviation(value) {
        this._abbreviation = value;
    }

    get substrates() {
        return this._substrates;
    }

    set substrates(value) {
        this._substrates = value;
    }

    get products() {
        return this._products;
    }

    set products(value) {
        this._products = value;
    }

    get reversible() {
        return this._reversible;
    }

    set reversible(value) {
        this._reversible = value;
    }
}

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
    _biggId
    _lowerBound
    _upperBound
    _objectiveCoefficient
    _isForwardReaction
    _geneProteinRule

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
        this._biggId = ""
        this._lowerBound = 0.0
        this._upperBound = 1000.0
        this._objectiveCoefficient = 0.0
        this._geneProteinRule = []
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

    get biggId() {
        return this._biggId;
    }

    set biggId(value) {
        this._biggId = value;
    }

    get lowerBound() {
        return this._lowerBound;
    }

    set lowerBound(value) {
        this._lowerBound = value;
    }

    get upperBound() {
        return this._upperBound;
    }

    set upperBound(value) {
        this._upperBound = value;
    }

    get objectiveCoefficient() {
        return this._objectiveCoefficient;
    }

    set objectiveCoefficient(value) {
        this._objectiveCoefficient = value;
    }

    get isForwardReaction() {
        return this._isForwardReaction;
    }

    set isForwardReaction(value) {
        this._isForwardReaction = value;
    }

    get geneProteinRule() {
        return this._geneProteinRule;
    }

    set geneProteinRule(value) {
        this._geneProteinRule = value;
    }
}

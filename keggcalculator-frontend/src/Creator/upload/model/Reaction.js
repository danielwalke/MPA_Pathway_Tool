export class Reaction{
    _reactionName
    _opacity
    _x
    _y
    _abbreviation
    _substrates
    _products
    _reversible

    addSubstrate = (substrate) =>{
        this._substrates.push(substrate)
    }

    addProduct = (product) =>{
        this._products.push(product)
    }

    constructor(name) {
        this._reactionName = name
        this._products = []
        this._substrates = []
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
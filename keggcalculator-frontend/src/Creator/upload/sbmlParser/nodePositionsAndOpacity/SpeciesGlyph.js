class SpeciesGlyph {
    _layoutId
    _layoutSpecies
    _isKeyCompound
    _x
    _y

    constructor(layoutId, layoutSpecies) {
        this._isKeyCompound = true
        this._layoutSpecies = layoutSpecies;
        this._layoutId = layoutId;
        this._x = 0.0
        this._y = 0.0
    }

    get isKeyCompound() {
        return this._isKeyCompound
    }

    set isKeyCompound(isKeyCompound) {
        this._isKeyCompound = isKeyCompound
    }

    get layoutId() {
        return this._layoutId;
    }

    get layoutSpecies() {
        return this._layoutSpecies;
    }

    setCoordinates(x, y) {
        this._x = x
        this._y = y
    }

    getCoordinates() {
        return {x: this._x, y: this._y}
    }
}

export default SpeciesGlyph

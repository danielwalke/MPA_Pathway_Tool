class SpeciesGlyph {
    _layoutId
    _layoutSpecies
    _layoutSpeciesReference
    _isKeyCompound

    constructor(layoutId, layoutSpecies) {
        this._isKeyCompound = true
        this._layoutSpecies = layoutSpecies;
        this._layoutId = layoutId;
        this._layoutSpeciesReference = ""
    }


    get layoutSpeciesReference() {
        return this._layoutSpeciesReference;
    }

    set layoutSpeciesReference(value) {
        this._layoutSpeciesReference = value;
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
}

export default SpeciesGlyph

class SpeciesReferenceGlyph {
    #_layoutId
    #_layoutRole //typeOfCompound
    #_speciesGlyph

    constructor(layoutId, layOutRole) {
        this.#_layoutRole = layOutRole
        this.#_layoutId = layoutId;
        this.#_speciesGlyph = ""
    }

    get speciesGlyph() {
        return this.#_speciesGlyph;
    }

    set speciesGlyph(value) {
        this.#_speciesGlyph = value;
    }

    get layoutRole() {
        return this.#_layoutRole;
    }

    get layoutId() {
        return this.#_layoutId;
    }
}

export default SpeciesReferenceGlyph

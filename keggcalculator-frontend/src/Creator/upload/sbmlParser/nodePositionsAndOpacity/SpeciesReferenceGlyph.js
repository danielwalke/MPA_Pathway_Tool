class SpeciesReferenceGlyph {
    #_layoutId
    #_layoutSpeciesReference
    #_layoutRole //typeOfCompound
    #_speciesGlyph
    #_layOutStartX
    #_layOutStartY
    #_layOutEndX
    #_layOutEndY

    constructor(layoutId, layOutRole) {
        this.#_layoutRole = layOutRole
        this.#_layOutStartX = 0
        this.#_layOutStartY = 0
        this.#_layOutEndX = 0
        this.#_layOutEndY = 0
        this.#_layoutId = layoutId;
        this.#_speciesGlyph = ""
        this.#_layoutSpeciesReference = ""
    }

    get layoutSpeciesReference() {
        return this.#_layoutSpeciesReference;
    }

    set layoutSpeciesReference(value) {
        this.#_layoutSpeciesReference = value;
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

    get layOutStartX() {
        return this.#_layOutStartX;
    }

    set layOutStartX(value) {
        this.#_layOutStartX = value;
    }

    get layOutStartY() {
        return this.#_layOutStartY;
    }

    set layOutStartY(value) {
        this.#_layOutStartY = value;
    }

    get layOutEndX() {
        return this.#_layOutEndX;
    }

    set layOutEndX(value) {
        this.#_layOutEndX = value;
    }

    get layOutEndY() {
        return this.#_layOutEndY;
    }

    set layOutEndY(value) {
        this.#_layOutEndY = value;
    }
}

export default SpeciesReferenceGlyph

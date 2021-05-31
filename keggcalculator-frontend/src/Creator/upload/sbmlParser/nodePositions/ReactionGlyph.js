/**
 * responsible for storing node positions in sbml file
 */
class ReactionGlyph{
    #_layoutId
    #_layoutReaction //equals reactionId
    #_layoutX
    #_layoutY
    #_listOfSpeciesReferenceGlyphs

    constructor(layoutId, layoutReaction) {
        this.#_layoutX = 0
        this.#_layoutY = 0
        this.#_listOfSpeciesReferenceGlyphs = []
        this.#_layoutId = layoutId;
        this.#_layoutReaction = layoutReaction;
    }

    addSpeciesReferenceGlyph(speciesReferenceGlyph){
        this.#_listOfSpeciesReferenceGlyphs.push(speciesReferenceGlyph)
    }

    set layoutX(value) {
        this.#_layoutX = value;
    }

    set layoutY(value) {
        this.#_layoutY = value;
    }

    get layoutId() {
        return this.#_layoutId;
    }

    get layoutReaction() {
        return this.#_layoutReaction;
    }

    get layoutX() {
        return this.#_layoutX;
    }

    get layoutY() {
        return this.#_layoutY;
    }

    get listOfSpeciesReferenceGlyphs() {
        return this.#_listOfSpeciesReferenceGlyphs;
    }
}

export default ReactionGlyph
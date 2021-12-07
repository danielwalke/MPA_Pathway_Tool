import SpeciesGlyph from "./SpeciesGlyph";

/**
 * Iterates through list of species glyphs (graphical instances of compounds) and returns an array of species objects
 * containing glyphIds (used in reaction glyphs), species id and role (key compound or non-key compound)
 * @param sbml
 * @return {[SpeciesGlyph]} - array of species glyph objects
 */

export const readListOfSpeciesGlyphs = (sbml) => {
    const listOfSpeciesGlyphs = sbml.getElementsByTagName("layout:listOfSpeciesGlyphs")[0]
    const listOfSpeciesGlyphObjects = []

    for (const speciesGlyph of listOfSpeciesGlyphs.children) {
        const speciesGlyphObj = new SpeciesGlyph(getSpeciesGlyphId(speciesGlyph), getSpeciesGlyphSpecies(speciesGlyph))

        speciesGlyphObj.isKeyCompound = getSpeciesGlyphIsKeyCompound(speciesGlyph)

        const {x, y} = getSpeciesGlyphCoordinates(speciesGlyph)
        speciesGlyphObj.setCoordinates(x, y)

        listOfSpeciesGlyphObjects.push(speciesGlyphObj)
    }

    return listOfSpeciesGlyphObjects
}

const getSpeciesGlyphIsKeyCompound = (speciesGlyph) => speciesGlyph.attributes["render:objectRole"] === "keyCompound"
const getSpeciesGlyphId = (speciesGlyph) => speciesGlyph.attributes["layout:id"]
const getSpeciesGlyphSpecies = (speciesGlyph) => speciesGlyph.attributes["layout:species"]

const getSpeciesGlyphCoordinates = (speciesGlyph) => {
    const position = speciesGlyph.children[0].children.find(child => child.name === 'layout:position')
    const coordinates = position.attributes
    return {x: parseFloat(coordinates['layout:x']), y: parseFloat(coordinates['layout:y'])}
}

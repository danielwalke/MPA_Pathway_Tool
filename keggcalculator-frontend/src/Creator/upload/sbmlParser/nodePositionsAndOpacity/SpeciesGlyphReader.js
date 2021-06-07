import SpeciesGlyph from "./SpeciesGlyph";

export const readListOfSpeciesGlyphs = (sbml) =>{
    const listOfSpeciesGlyphsTag = sbml.getElementsByTagName("layout:listOfSpeciesGlyphs")[0]
    return getListOfSpeciesGlyph(listOfSpeciesGlyphsTag)
}

const getListOfSpeciesGlyph = listOfSpeciesGlyphsTag => listOfSpeciesGlyphsTag.children.map(speciesGlyphTag => getSpeciesGlyph(speciesGlyphTag))

const getSpeciesGlyph = (speciesGlyphTag) => {
    const speciesGlyph = new SpeciesGlyph(getSpeciesGlyphId(speciesGlyphTag), getSpeciesGlyphSpecies(speciesGlyphTag))
    speciesGlyph._layoutSpeciesReference = getSpeciesGlyphSpeciesReference(speciesGlyphTag)
    speciesGlyph.isKeyCompound = getSpeciesGlyphIsKeyCompound(speciesGlyphTag)
    return speciesGlyph
}
const getSpeciesGlyphSpeciesReference = (speciesGlyphTag) => speciesGlyphTag.attributes["layout:speciesReference"]
const getSpeciesGlyphIsKeyCompound = (speciesGlyphTag) => speciesGlyphTag.attributes["render:objectRole"] === "keyCompound"
const getSpeciesGlyphId = (speciesGlyphTag) => speciesGlyphTag.attributes["layout:id"]
const getSpeciesGlyphSpecies = (speciesGlyphTag) => speciesGlyphTag.attributes["layout:species"]

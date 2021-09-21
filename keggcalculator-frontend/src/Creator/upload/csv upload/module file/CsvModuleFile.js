import {getNLastChars} from "../../../usefulFunctions/Strings";

export const readFile = (string) => {
    const lines = string.split("\n")
    lines.shift() //skip header
    const reactions = []
    lines.forEach(line => {
        const entries = line.split(";")
        const reactionName = entries[1].replaceAll("\t", ";")
        const koNumbers = entries[2].includes(",") ? entries[2].split(",") : entries[2].length > 0 ? [entries[2]] : []
        const ecNumbers = entries[3].includes(",") ? entries[3].split(",") : entries[3].length > 0 ? [entries[3]] : []
        const stoichiometricCoeff = entries[4]
        const compoundId = entries[5].replaceAll("\t", ";")
        const typeOfCompound = entries[6]
        const reversibility = entries[7] === "reversible"
        const taxonomy = {}
        if (entries[8].includes("&&")) {
            const taxa = entries[8].split("&&")
            taxa.forEach(taxon => {
                const taxonEntries = taxon.split(":")
                taxonomy[taxonEntries[1]] = taxonEntries[0]
            })
        }
        if (!entries[8].includes("&&") && entries[8].includes(":")) {
            const taxEntries = entries[8].split(":")
            const rank = taxEntries[0]
            const name = taxEntries[1]
            taxonomy[name] = rank
        }
        const reactionX = entries[9]
        const reactionY = entries[10]
        const compoundX = entries[11]
        const compoundY = entries[12]
        const reactionAbbr = entries[13]
        const compoundAbbr = entries[14]
        const keyComp = entries[15]
        const reactionNames = reactions.map(reaction => reaction.reactionName)
        if (!reactionNames.includes(reactionName)) {
            const reaction = {
                reactionName: reactionName,
                opacity: 1,
                reactionId: getNLastChars(reactionName, 6),
                ecNumbersString: ecNumbers,
                koNumbersString: koNumbers,
                substrates: [],
                products: [],
                stochiometrySubstratesString: {},
                stochiometryProductsString: {},
                x: +reactionX,
                y: +reactionY,
                taxa: taxonomy,
                abbreviation: reactionAbbr,
                isForwardReaction: true,
                reversible: reversibility
            }
            reactions.push(reaction)
        }
        const reaction = reactions.find(reaction => reaction.reactionName === reactionName)
        const compound = {
            abbreviation: compoundAbbr,
            name: compoundId,
            opacity: keyComp === "true" ? 1 : 0.4,
            stochiometry: stoichiometricCoeff,
            x: compoundX,
            y: compoundY,
        }
        if (typeOfCompound === "substrate") {
            reaction.substrates.push(compound)
            reaction.stochiometrySubstratesString[getNLastChars(compoundId, 6)] = stoichiometricCoeff
        } else {
            reaction.products.push(compound)
            reaction.stochiometryProductsString[getNLastChars(compoundId, 6)] = stoichiometricCoeff
        }

    })
    return reactions
}


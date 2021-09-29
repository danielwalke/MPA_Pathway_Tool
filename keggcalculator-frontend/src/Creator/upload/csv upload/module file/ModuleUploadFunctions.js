import {handleJSONGraphUpload} from "../../json upload/ModuleUploadFunctionsJSON";
import {CsvColumns} from "./CsvFile";
import {getReaction} from "./CsvFile"

export const handleGraphUpload = (rows, dispatch, graphState) => {
    let reactions = []
    rows.forEach(row=>{
        const columns = new CsvColumns(row)
        const reaction = getReaction(reactions, columns)
        const compound = columns.getCompound()
        addCompound(reaction, compound)
        addReactionToReactions(reactions, reaction)
    })
    return (handleJSONGraphUpload(reactions, dispatch, graphState))
}

const addCompound = (reaction, compound) =>{
    const typeOfCompound = compound.typeOfCompound
    if(compound.name.length !== 0){
        typeOfCompound==="substrate"?  reaction.addSubstrate(compound) : reaction.addProduct(compound)
    }
}

const addReactionToReactions = (reactions, reaction) =>{
    reactions.push(reaction)
}

export const handleReactionListUpload = (rows) => {
    const reactionList = []
    let substrateMap = {}
    let productMap = {}
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
        const columns = rows[rowIndex].split(";")
        const reactionName = columns[1].replaceAll("\t", ";")
        const reactionId = reactionName.substring(reactionName.length - 6, reactionName.length)
        let koNumberList = []
        let ecNumberList = []
        let taxonomyList = []
        const koNumbersString = columns[2]
        if (koNumbersString.length > 0) {
            if (koNumbersString.includes(",")) {
                const koNumbers = koNumbersString.split(",")
                koNumberList = koNumbers.map(koNumber => koNumber)
            } else {
                koNumberList = [koNumbersString]
            }
        }
        const ecNumbersString = columns[3]
        if (ecNumbersString.length > 0) {
            if (ecNumbersString.includes(",")) {
                const ecNumbers = ecNumbersString.split(",")
                ecNumberList = ecNumbers.map(ecNumber => ecNumber)
            } else {
                ecNumberList = [ecNumbersString]
            }
        }
        const taxonomiesString = columns[8]
        const taxa = {}
        if (taxonomiesString.includes("&&")) { //if more than one taxonomy added -> split them
            const taxonomies = taxonomiesString.split("&&")
            if (taxonomies.length > 1) {
                for (const taxonomy of taxonomies) {
                    const taxonomyEntries = taxonomy.split(":")
                    const taxonomicRank = taxonomyEntries[0]
                    const taxon = taxonomyEntries[1]
                    taxa[`${taxon}`] = taxonomicRank
                }
            }

        } else {
            if (taxonomiesString.length > 1) {
                const taxonomyEntries = taxonomiesString.split(":")
                const taxonomicRank = taxonomyEntries[0]
                const taxon = taxonomyEntries[1]
                taxa[`${taxon}`] = taxonomicRank
            }
        }

        const compoundName = columns[5].replaceAll("\t", ";")
        const compoundId = compoundName.substring(compoundName.length - 6, compoundName.length)
        const typeOfCompound = columns[6]
        if (typeOfCompound === "substrate") {
            substrateMap[`${compoundId}`] = columns[4]
        } else {
            productMap[`${compoundId}`] = columns[4]
        }
        const reaction = {
            reactionId: reactionId,
            reactionName: reactionName,
            koNumbersString: koNumberList,
            ecNumbersString: ecNumberList,
            stochiometrySubstratesString: substrateMap,
            stochiometryProductsString: productMap,
            // taxonomies: taxonomyList,
            taxa: taxa,
            reversible: columns[7] === "reversible",
            isForwardReaction: true
        }
        const nextColumns = rowIndex < rows.length - 1 ? rows[rowIndex + 1].split(";") : [rowIndex + 1]
        if (+columns[0] !== +nextColumns[0]) {
            reactionList.push(reaction)
            substrateMap = {}
            productMap = {}
        }

    }
    return reactionList
}
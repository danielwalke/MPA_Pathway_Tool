import {handleJSONGraphUpload} from "../../json upload/ModuleUploadFunctionsJSON";
import {CsvColumns, getReaction} from "./CsvFile";
import {getNLastChars} from "../../../usefulFunctions/Strings";
import {createReactionObject} from "../../sbmlParser/SbmlReader/ReaderFunctions";

export const handleGraphUpload = (rows, dispatch, graphState) => {
    let reactions = []
    rows.forEach(row => {
        const columns = new CsvColumns(row)
        const reaction = getReaction(reactions, columns)
        const compound = columns.getCompound()
        addCompound(reaction, compound)
        addReactionToReactions(reactions, reaction)
    })
    const newReactions = convertReactionsToObjects(reactions)
    dispatch({type: "ADDREACTIONSTOARRAY", payload: newReactions})
    return (handleJSONGraphUpload(newReactions, dispatch, graphState))
}

const convertReactionsToObjects = (reactions) => {
    // try {
        const newReactions = []
        reactions.forEach(reaction => {
            const newReaction = {
                reactionId: getNLastChars(reaction._reactionName, 6),
                reactionName: reaction._reactionName,
                ecNumbersString: reaction._ecList,
                isForwardReaction: true,
                koNumbersString: reaction._koList,
                opacity: 1,
                products: reaction._products.map(product => ({
                    abbreviation: product._abbreviation,
                    name: product.name,
                    opacity: product._opacity,
                    stochiometry: product._stoichiometry,
                    x: product._x,
                    y: product._y,
                })),
                reversible: reaction._reversible,
                stochiometrySubstratesString: {},
                stochiometryProductsString: {},
                substrates: reaction._substrates.map(substrate => ({
                    abbreviation: substrate._abbreviation,
                    name: substrate.name,
                    opacity: substrate._opacity,
                    stochiometry: substrate._stoichiometry,
                    x: substrate._x,
                    y: substrate._y,
                })),
                taxa: reaction._taxonomy,
                x: reaction._x,
                y: reaction._y,
            }
            newReactions.push(newReaction)
        })
        return newReactions
    // } catch (e) {
    //     console.error(e)
    // }
}

const addCompound = (reaction, compound) => {
    const typeOfCompound = compound.typeOfCompound
    if (compound.name.length !== 0) {
        typeOfCompound === "substrate" ? reaction.addSubstrate(compound) : reaction.addProduct(compound)
    }
}

const addReactionToReactions = (reactions, reaction) => {
    reactions.push(reaction)
}

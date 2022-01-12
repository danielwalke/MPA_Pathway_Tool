import {createReactionObject, createSpeciesObject} from "../sbmlParser/SbmlReader/ReaderFunctions";
import {getKeggId} from "../../../Flux Analysis/services/CreateFbaGraphData";

export async function convertReactionArray(reactionArray, dispatch) {

    const listOfReactions = []

    const speciesMap = new Map()
    let listOfSpecies = []

    await reactionArray.forEach((reaction, index) => {

        [...reaction.substrates, ...reaction.products].forEach((compound) => {
            const keggId = getKeggId(compound.name)
            const speciesObject = createSpeciesObject(
                "",
                compound.name,
                keggId,
                compound.biggId ? compound.biggId : "",
                compound.compartment ? compound.compartment : "cytosol",
                undefined,
                compound.x,
                compound.y,
                compound.opacity,
                compound.abbreviation
            )

            speciesMap.set(compound.name, speciesObject)
        })

        listOfReactions.push(createReactionObject(
            "",
            reaction.reactionName,
            reaction.reactionId,
            reaction.ecNumbersString,
            reaction.koNumbersString,
            reaction.substrates,
            reaction.products,
            reaction.reversible,
            reaction.taxa,
            reaction.biggId ? reaction.biggId : "",
            reaction.upperBound ?
                reaction.upperBound : 1000.0,
            reaction.lowerBound ?
                reaction.lowerBound : reaction.reversible ?
                    -1000.0 : 0.0,
            reaction.objectiveCoefficient ? reaction.objectiveCoefficient : 0.0,
            reaction.exchangeReaction ? reaction.exchangeReaction : false,
            index,
            reaction.opacity,
            reaction.x,
            reaction.y,
            reaction.isForwardReaction,
            reaction.abbreviation
        ))
    })

    let valueIndex = 0
    for (const compound of speciesMap.values()) {
        compound.index = valueIndex
        listOfSpecies.push(compound)
        valueIndex ++
    }

    await dispatch({type: "SETLISTOFSPECIES", payload: listOfSpecies})
    await dispatch({type: "SETLISTOFREACTIONS", payload: listOfReactions})
    dispatch({type:"SETREACTIONSINARRAY", payload: []})

}

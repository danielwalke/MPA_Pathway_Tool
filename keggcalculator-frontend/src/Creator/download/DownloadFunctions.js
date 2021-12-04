import {getNodePosition} from "./NodePosition";
import clonedeep from "lodash/cloneDeep"
import {getTaxaList} from "../graph/double click node/StuctureModalBody";

const readNodeInformation = (reactionObjects, reactionNames, reactionName, compoundName, graphState) => {
    if (!reactionNames.includes(reactionName)) {
        reactionNames.push(reactionName)
    }
    if (!reactionObjects[`${reactionName}`]) {
        reactionObjects[`${reactionName}`] = {}
        reactionObjects[`${reactionName}`].products = []
        reactionObjects[`${reactionName}`].substrates = []
    }
    const compound = {}
    compound.x = getNodePosition(compoundName).x
    compound.y = getNodePosition(compoundName).y
    compound.name = compoundName

    const nodeOpacity = clonedeep(graphState.data.nodes).filter(node => node.id === compoundName)[0].opacity
    const nodeAbbreviation = clonedeep(graphState.abbreviationsObject[compoundName])

    compound.opacity = nodeOpacity ? nodeOpacity : 1
    compound.abbreviation = nodeAbbreviation ? nodeAbbreviation : compoundName

    return compound
}

export const getReactions = (graphState) => {
    const reactionObjects = {}
    const reactionNames = []
    const links = clonedeep(graphState.data.links.filter(link => !link.isReversibleLink))

    links.map(link => {
        if (link.source.match(/\s[R,U][0-9][0-9][0-9][0-9][0-9]/) !== null) {
            const reactionName = link.source
            const productName = link.target
            const product = readNodeInformation(reactionObjects, reactionNames, reactionName, productName, graphState)

            reactionObjects[`${reactionName}`].products.push(product)

        } else {
            const reactionName = link.target
            const substrateName = link.source
            const substrate = readNodeInformation(reactionObjects, reactionNames, reactionName, substrateName, graphState)

            reactionObjects[`${reactionName}`].substrates.push(substrate)
        }
        return null;
    })

    if (graphState.data.links.length === 0) {
        graphState.data.nodes.map(specialProtein => reactionNames.push(specialProtein.id))
    }

    return {reactionObjects, reactionNames}
}

export const addOutput = (output, reaction, compound, reactionCounter, compoundType, reversible) => {

    const reactionBiggId = reaction.biggId ? reaction.biggId : ""
    const compoundBiggId = compound.biggId ? compound.biggId : ""

    output = output.concat(reactionCounter.toString(), ";") //step id
    output = output.concat(reaction.reactionName.replaceAll(";", "\t"), ";") //reaction name
    output = output.concat(reaction.koNumbersString, ";") //ko number ids
    output = output.concat(reaction.ecNumbersString, ";") //ec number ids
    output = output.concat(compound.stoichiometry, ";") //stochiometric coeff
    output = output.concat(compound.name.replaceAll(";", "\t"), ";") //compound id
    output = output.concat(compoundType, ";") //type of compound
    output = output.concat(reversible, ";") //reversibility
    let taxonomyCounter = 0
    if (getTaxaList(reaction.taxa).length === 0) {
        output = output.concat(";")
    }
    for (const taxonomy of getTaxaList(reaction.taxa)) {
        taxonomyCounter < getTaxaList(reaction.taxa).length - 1 ? output = output.concat(taxonomy, "&&") : output = output.concat(taxonomy, ";") //taxonomy
        taxonomyCounter++
    }
    output = output.concat(reaction.x.toString(), ";") //reactionX
    output = output.concat(reaction.y.toString(), ";") //reactionY
    output = output.concat(compound.x.toString(), ";") //compound X
    output = output.concat(compound.y.toString(), ";") //compound Y
    output = output.concat(reaction.abbreviation.replaceAll(";", "\t"), ";") //reaction abbreviation
    output = output.concat(compound.abbreviation.replaceAll(";", "\t"), ";") //compound abbreviation
    const keyCompound = compound.opacity === 1
    output = output.concat(keyCompound.toString(), ";") //key compound
    output = output.concat(compoundBiggId, ";")
    output = output.concat(reactionBiggId, ";")
    console.log(compound)
    output = output.concat(compound.compartment ? compound.compartment : "cytosol", ";")
    output = output.concat(reaction.lowerBound ? reaction.lowerBound : "-1000.0", ";")
    output = output.concat(reaction.upperBound ? reaction.upperBound : "1000.0", ";")
    output = output.concat(reaction.objectiveCoefficient ? reaction.objectiveCoefficient : "0.0", ";")
    output = output.concat(reaction.exchangeReaction ? reaction.exchangeReaction : "false", ";")
    output = output.concat("\n") //next compound
    return output;
}

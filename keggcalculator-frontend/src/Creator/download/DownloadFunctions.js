import {getNodePosition} from "./NodePosition";
import clonedeep from "lodash/cloneDeep"
import {getTaxaList} from "../graph/StuctureModalBody";

export const getReactions = (graphState) =>{
    const reactionObjects = {}
    const reactionNames = []
    const links = clonedeep(graphState.data.links)
    links.map(link => {
        if (link.source.match(/\s[R,U][0-9][0-9][0-9][0-9][0-9]/) !== null) {
            const reactionName = link.source
            const productName = link.target
            if (!reactionNames.includes(reactionName)) {
                reactionNames.push(reactionName)
            }
            if (typeof reactionObjects[`${reactionName}`] === "undefined") {
                reactionObjects[`${reactionName}`] = {}
                reactionObjects[`${reactionName}`].products = []
                reactionObjects[`${reactionName}`].substrates = []
            }
            const product = {}
            product.x = getNodePosition(productName).x
            product.y = getNodePosition(productName).y
            product.name = productName
            product.opacity = typeof clonedeep(graphState.data.nodes).filter(node => node.id === productName)[0].opacity === "undefined"? 1: clonedeep(graphState.data.nodes).filter(node => node.id === productName)[0].opacity
            product.abbreviation = typeof clonedeep(graphState.abbreviationsObject[productName]) === "undefined" ? productName : clonedeep(graphState.abbreviationsObject[productName])
            reactionObjects[`${reactionName}`].products.push(product)

        } else {
            const reactionName = link.target
            const substrateName = link.source
            if (!reactionNames.includes(reactionName)) {
                reactionNames.push(reactionName)
            }
            if (typeof reactionObjects[`${reactionName}`] === "undefined") {
                reactionObjects[`${reactionName}`] = {}
                reactionObjects[`${reactionName}`].products = []
                reactionObjects[`${reactionName}`].substrates = []
            }
            const substrate = {}
            substrate.x = getNodePosition(substrateName).x
            substrate.y = getNodePosition(substrateName).y
            substrate.name = substrateName
            substrate.opacity = typeof clonedeep(graphState.data.nodes.filter(node => node.id === substrateName)[0].opacity) === "undefined"? 1 : clonedeep(graphState.data.nodes.filter(node => node.id === substrateName)[0].opacity)
            substrate.abbreviation = typeof clonedeep(graphState.abbreviationsObject[substrateName]) === "undefined" ? substrateName : clonedeep(graphState.abbreviationsObject[substrateName])
            reactionObjects[`${reactionName}`].substrates.push(substrate)
        }
        return null;
    })
    if(graphState.data.links.length === 0){
        graphState.data.nodes.map(specialProtein => reactionNames.push(specialProtein.id))
    }
    console.log(reactionObjects)
    return {reactionObjects, reactionNames}
}

export const addOutput = (output, reaction, compound,reactionCounter, compoundType) => {
    output = output.concat(reactionCounter.toString(), ";") //step id
    output = output.concat(reaction.reactionName.replaceAll(";", "\t"), ";") //reaction name
    output = output.concat(reaction.koNumbersString, ";") //ko number ids
    output = output.concat(reaction.ecNumbersString, ";") //ec number ids
    output = output.concat(compound.stochiometry, ";") //stochiometric coeff
    output = output.concat(compound.name.replaceAll(";", "\t"), ";") //compound id
    output = output.concat(compoundType, ";") //type of compound
    output = output.concat("reversible", ";") //reversibility
    let taxonomyCounter = 0
    if(getTaxaList(reaction.taxa).length === 0){
        output = output.concat(";")
    }
    for(const taxonomy of getTaxaList(reaction.taxa)){
        taxonomyCounter<getTaxaList(reaction.taxa).length-1? output = output.concat(taxonomy, "&&") : output = output.concat(taxonomy, ";") //taxonomy
        taxonomyCounter++
    }
    output = output.concat(reaction.x.toString(), ";") //reactionX
    output = output.concat(reaction.y.toString(), ";") //reactionY
    output = output.concat(compound.x.toString(), ";") //compound X
    output = output.concat(compound.y.toString(), ";") //compound Y
    output = output.concat(reaction.abbreviation.replaceAll(";", "\t"), ";") //reaction abbreviation
    output = output.concat(compound.abbreviation.replaceAll(";", "\t"), ";") //compound abbreviation
    const keyCompound = compound.opacity === 1
    output = output.concat(keyCompound.toString()) //key compound
    output = output.concat("\n") //next compound
    return output;
}


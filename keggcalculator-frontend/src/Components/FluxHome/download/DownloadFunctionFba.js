import {getNodePosition} from "../../../Creator/download/NodePosition";
import clonedeep from "lodash/cloneDeep"
import {getTaxaList} from "../../../Creator/graph/double click node/StuctureModalBody";
import {getNLastChars} from "../../../Creator/usefulFunctions/Strings";




export const getReactions = (generalState, graphState) =>{
    const reactionObjects = {}
    const reactionNames = []
    const links = clonedeep(generalState.new_data_gen.links.filter(link => !link.isReversibleLink))
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
            product.opacity = typeof clonedeep(generalState.new_data_gen.nodes).filter(node => node.id === productName)[0].opacity === "undefined"? 1: clonedeep(generalState.new_data_gen.nodes).filter(node => node.id === productName)[0].opacity
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
            substrate.opacity = typeof clonedeep(generalState.new_data_gen.nodes.filter(node => node.id === substrateName)[0].opacity) === "undefined"? 1 : clonedeep(generalState.new_data_gen.nodes.filter(node => node.id === substrateName)[0].opacity)
            substrate.abbreviation = typeof clonedeep(graphState.abbreviationsObject[substrateName]) === "undefined" ? substrateName : clonedeep(graphState.abbreviationsObject[substrateName])
            reactionObjects[`${reactionName}`].substrates.push(substrate)
        }
        return null;
    })
    if(generalState.new_data_gen.links.length === 0){
        graphState.new_data_gen.nodes.map(specialProtein => reactionNames.push(specialProtein.id))
    }
    return {reactionObjects, reactionNames}
}

export const addOutput = (output, reaction, compound,reactionCounter, compoundType, reversible, generalState) => {
    //output = output.concat(reactionCounter.toString(), ";") //step id
    output = output.concat(reaction.reactionName.replaceAll(";", "\t"), ";") //reaction name
    //output = output.concat(reaction.koNumbersString, ";") //ko number ids
    //output = output.concat(reaction.ecNumbersString, ";") //ec number ids
    //output = output.concat(compound.stochiometry, ";") //stochiometric coeff
    //output = output.concat(compound.name.replaceAll(";", "\t"), ";") //compound id
    //output = output.concat(compoundType, ";") //type of compound
    //output = output.concat(reversible, ";") //reversibility
    let taxonomyCounter = 0
    if(getTaxaList(reaction.taxa).length === 0){
        //output = output.concat(";")
    }
    for(const taxonomy of getTaxaList(reaction.taxa)){
        //taxonomyCounter<getTaxaList(reaction.taxa).length-1? output = output.concat(taxonomy, "&&") : output = output.concat(taxonomy, ";") //taxonomy
        taxonomyCounter++
    }
    var flux = 0.0;
    var minFlux = 0.0;
    var maxFlux = 0.0

    for(var key in generalState.fbaSolution){
        if(generalState.fbaSolution.hasOwnProperty(key)){
            if(key == reaction.reactionId){
                flux = generalState.fbaSolution[key].fbaSolution;
                minFlux = generalState.fbaSolution[key].minFlux;
                maxFlux = generalState.fbaSolution[key].maxFlux;

            }
        }
    }
    console.log(flux)


    //output = output.concat(reaction.x.toString(), ";") //reactionX
    //output = output.concat(reaction.y.toString(), ";") //reactionY
    //output = output.concat(compound.x.toString(), ";") //compound X
    //output = output.concat(compound.y.toString(), ";") //compound Y
    //output = output.concat(reaction.abbreviation.replaceAll(";", "\t"), ";") //reaction abbreviation
    //output = output.concat(compound.abbreviation.replaceAll(";", "\t"), ";") //compound abbreviation
    const keyCompound = compound.opacity === 1
    //output = output.concat(keyCompound.toString() + ";") //key compound

    output = output.concat(minFlux + ';')
    output = output.concat(maxFlux + ';')
    output = output.concat(flux + ';')
    return output;
}

export const addLocationInformation = (output, generalState, reaction, substrate) => {
    const compoundLocation = generalState.cystolInformation.filter(compound =>{
        return  compound.compoundId && compound.compoundId === getNLastChars(substrate.name, 6)
    })
    const exchangeReaction = generalState.exchangeReaction.filter(r => {
        return r.reactionId && r.reactionId === getNLastChars(reaction.reactionName, 6)
    })
    // console.log(reaction.reactionName)
    // console.log(reaction.reactionId)


    // const flux = generalState.fbaSolution.filter(r =>{
    //     if(generalState.fbaSolution.hasOwnProperty(r)){
    //         if(r == reaction.reactionId){
    //             return generalState.fbaSolution[r].fbaSolution
    //         }
    //     }
    // })



    //console.log(generalState.fbaSolution[reaction.reactionId]);
    //console.log(exchangeReaction)
    const reactionExchange = `${exchangeReaction.length>0? exchangeReaction[0].exchangeInfo? "true": "false" : "truefalse"};`
    //console.log(reactionExchange)
    //output = output.concat(reactionExchange)
    //output = output.concat(`${compoundLocation.length>0? compoundLocation[0].compartment : "external"}`)

    output = output.concat("\n") //next compound
    //console.log(output)
    return output;
}

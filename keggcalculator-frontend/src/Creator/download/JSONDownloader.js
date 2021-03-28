import React from "react";
import {useSelector} from "react-redux";
import {getReactions} from "./DownloadFunctions";
import {getNodePosition} from "./NodePosition";
import {saveAs} from "file-saver";
import clonedeep from "lodash/cloneDeep"

const JSONDownloader = () => {
    const generalState = clonedeep(useSelector(state => state.general))
    const graphState = clonedeep(useSelector(state => state.graph))
    const handleJsonDownload = () => {
        const {reactionObjects, reactionNames} = getReactions(graphState)

        const reactions = reactionNames.map(name => generalState.reactionsInSelectArray.filter(reaction => reaction.reactionName === name)[0])
        reactions.map(reaction => {
            reaction.abbreviation = typeof graphState.abbreviationsObject[`${reaction.reactionName}`] === "undefined" ? reaction.reactionName : graphState.abbreviationsObject[`${reaction.reactionName}`]
            reaction.opacity = graphState.data.nodes.filter(node => node.id = reaction.reactionName)[0].opacity
            reaction.reversible = "reversible"
            reaction.x = getNodePosition(reaction.reactionName).x
            reaction.y = getNodePosition(reaction.reactionName).y
            if (reaction.isForwardReaction) {
                reaction.substrates = reactionObjects[`${reaction.reactionName}`].substrates.map(substrate =>{
                    const substrateId = substrate.name.substring(substrate.name.length-6, substrate.name.length)
                    substrate.stochiometry = reaction.stochiometrySubstratesString[`${substrateId}`]
                    return substrate
                })
                reaction.products = reactionObjects[`${reaction.reactionName}`].products.map(product =>{
                    const productId = product.name.substring(product.name.length-6, product.name.length)
                    product.stochiometry = reaction.stochiometryProductsString[`${productId}`]
                    return product
                })
            } else {
                reaction.substrates = reactionObjects[`${reaction.reactionName}`].substrates.map(substrate =>{
                    const substrateId = substrate.name.substring(substrate.name.length-6, substrate.name.length)
                    substrate.stochiometry = reaction.stochiometryProductsString[`${substrateId}`]
                    return substrate
                })
                reaction.products = reactionObjects[`${reaction.reactionName}`].products.map(product =>{
                    console.log(product.stochiometry)
                    const productId = product.name.substring(product.name.length-6, product.name.length)
                    product.stochiometry = reaction.stochiometrySubstratesString[`${productId}`]
                    return product
                })
            }
            // reaction["opacity"] = 1
            return reaction
        })
        let blob = new Blob(new Array(JSON.stringify(reactions, null, 2)), {type: "text/plain;charset=utf-8"});
        saveAs(blob, "ModuleGraph.json")
        console.log(reactions)
        return console.log("download json")
    }
    return (
        <div>
            <button className={"downloadButton"} onClick={handleJsonDownload}>Download Json</button>
        </div>
    )
}

export default JSONDownloader
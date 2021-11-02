import React from "react";
import {useDispatch} from "react-redux";
import {getReactions} from "../DownloadFunctions";
import {getNodePosition} from "../NodePosition";
import {saveAs} from "file-saver";
import clonedeep from "lodash/cloneDeep"
import {ToolTipBig} from "../../main/user-interface/UserInterface";

const getCompoundBiggId = (compoundObjectArray, reactionObjectsCompoundName) => {

    const compoundObject = compoundObjectArray.find(comp => comp.name === reactionObjectsCompoundName)

    if (compoundObject.biggId) {
        return compoundObject.biggId
    }

    return ""
}

const JSONDownloader = (props) => {

    const dispatch = useDispatch()
    const handleJsonDownload = () => {

        try {
            const {generalState, graphState} = clonedeep(props)
            const {reactionObjects, reactionNames} = getReactions(graphState)

            // TODO: couldn't we simply export reactionsInSelectArray?

            const reactions = reactionNames.map(name => generalState.reactionsInSelectArray.filter(reaction => reaction.reactionName === name)[0])
            reactions.map(reaction => {
                reaction.abbreviation = typeof graphState.abbreviationsObject[`${reaction.reactionName}`] === "undefined" ? reaction.reactionName : graphState.abbreviationsObject[`${reaction.reactionName}`]
                reaction.opacity = graphState.data.nodes.filter(node => node.id === reaction.reactionName)[0].opacity
                const reversible = graphState.data.nodes.filter(node => node.id === reaction.reactionName)[0].reversible
                reaction.reversible = reversible
                reaction.x = getNodePosition(reaction.reactionName).x
                reaction.y = getNodePosition(reaction.reactionName).y

                if (graphState.data.links.length === 0) { //transport proteins only
                    reaction.substrates = []
                    reaction.products = []
                } else {
                    if (reaction.isForwardReaction) {
                        reaction.substrates = reactionObjects[`${reaction.reactionName}`].substrates.map(substrate => {
                            const substrateId = substrate.name.substring(substrate.name.length - 6, substrate.name.length)
                            substrate.stochiometry = reaction.stochiometrySubstratesString instanceof Map ? reaction.stochiometrySubstratesString.get(substrateId) :
                                reaction.stochiometrySubstratesString[substrateId]

                            substrate.biggId = getCompoundBiggId(reaction.substrates, substrate.name)

                            return substrate
                        })
                        reaction.products = reactionObjects[`${reaction.reactionName}`].products.map(product => {
                            const productId = product.name.substring(product.name.length - 6, product.name.length)
                            product.stochiometry = reaction.stochiometryProductsString instanceof Map ? reaction.stochiometryProductsString.get(productId) :
                                reaction.stochiometryProductsString[productId]

                                product.biggId = getCompoundBiggId(reaction.products, product.name)

                            return product
                        })
                    } else {
                        reaction.substrates = reactionObjects[`${reaction.reactionName}`].substrates.map(substrate => {
                            const substrateId = substrate.name.substring(substrate.name.length - 6, substrate.name.length)
                            substrate.stochiometry = reaction.stochiometryProductsString instanceof Map ? reaction.stochiometryProductsString.get(substrateId) :
                                reaction.stochiometryProductsString[substrateId]

                                substrate.biggId = getCompoundBiggId(reaction.substrates, substrate.name)

                            return substrate
                        })
                        reaction.products = reactionObjects[`${reaction.reactionName}`].products.map(product => {
                            const productId = product.name.substring(product.name.length - 6, product.name.length)
                            product.stochiometry = reaction.stochiometrySubstratesString instanceof Map ? reaction.stochiometrySubstratesString.get(productId) :
                                reaction.stochiometrySubstratesString[productId]

                                product.biggId = getCompoundBiggId(reaction.products, product.name)

                            return product
                        })
                    }
                }
                // reaction["opacity"] = 1
                console.log(reaction)
                return reaction
            })
            let blob = new Blob(new Array(JSON.stringify(reactions, null, 2)), {type: "text/plain;charset=utf-8"});
            saveAs(blob, "ModuleGraph.json")
            dispatch({type: "ADD_JSON_DOWNLOAD_TO_AUDIT_TRAIL"})
            console.log(reactions)
        } catch (e) {
            console.log(e)
            window.alert("make a change")
        }

        return console.log("download json")
    }

    return (
        <div>
            <ToolTipBig title={" downloading the pathway as JSON"} placement={"right"}>
                <button disabled={!props.graphState.data.nodes.length > 0} className={"download-button"}
                        onClick={handleJsonDownload}>Download Json
                </button>
            </ToolTipBig>
        </div>
    )
}

export default JSONDownloader

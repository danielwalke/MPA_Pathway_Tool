import React from "react";
import {saveAs} from "file-saver";
import {useDispatch} from "react-redux";
import {getNodePosition} from "../NodePosition";
import {addOutput, getReactions} from "../DownloadFunctions";
import clonedeep from "lodash/cloneDeep";
import {ToolTipBig} from "../../main/user-interface/UserInterface";

export const createCsvBlob = (generalState, graphState) => {
    const {reactionObjects, reactionNames} = getReactions(graphState)
    const reactions = reactionNames.map(name => generalState.reactionsInSelectArray.filter(reaction => reaction.reactionName === name)[0])
    reactions.map(reaction => {
        reaction.abbreviation = typeof graphState.abbreviationsObject[`${reaction.reactionName}`] === "undefined" ? reaction.reactionName : graphState.abbreviationsObject[`${reaction.reactionName}`]
        reaction.opacity = graphState.data.nodes.filter(node => node.id === reaction.reactionName)[0].opacity
        const reversible = graphState.data.nodes.filter(node => node.id === reaction.reactionName)[0].reversible
        reaction.reversible = reversible ? "reversible" : "irreversible"
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
                    return substrate
                })
                reaction.products = reactionObjects[`${reaction.reactionName}`].products.map(product => {
                    const productId = product.name.substring(product.name.length - 6, product.name.length)
                    product.stochiometry = reaction.stochiometryProductsString instanceof Map ? reaction.stochiometryProductsString.get(productId) :
                        reaction.stochiometryProductsString[productId]
                    return product
                })
            } else {
                reaction.substrates = reactionObjects[`${reaction.reactionName}`].substrates.map(substrate => {
                    const substrateId = substrate.name.substring(substrate.name.length - 6, substrate.name.length)
                    substrate.stochiometry = reaction.stochiometryProductsString instanceof Map ? reaction.stochiometryProductsString.get(substrateId) :
                        reaction.stochiometryProductsString[substrateId]
                    return substrate
                })
                reaction.products = reactionObjects[`${reaction.reactionName}`].products.map(product => {
                    const productId = product.name.substring(product.name.length - 6, product.name.length)
                    product.stochiometry = reaction.stochiometrySubstratesString instanceof Map ? reaction.stochiometrySubstratesString.get(productId) :
                        reaction.stochiometrySubstratesString[productId]
                    return product
                })
            }
        }
        // reaction["opacity"] = 1
        // let output = outputCsv.concat("stepId;ReactionNumberId;koNumberIds;ecNumberIds;stochCoeff;compoundId;typeOfCompound;reversibility;taxonomy;reactionX;reactionY;CompoundX;CompoundY;reactionAbbr;compoundAbbr;keyComp", "\n")
        return reaction
    })
    let output = "stepId;ReactionNumberId;koNumberIds;ecNumberIds;stochCoeff;compoundId;typeOfCompound;reversibility;taxonomy;reactionX;reactionY;CompoundX;CompoundY;reactionAbbr;compoundAbbr;keyComp\n"
    let reactionCounter = 0
    const compoundTypeSubstrate = "substrate"
    const compoundTypeProduct = "product"
    for (const reaction of reactions) {
        for (const substrate of reaction.substrates) {
            // console.log(substrate.stochiometry)
            output = addOutput(output, reaction, substrate, reactionCounter, compoundTypeSubstrate, reaction.reversible)
        }
        for (const product of reaction.products) {
            output = addOutput(output, reaction, product, reactionCounter, compoundTypeProduct, reaction.reversible)
        }
        if (reaction.substrates.length === 0 && reaction.products.length === 0) {
            output = addOutput(output, reaction, {
                stochiometry: "",
                name: "",
                x: "",
                y: "",
                opacity: "",
                abbreviation: ""
            }, reactionCounter, "")
        }
        reactionCounter++;
    }
    return new Blob(new Array(output.trim()), {type: "text/plain;charset=utf-8"});
}

const CsvDownLoader = (props) => {
    const dispatch = useDispatch()

    const handleDownloadCsv = () => {

        try {
            const {generalState, graphState} = clonedeep(props)
            const blob = createCsvBlob(generalState, graphState)
            saveAs(blob, "ModuleGraph.csv")
            dispatch({type: "ADD_CSV_DOWNLOAD_TO_AUDIT_TRAIL"})
        } catch (e) {
            window.alert("make a change")
        }

    }

    return (
        <div>
            <ToolTipBig title={"Click for downloading the pathway as CSV"} placement={"right"}>
                <button disabled={props.graphState.data.nodes.length < 1} className={"download-button"}
                        onClick={handleDownloadCsv}>Download Csv
                </button>
            </ToolTipBig>
        </div>
    )
}

export default CsvDownLoader

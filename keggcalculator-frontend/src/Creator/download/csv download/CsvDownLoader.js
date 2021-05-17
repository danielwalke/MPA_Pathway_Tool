import React, {useEffect} from "react";
import {saveAs} from "file-saver";
import {useSelector} from "react-redux";
import {getNodePosition} from "../NodePosition";
import {addOutput, getReactions} from "../DownloadFunctions";
import clonedeep from "lodash/cloneDeep";

const CsvDownLoader = () => {

    const generalState = clonedeep(useSelector(state => state.general))
    const graphState = clonedeep(useSelector(state => state.graph))

    const handleDownloadCsv = () => {
        try{
            const {reactionObjects, reactionNames} = getReactions(graphState)
            const reactions = reactionNames.map(name => generalState.reactionsInSelectArray.filter(reaction => reaction.reactionName === name)[0])
            reactions.map(reaction => {
                reaction.abbreviation = typeof graphState.abbreviationsObject[`${reaction.reactionName}`] === "undefined" ? reaction.reactionName : graphState.abbreviationsObject[`${reaction.reactionName}`]
                reaction.opacity = graphState.data.nodes.filter(node => node.id === reaction.reactionName)[0].opacity
                const reversible = graphState.data.nodes.filter(node => node.id === reaction.reactionName)[0].reversible
                reaction.reversible = reversible ? "reversible" : "irreversible"
                reaction.x = getNodePosition(reaction.reactionName).x
                reaction.y = getNodePosition(reaction.reactionName).y
                if(graphState.data.links.length===0){ //transport proteins only
                    reaction.substrates=[]
                    reaction.products = []
                }else{
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
                            const productId = product.name.substring(product.name.length-6, product.name.length)
                            product.stochiometry = reaction.stochiometrySubstratesString[`${productId}`]
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
            for(const reaction of reactions){
                for(const substrate of reaction.substrates){
                    // console.log(substrate.stochiometry)
                    output = addOutput(output, reaction, substrate, reactionCounter, compoundTypeSubstrate,reaction.reversible)
                }
                for(const product of reaction.products){
                    output = addOutput(output, reaction, product, reactionCounter, compoundTypeProduct,reaction.reversible)
                }
                if(reaction.substrates.length===0 && reaction.products.length === 0){
                    output = addOutput(output, reaction, {stochiometry:"", name:"",x:"",y:"",opacity:"",abbreviation:""}, reactionCounter, "")
                }
                reactionCounter++;
            }
            let blob = new Blob(new Array(output.trim()), {type: "text/plain;charset=utf-8"});
            saveAs(blob, "ModuleGraph.csv")
        }catch (e){
            window.alert("make a change")
        }

    }

    return (
        <div>
            <button disabled={graphState.data.nodes.length < 1} className={"downloadButton"}
                    onClick={handleDownloadCsv}>Download Csv
            </button>
        </div>
    )
}

export default CsvDownLoader
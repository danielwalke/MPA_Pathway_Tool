import React, {useEffect} from "react";
import clonedeep from "lodash/cloneDeep";
import {addLocationInformation, addOutput, getReactions} from "./DownloadFunctionFba";
import {getNodePosition} from "../../../Creator/download/NodePosition";
import {saveAs} from "file-saver";
import {useSelector} from "react-redux";
import {Reaction} from "../../../Creator/upload/model/Reaction";
import {Compound} from "../../../Creator/upload/model/Compound";

const DownloadCSV = (props) =>{

    useEffect(()=>{
        const {generalState, graphState, fbaState} = clonedeep(props)
        console.log(generalState.cystolInformation)
    },[])


    const handleDownloadCsv = () => {

        try{
            const {generalState, graphState, fbaState} = clonedeep(props)
            const {reactionObjects, reactionNames} = getReactions(generalState, graphState)
            const reactions = reactionNames.map(name => generalState.reactionsInSelectArray.filter(reaction => reaction.reactionName === name)[0])
            reactions.map(reaction => {
                reaction.abbreviation = typeof graphState.abbreviationsObject[`${reaction.reactionName}`] === "undefined" ? reaction.reactionName : graphState.abbreviationsObject[`${reaction.reactionName}`]
                reaction.opacity = generalState.new_data_gen.nodes.filter(node => node.id === reaction.reactionName)[0].opacity
                const reversible = generalState.new_data_gen.nodes.filter(node => node.id === reaction.reactionName)[0].reversible
                reaction.reversible = reversible ? "reversible" : "irreversible"
                reaction.x = getNodePosition(reaction.reactionName).x
                reaction.y = getNodePosition(reaction.reactionName).y
                if(generalState.new_data_gen.links.length===0){ //transport proteins only
                    reaction.substrates=[]
                    reaction.products = []
                }else{
                    if (reaction.isForwardReaction) {
                        reaction.substrates = reactionObjects[`${reaction.reactionName}`].substrates.map(substrate =>{
                            const substrateId = substrate.name.substring(substrate.name.length-6, substrate.name.length)
                            substrate.stochiometry = reaction.stochiometrySubstratesString instanceof Map? reaction.stochiometrySubstratesString.get(substrateId) :
                                reaction.stochiometrySubstratesString[substrateId]
                            return substrate
                        })
                        reaction.products = reactionObjects[`${reaction.reactionName}`].products.map(product =>{
                            const productId = product.name.substring(product.name.length-6, product.name.length)
                            product.stochiometry =reaction.stochiometryProductsString instanceof Map? reaction.stochiometryProductsString.get(productId) :
                                reaction.stochiometryProductsString[productId]
                            return product
                        })
                    } else {
                        reaction.substrates = reactionObjects[`${reaction.reactionName}`].substrates.map(substrate =>{
                            const substrateId = substrate.name.substring(substrate.name.length-6, substrate.name.length)
                            substrate.stochiometry = reaction.stochiometryProductsString instanceof Map? reaction.stochiometryProductsString.get(substrateId) :
                                reaction.stochiometryProductsString[substrateId]
                            return substrate
                        })
                        reaction.products = reactionObjects[`${reaction.reactionName}`].products.map(product =>{
                            const productId = product.name.substring(product.name.length-6, product.name.length)
                            product.stochiometry =  reaction.stochiometrySubstratesString instanceof Map? reaction.stochiometrySubstratesString.get(productId) :
                                reaction.stochiometrySubstratesString[productId]
                            return product
                        })
                    }
                }
                console.log(reaction)
                // reaction["opacity"] = 1
                // let output = outputCsv.concat("stepId;ReactionNumberId;koNumberIds;ecNumberIds;stochCoeff;compoundId;typeOfCompound;reversibility;taxonomy;reactionX;reactionY;CompoundX;CompoundY;reactionAbbr;compoundAbbr;keyComp", "\n")
                return reaction
            })
            let output = "ReactionNumberId;FVA_min;FVA_max;FBA\n"
            let reactionCounter = 0
            const compoundTypeSubstrate = "substrate"
            const compoundTypeProduct = "product"
            for(const reaction of reactions){
                for(const substrate of reaction.substrates){
                    // console.log(substrate.stochiometry)
                    output = addOutput(output, reaction, substrate, reactionCounter, compoundTypeSubstrate,reaction.reversible, generalState)
                    output = addLocationInformation(output, generalState, reaction, substrate)
                }
                for(const product of reaction.products){
                    output = addOutput(output, reaction, product, reactionCounter, compoundTypeProduct,reaction.reversible, generalState)
                    output = addLocationInformation(output, generalState, reaction, product)
                }
                if(reaction.substrates.length===0 && reaction.products.length === 0){
                    output = addOutput(output, reaction, {stochiometry:"", name:"",x:"",y:"",opacity:"",abbreviation:""}, reactionCounter, "", "", generalState)
                }
                reactionCounter++;
            }
            let blob = new Blob(new Array(output.trim()), {type: "text/plain;charset=utf-8"});

            saveAs(blob, "FbaFormat.csv")
        }catch (e){
            window.alert(e)
        }

    }

    return(
        <div onClick={handleDownloadCsv}>
            Download CSV
        </div>
    );
}
export default DownloadCSV;
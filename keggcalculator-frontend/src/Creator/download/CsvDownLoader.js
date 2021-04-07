import React from "react";
import {saveAs} from "file-saver";
import {useSelector} from "react-redux";
import {getNodePosition} from "./NodePosition";
import {addOutput, getReactions} from "./DownloadFunctions";
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
                reaction.opacity = clonedeep(graphState.data.nodes.filter(node => node.id = reaction.reactionName)[0].opacity)
                reaction.reversible = "reversible"
                reaction.x = getNodePosition(reaction.reactionName).x
                reaction.y = getNodePosition(reaction.reactionName).y
                if(graphState.data.links.length===0){
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
                    output = addOutput(output, reaction, substrate, reactionCounter, compoundTypeSubstrate)
                }
                for(const product of reaction.products){
                    output = addOutput(output, reaction, product, reactionCounter, compoundTypeProduct)
                }
                if(reaction.substrates.length===0 && reaction.products.length === 0){
                    output = addOutput(output, reaction, {stochiometry:"", name:"",x:"",y:"",opacity:"",abbreviation:""}, reactionCounter, "")
                }
                reactionCounter++;
            }
            let blob = new Blob(new Array(output.trim()), {type: "text/plain;charset=utf-8"});
            saveAs(blob, "ModuleGraph.csv")
            // let outputCsv = ""
            // const reactionKeySubstrateObjects = {}
            // const reactionNotKeySubstrateObjects = {}
            // const reactionKeyProductObjects = {}
            // const reactionNotKeyProductObjects = {}
            // const reactionNameSet = new Set()
            // graphState.data.links.map(link => {
            //     let reactionName
            //     if (link.source.match(/\s[R,U][0-9][0-9][0-9][0-9][0-9]/) !== null) { //reaction is source
            //         reactionName = link.source
            //         if (link.opacity !== 0.4) { //link is key link
            //             if (typeof reactionKeyProductObjects[reactionName] === "undefined") {
            //                 reactionKeyProductObjects[reactionName] = []
            //                 reactionKeyProductObjects[reactionName].push(link.target)
            //             } else {
            //                 reactionKeyProductObjects[reactionName].push(link.target)
            //             }
            //         } else {
            //             if (typeof reactionNotKeyProductObjects[reactionName] === "undefined") {
            //                 reactionNotKeyProductObjects[reactionName] = []
            //                 reactionNotKeyProductObjects[reactionName].push(link.target)
            //             } else {
            //                 reactionNotKeyProductObjects[reactionName].push(link.target)
            //             }
            //         }
            //
            //     } else {//reaction is target
            //         reactionName = link.target
            //         if (link.opacity !== 0.4) {//link is key link
            //             if (typeof reactionKeySubstrateObjects[reactionName] === "undefined") {
            //                 reactionKeySubstrateObjects[reactionName] = []
            //                 reactionKeySubstrateObjects[reactionName].push(link.source)
            //             } else {
            //                 reactionKeySubstrateObjects[reactionName].push(link.source)
            //             }
            //         } else {
            //             if (typeof reactionNotKeySubstrateObjects[reactionName] === "undefined") {
            //                 reactionNotKeySubstrateObjects[reactionName] = []
            //                 reactionNotKeySubstrateObjects[reactionName].push(link.source)
            //             } else {
            //                 reactionNotKeySubstrateObjects[reactionName].push(link.source)
            //             }
            //         }
            //
            //     }
            //     reactionNameSet.add(reactionName)
            //     return null
            // })
            // const addOutput = (output,i,reactionName,koNumbers, ecNumbers, coeff,compound, isSubstrate,isReversible, taxonomies, reactionX, reactionY, compX,compY,reactionAbbr, compoundAbbr,isKey ) =>{
            //     let compoundType = isSubstrate ? "substrate" : "product"
            //     let reversible = isReversible ? "reversible" : "irreversible"
            //     output = output.concat(i.toString() + ";" + reactionName.replaceAll(";", "\t") + ";" + koNumbers + ";"+ecNumbers + ";"
            //         + coeff.toString() + ";" + compound.replaceAll(";", "\t") + ";"
            //         + compoundType + ";" + reversible +";"
            //     +taxonomies + ";" + reactionX.toString()+ ";" + reactionY.toString() +";"
            //         + compX.toString() + ";" + compY.toString() + ";" + reactionAbbr + ";" + compoundAbbr +";"  + isKey.toString() + "\n")
            //     return output
            // }
            // let output = outputCsv.concat("stepId;ReactionNumberId;koNumberIds;ecNumberIds;stochCoeff;compoundId;typeOfCompound;reversibility;taxonomy;reactionX;reactionY;CompoundX;CompoundY;reactionAbbr;compoundAbbr;keyComp", "\n")
            // for (let i = 0; i < Array.from(reactionNameSet).length; i++) {
            //     const reactionName = Array.from(reactionNameSet)[i]
            //     const reaction = generalState.reactionsInSelectArray.filter(reaction => {
            //         return reaction.reactionName === reactionName
            //     })[0]
            //     const koNumbers = reaction.koNumbersString.toString()
            //     const ecNumbers = reaction.ecNumbersString.toString()
            //     const isReversible = true
            //     const reactionX = getNodePosition(reactionName).x
            //     const reactionY = getNodePosition(reactionName).y
            //     let taxonomies = ""
            //     let reactionAbbr = typeof graphState.abbreviationsObject[reactionName] !== "undefined" ? graphState.abbreviationsObject[reactionName].replaceAll(";", "\t")
            //                 : reactionName.replaceAll(";", "\t")
            //     for (let iterator = 0; iterator < reaction.taxonomies.length; iterator++) {
            //         const taxon = reaction.taxonomies[iterator]
            //         if (iterator < reaction.taxonomies.length - 1) {
            //             taxonomies += `${taxon}&&`
            //         } else {
            //             taxonomies += taxon
            //         }
            //     }
            //     if (typeof reactionKeySubstrateObjects[reactionName] !== "undefined") {
            //         reactionKeySubstrateObjects[reactionName].map(substrate => {
            //             let coeff=1;
            //             const id = substrate.substring(substrate.length-6, substrate.length)
            //             if(typeof reaction.stochiometrySubstratesString[id] !== "undefined"){
            //                 coeff = reaction.stochiometrySubstratesString[id]
            //             }else{
            //                 coeff = reaction.stochiometryProductsString[id]
            //             }
            //             const isSubstrate = true;
            //             const compX = getNodePosition(substrate).x
            //             const compY = getNodePosition(substrate).y
            //             let compoundAbbr = typeof graphState.abbreviationsObject[substrate] !== "undefined" ? graphState.abbreviationsObject[substrate].replaceAll(";", "\t")
            //                 : substrate.replaceAll(";", "\t")
            //             const isKey = true
            //             output = addOutput(output,i,reactionName,koNumbers, ecNumbers, coeff,substrate, isSubstrate,isReversible, taxonomies, reactionX, reactionY, compX,compY,reactionAbbr, compoundAbbr,isKey )
            //         })
            //     }
            //     if (typeof reactionNotKeySubstrateObjects[reactionName] !== "undefined") {
            //         reactionNotKeySubstrateObjects[reactionName].map(substrate => {
            //             let coeff=1;
            //             const id = substrate.substring(substrate.length-6, substrate.length)
            //             if(typeof reaction.stochiometrySubstratesString[id] !== "undefined"){
            //                 coeff = reaction.stochiometrySubstratesString[id]
            //             }else{
            //                 coeff = reaction.stochiometryProductsString[id]
            //             }
            //             const isSubstrate = true;
            //             const compX = getNodePosition(substrate).x
            //             const compY = getNodePosition(substrate).y
            //             let compoundAbbr = typeof graphState.abbreviationsObject[substrate] !== "undefined" ? graphState.abbreviationsObject[substrate].replaceAll(";", "\t")
            //                 : substrate.replaceAll(";", "\t")
            //             const isKey = false
            //             output = addOutput(output,i,reactionName,koNumbers, ecNumbers, coeff,substrate, isSubstrate,isReversible, taxonomies, reactionX, reactionY, compX,compY,reactionAbbr, compoundAbbr,isKey )
            //         })
            //     }
            //     if (typeof reactionKeyProductObjects[reactionName] !== "undefined") {
            //
            //         reactionKeyProductObjects[reactionName].map(product => {
            //             let coeff=1;
            //             const id = product.substring(product.length-6, product.length)
            //             if(typeof reaction.stochiometrySubstratesString[id] !== "undefined"){
            //                 coeff = reaction.stochiometrySubstratesString[id]
            //             }else{
            //                 coeff = reaction.stochiometryProductsString[id]
            //             }
            //             const isSubstrate = false;
            //             const compX = getNodePosition(product).x
            //             const compY = getNodePosition(product).y
            //             let compoundAbbr = typeof graphState.abbreviationsObject[product] !== "undefined" ? graphState.abbreviationsObject[product].replaceAll(";", "\t")
            //                 : product.replaceAll(";", "\t")
            //             const isKey = true
            //             output = addOutput(output,i,reactionName,koNumbers, ecNumbers, coeff,product, isSubstrate,isReversible, taxonomies, reactionX, reactionY, compX,compY,reactionAbbr, compoundAbbr,isKey )
            //         })
            //     }
            //     if (typeof reactionNotKeyProductObjects[reactionName] !== "undefined") {
            //         reactionNotKeyProductObjects[reactionName].map(product => {
            //             let coeff=1;
            //             const id = product.substring(product.length-6, product.length)
            //             if(typeof reaction.stochiometrySubstratesString[id] !== "undefined"){
            //                 coeff = reaction.stochiometrySubstratesString[id]
            //             }else{
            //                 coeff = reaction.stochiometryProductsString[id]
            //             }
            //             const isSubstrate = false;
            //             const compX = getNodePosition(product).x
            //             const compY = getNodePosition(product).y
            //             let compoundAbbr = typeof graphState.abbreviationsObject[product] !== "undefined" ? graphState.abbreviationsObject[product].replaceAll(";", "\t")
            //                 : product.replaceAll(";", "\t")
            //             const isKey = false
            //             output = addOutput(output,i,reactionName,koNumbers, ecNumbers, coeff,product, isSubstrate,isReversible, taxonomies, reactionX, reactionY, compX,compY,reactionAbbr, compoundAbbr,isKey )
            //         })
            //     }
            //
            // }
            // let blob = new Blob(new Array(output.trim()), {type: "text/plain;charset=utf-8"});
            // saveAs(blob, "ModuleGraph.csv")
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
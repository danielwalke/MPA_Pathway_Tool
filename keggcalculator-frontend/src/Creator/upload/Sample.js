import React, {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux";
import "./Sample.css"
import {filterTaxon} from "../main/TaxonomyFilter";


const matchKoOrEc = (proteinKoAndEc, reactionKoNumbers, reactionEcNumbers) => {
    const filteredNumbers = proteinKoAndEc.filter(number => reactionEcNumbers.includes(number) || reactionKoNumbers.includes(number))
    return filteredNumbers.length > 0
}

const anyItemInArray = (items, array) => {
    const isAnyItemInArray = items.filter(item => array.includes(item)).length > 0
    return isAnyItemInArray
}
//color nodes depending on data of MPA file
const handleSample = (e, index, state, dispatch) => {
    dispatch({type: "SETLOADING", payload: true})
    console.time("calc")
    // e.preventDefault()
    const proteins = Array.from(state.mpaProteins.proteinSet)
    const numbers = []
    state.general.reactionsInSelectArray.map(r => r.koNumbersString.map(ko => numbers.push(ko)))
    state.general.reactionsInSelectArray.map(r => r.ecNumbersString.map(ec => numbers.push(ec)))
    // const samples = state.mpaProteins.sampleNames.map((sampleName, index)=>{
    const metaProteins = []
    proteins.map(protein => {
        if (anyItemInArray(Array.from(protein.koAndEcSet), numbers)) {
            metaProteins.push({
                name: protein.name,
                taxa: protein.taxa,
                koAndEc: Array.from(protein.koAndEcSet),
                quant: protein.quants[index]
            })
        }
        return null
    })
    // return {sampleName: sampleName, metaProteins: metaProteins}
    // })//separate useEffects?
    //find all reactionNodes -> these should be highlighted
    const reactionNodes = state.graph.data.nodes.filter(node => node.symbolType === "diamond")
    const reactions = reactionNodes.map(node => {
        const reaction = state.general.reactionsInSelectArray.filter(r => r.reactionId === node.id.substring(node.id.length - 6, node.id.length))[0]
        const filteredProteins = metaProteins.filter(protein => matchKoOrEc(protein.koAndEc, reaction.koNumbersString, reaction.ecNumbersString) && filterTaxon(reaction.taxa, protein.taxa))
        // const reFilteredProteins = filteredProteins.filter(protein => filterTaxon(reaction.taxa, protein.taxa))
        const hasMatchedProtein = filteredProteins.length > 0
        let quantSum = 0;
        filteredProteins.map(protein => quantSum += +protein.quant)
        return {
            nodeId: node.id,
            hasMatchedProtein: hasMatchedProtein,
            quantSum: quantSum
        };
    })
//     const sampleObject = sampleObjectList[index]
    const data={nodes:[], links: state.graph.data.links}
    const nodes = []
    const compoundNodes = state.graph.data.nodes.filter(node => node.symbolType !== "diamond")
    const newReactionNodes = reactionNodes.map(node=>{
        const reaction = reactions.filter(r => node.id === r.nodeId)[0]
        if (reaction.hasMatchedProtein) {
            if (+reaction.quantSum < state.mpaProteins.midQuantUser3) {
                const g = ((+reaction.quantSum - state.mpaProteins.minQuantUser3) / (state.mpaProteins.midQuantUser3 - state.mpaProteins.minQuantUser3)) * 255
                node.color = `rgb(255,${g},0)`
                console.log(node)
            } else {
                const r = 255 - ((+reaction.quantSum - state.mpaProteins.midQuantUser3) / (state.mpaProteins.maxQuantUser3 - state.mpaProteins.midQuantUser3)) * 255;
                node.color = `rgb(${r},255,0)`
                console.log(node)
            }
        } else {
            node.color = `rgb(170, 170, 170)`
        }
        return node
    })
compoundNodes.map(node => nodes.push(node))
    newReactionNodes.map(node => nodes.push(node))
    data.nodes = nodes
    dispatch({type: "SETDATA", payload: data})
    dispatch({type:"SETLOADING", payload:false})
    console.log(reactions)
    console.timeEnd("calc")
}

const Sample = () => {
    const state = useSelector(state => state)
    const dispatch = useDispatch()
    //getSampleColumnSizes(state.proteinState.sampleNames)
    return (
        <div style={{}}>
            {state.mpaProteins.proteinSet.size > 0 &&
            <div style={{
                display: "grid",
                margin: "0 2px",
                gridTemplateColumns: "repeat(10,1fr)",
                // gridTemplateColumns: `repeat(${state.proteinState.sampleNames.length}, 1fr)`,
            }}>
                {state.mpaProteins.sampleNames.map((sampleName, index) => <div
                    style={{width: "inherit", overflowX: "scroll"}}>
                    <button
                        key={"B".concat(index.toString())}
                        className={"sampleButton"}
                        onClick={(e) => handleSample(e, index, state, dispatch)}>
                        {sampleName}
                    </button>
                </div>)}
            </div>
            }
        </div>


    )
}
export default Sample
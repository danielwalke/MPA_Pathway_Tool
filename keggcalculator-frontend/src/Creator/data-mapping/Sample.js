import React from "react"
import {useDispatch, useSelector} from "react-redux";
import "./Sample.css"
import {filterTaxon} from "./TaxonomyFilter";
import {ToolTipBig} from "../main/user-interface/UserInterface";
import {getKeggId} from "../../Flux Analysis/services/CreateFbaGraphData";


const matchKoOrEc = (proteinKoAndEc, reactionKoNumbers, reactionEcNumbers) => {
    const filteredNumbers = proteinKoAndEc.filter(number => reactionEcNumbers.includes(number) || reactionKoNumbers.includes(number))
    return filteredNumbers.length > 0
}

const doesArrayIncludeAnyItem = (items, array) => {
    return items.filter(item => array.includes(item)).length > 0
}

const mapProteinsToReactionNodes = (reactionNodes, reactionArray, includedProteins) => {
    return reactionNodes.map(node => {
        const reaction = reactionArray.find(r => r.reactionId === getKeggId(node.id))
        const filteredProteins = includedProteins.filter(
            protein => matchKoOrEc(protein.koAndEc, reaction.koNumbersString, reaction.ecNumbersString) && filterTaxon(reaction.taxa, protein.taxa))
        // const reFilteredProteins = filteredProteins.filter(protein => filterTaxon(reaction.taxa, protein.taxa))
        const hasMatchedProtein = filteredProteins.length > 0
        let quantSum = 0;
        filteredProteins.forEach(protein => quantSum += +protein.quant)
        return {
            nodeId: node.id,
            hasMatchedProtein: hasMatchedProtein,
            quantSum: quantSum
        };
    })
}

function colorNodes(reactionNodes, reactions, state) {
    const newReactionNodes = reactionNodes.map(node => {
        const reaction = reactions.find(r => node.id === r.nodeId)
        if (reaction.hasMatchedProtein) {
            if (+reaction.quantSum < state.mpaProteins.midQuantUser3) {
                const b = ((+reaction.quantSum - state.mpaProteins.minQuantUser3) / (state.mpaProteins.midQuantUser3 - state.mpaProteins.minQuantUser3)) * 255
                node.color = `rgb(255,0,${b})`
            } else {
                const r = 255 - ((+reaction.quantSum - state.mpaProteins.midQuantUser3) / (state.mpaProteins.maxQuantUser3 - state.mpaProteins.midQuantUser3)) * 255;
                node.color = `rgb(${r},0,255)`
            }
        } else {
            node.color = `rgb(110, 110, 110)`
        }
        return node
    })
    return newReactionNodes;
}

function getMetaProteinsInReactions(proteins, identifiers, index) {
    const metaProteins = proteins.map(protein => {
        if (doesArrayIncludeAnyItem(Array.from(protein.koAndEcSet), identifiers)) {
            return {
                name: protein.name,
                taxa: protein.taxa,
                koAndEc: Array.from(protein.koAndEcSet),
                quant: protein.quants[index]
            }
        }
    })
    return metaProteins;
}

//color nodes depending on data of MPA file
const handleSample = (e, index, state, dispatch) => {
    dispatch({type: "SETLOADING", payload: true})

    const proteins = Array.from(state.mpaProteins.proteinSet)
    const identifiers = []
    state.general.reactionsInSelectArray.forEach(reaction => {
        identifiers.push(...reaction.koNumbersString)
        identifiers.push(...reaction.ecNumbersString)
    })

    // const samples = state.mpaProteins.sampleNames.map((sampleName, index)=>{
    const metaProteins = getMetaProteinsInReactions(proteins, identifiers, index);

    // return {sampleName: sampleName, metaProteins: metaProteins}
    // })//separate useEffects?
    //find all reactionNodes -> these should be highlighted
    const reactionNodes = state.graph.data.nodes.filter(node => node.symbolType === "diamond")
    const reactions = mapProteinsToReactionNodes(reactionNodes, state.general.reactionsInSelectArray, metaProteins)

//     const sampleObject = sampleObjectList[index]
    const data = {nodes: [], links: state.graph.data.links}

    const compoundNodes = state.graph.data.nodes.filter(node => node.symbolType !== "diamond")
    const newReactionNodes = colorNodes(reactionNodes, reactions, state);

    data.nodes = [...compoundNodes, ...newReactionNodes]

    dispatch({type: "SETDATA", payload: data})
    dispatch({type: "SETLOADING", payload: false})
}

const Sample = () => {
    const state = useSelector(state => state)
    const dispatch = useDispatch()
    //getSampleColumnSizes(state.proteinState.sampleNames)

    return (
        <div>
            {state.mpaProteins.proteinSet.size > 0 &&
            <div style={{
                display: "grid",
                margin: "0 2px",
                gridTemplateColumns: "repeat(10,1fr)",
                // gridTemplateColumns: `repeat(${state.proteinState.sampleNames.length}, 1fr)`,
            }}>
                {state.mpaProteins.sampleNames.map((sampleName, index) => <div
                    style={{width: "inherit", overflowX: "scroll"}}>
                    <ToolTipBig title={` mapping experimental data of the sample ${sampleName} on the pathway`}
                                placement={"top"}>
                        <button
                            key={"B".concat(index.toString())}
                            className={"sampleButton"}
                            onClick={(e) => handleSample(e, index, state, dispatch)}>
                            {sampleName}
                        </button>
                    </ToolTipBig>
                </div>)}
            </div>
            }
        </div>
    )
}
export default Sample

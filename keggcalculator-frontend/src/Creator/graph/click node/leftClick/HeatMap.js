import React, {useState, useEffect} from "react";
import {useSelector} from "react-redux";
import "./Heatmap.css"
import {filterTaxon} from "../../../data-mapping/TaxonomyFilter";

const HeatMap = () => {
    const [matchedProteins, setMatchedProteins] = useState([])
    const graphState = useSelector(state => state.graph)
    const proteinState = useSelector(state => state.mpaProteins)
    const generalState = useSelector(state => state.general)
    const clickedNodeR = graphState.chosenNode;
    const clickedReactionArr = generalState.reactionsInSelectArray.filter(reaction => reaction.reactionId === clickedNodeR)
    const clickedReaction = clickedReactionArr[0]
    useEffect(() => {
        const proteins = Array.from(proteinState.proteinSet)
        const matchedProteinSet = new Set()
        proteins.map(protein => {
            const koAndEc = Array.from(protein.koAndEcSet)
            loop:
            for (let iterator = 0; iterator < koAndEc.length; iterator++) {
                const proteinKoAndEc = koAndEc[iterator]
                const isProteinKoInReaction = clickedReaction.koNumbersString.includes(proteinKoAndEc)
                const isProteinEcInReaction = clickedReaction.ecNumbersString.includes(proteinKoAndEc)
                if(filterTaxon(clickedReaction.taxa, protein.taxa) && (isProteinEcInReaction || isProteinKoInReaction)){
                    matchedProteinSet.add(protein)
                    break
                }
            }
            return null;
        })
        setMatchedProteins(Array.from(matchedProteinSet))
    }, [proteinState.proteinSet, graphState, clickedReaction])
    return (<table style={{height: "auto", width:"auto"}}>
           <thead>
           <tr style={{height: "5vh", width:"auto"}}>
               <th style={{height: "5vh", width:"auto"}}> </th>
               {proteinState.sampleNames.map(sampleName => {
                   return (
                       <th style={{height: "5vh"}}>
                           <SampleName sampleName={sampleName}/>
                       </th>

                   )
               })
               }
           </tr>
           </thead>
            {matchedProteins.map((protein) => {
                    return (
                        <tbody>
                        <tr style={{height: "5vh"}}>
                            <td style={{height: "5vh"}}><ProteinName proteinName={protein.name}/></td>
                            {protein.quants.map((quant, index) => {
                                let color;
                                if(+quant<proteinState.midQuantUserReaction3){
                                    const g = ((+quant - proteinState.minQuantUserReaction3) / (proteinState.midQuantUserReaction3 - proteinState.minQuantUserReaction3)) * 255
                                    color = {
                                        r: 255,
                                        g: g,
                                        b: 0
                                    }
                                }else{
                                    const r = 255 - ((+quant - proteinState.midQuantUserReaction3) / (proteinState.maxQuantUserReaction3 - proteinState.midQuantUserReaction3)) * 255
                                    color = {
                                        r: r,
                                        g: 255,
                                        b: 0
                                    }
                                }

                                return (
                                    <td style={{height: "5vh"}}>
                                        <Square color={color} number={quant}/>
                                    </td>
                                )
                            })}
                        </tr>
                        </tbody>
                    )
                }
            )}
        </table>
    )
}
export default HeatMap

//make squares for heatmap
const Square = (props) => {
    return (
        <div style={{
            border: "2px solid black",
            color: "white",
            width: "auto",
            height:"auto",
            backgroundColor: `rgb(${props.color.r},${props.color.g},${props.color.b})`
        }}>{props.number}</div>

    )
}

const SampleName = (props) => {
    return (
        <div style={{height:"auto", overflow: "auto", width: "100%"}}>
            {props.sampleName}
        </div>
    )
}

const ProteinName = (props) => {
    return (
        <div style={{overflow: "auto", height: "40px", width: "100px"}}>
            {props.proteinName}
        </div>
    )
}
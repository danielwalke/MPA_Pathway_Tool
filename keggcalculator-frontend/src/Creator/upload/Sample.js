import React from "react"
import {useDispatch, useSelector} from "react-redux";
import "./Sample.css"
import {filterTaxon} from "../main/TaxonomyFilter";

//color nodes depending on data of MPA file
const handleSample = (e, index, state, dispatch) => {
    e.preventDefault()
    const {graphState, proteinState, generalState} = state
    const proteins = Array.from(proteinState.proteinSet)
    const metaProteins = proteins.map(protein => {
        return {
            name: protein.name,
            // taxonomies: protein.taxonomies,
            taxa: protein.taxa,
            koAndEc: Array.from(protein.koAndEcSet),
            quant: protein.quants[index]
        }
    })
    graphState.data.nodes.map(node => {
        if (node.symbolType === "diamond" || node.symbolType === "square") {
            const filteredReaction = generalState.reactionsInSelectArray.filter(r => node.id.substring(node.id.length - 6, node.id.length) === r.reactionId)
            const reaction = filteredReaction[0]; //matches everytime only one element
            const {koNumbersString, ecNumbersString, taxonomies, taxa} = reaction
            let quantSum = 0;
            const matchedProteins = metaProteins.filter(protein => {
                let isProteinMatching = false
                const koEcFiltered = protein.koAndEc.filter(koEc => koNumbersString.includes(koEc) || ecNumbersString.includes(koEc))
                // const taxFiltered = protein.taxonomies.filter(tax => taxonomies.includes(tax))
                // const isNoReactionTaxonomy = taxonomies.length === 1 && taxonomies.includes("")
                if(filterTaxon(taxa, protein.taxa) && koEcFiltered.length>0){
                        isProteinMatching = true;
                        quantSum += protein.quant
                }
                // if ((isNoReactionTaxonomy || taxFiltered.length > 0) && koEcFiltered.length > 0) {
                //     isProteinMatching = true;
                //     quantSum += protein.quant
                // }
                return isProteinMatching
            })
            if (matchedProteins.length > 0) {
                if (+quantSum < proteinState.midQuantUser3) {
                    const g = ((+quantSum - proteinState.minQuantUser3) / (proteinState.midQuantUser3 - proteinState.minQuantUser3)) * 255
                    node.color = `rgb(255,${g},0)`
                } else {
                    const r = 255 - ((+quantSum - proteinState.midQuantUser3) / (proteinState.maxQuantUser3 - proteinState.midQuantUser3)) * 255;
                    node.color = `rgb(${r},255,0)`
                }
            } else {
                node.color = `rgb(170, 170, 170)`
            }
        }
        return null
    })
    dispatch({type: "SETDATA", payload: graphState.data})

}

const Sample = () => {
    const state = {
        generalState: useSelector(state => state.general),
        graphState: useSelector(state => state.graph),
        proteinState: useSelector(state => state.mpaProteins)
    }
    const dispatch = useDispatch()
    //getSampleColumnSizes(state.proteinState.sampleNames)
    return (
        <div style={{         }}>
            {state.proteinState.proteinSet.size > 0 &&
            <div style={{
                display: "grid",
                margin: "0 2px",
                gridTemplateColumns: "repeat(10,1fr)",
                // gridTemplateColumns: `repeat(${state.proteinState.sampleNames.length}, 1fr)`,
            }}>
                {state.proteinState.sampleNames.map((sampleName, index) => <div
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
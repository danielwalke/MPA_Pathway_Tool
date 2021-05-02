import React, {useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {saveAs} from "file-saver";

const fetchStochiometricInformation = (state, dispatch) => {
    const nodeIds = state.graph.data.nodes.map(node => node.id.substring(node.id.length-6, node.id.length))
    const reactions = state.general.reactionsInSelectArray.filter(reaction => nodeIds.includes(reaction.reactionId))
    const revisedReactions = []
    const forwardReactions = reactions.filter(reaction => reaction.isForwardReaction)
    forwardReactions.map(r => {
        r.substrates = r.stochiometrySubstratesString
        console.log(r.stochiometrySubstratesString)
        r.products = r.stochiometryProductsString
        console.log(r.stochiometryProductsString)
        revisedReactions.push(r)
        return null;
    })
    const backwardReactions = reactions.filter(reaction => !reaction.isForwardReaction)
    backwardReactions.map(r => {
        r.substrates = r.stochiometryProductsString
        r.products = r.stochiometrySubstratesString
        revisedReactions.push(r)
        return null;
    })
    const substrateArrays = revisedReactions.map(r => Object.keys(r.substrates))
    const compoundsSet = new Set()
    substrateArrays.map(substrateArray => substrateArray.map(substrate=> compoundsSet.add(substrate)))
    const productArrays = revisedReactions.map(r => Object.keys(r.products))
    productArrays.map(productArray => productArray.map(product=> compoundsSet.add(product)))
    const compounds = Array.from(compoundsSet)
    let output = ""
    revisedReactions.map(reaction => output+= `;${reaction.reactionName.replaceAll(";", ",")}`)
    const stoichiometricMatrix = compounds.map(compound => {
        output+="\n"
        output+=compound
        const stoichiometricArray = revisedReactions.map(reaction=>{
            const substrates = reaction.substrates
            const products = reaction.products
            let sc = 0//compound is not on substrate neither on product side
            if(typeof substrates[compound] !== "undefined" && typeof products[compound] !== "undefined"){ //compound on both sides of the reaction
                const diff = +products[compound] - +substrates[compound]
                sc = Number.isNaN(diff)? `${products[compound]}-${substrates[compound]}` : diff
            }
            if(typeof substrates[compound] !== "undefined" && typeof products[compound] === "undefined"){ //compound is only on substrate side
                sc = `-${substrates[compound]}`
            }
            if(typeof substrates[compound] === "undefined" && typeof products[compound] !== "undefined"){//compound is only on product side
                sc = products[compound]
            }
            console.log(compound + "\t" + reaction.reactionId + "\t" + sc )
            output+=";"
            output+=sc.toString()
            return sc
        })
        return stoichiometricArray
    })
    console.log(stoichiometricMatrix)
    console.log(compounds.map(compound=> compound))
    console.log(revisedReactions.map(r=> r))
    console.log(output)
    let blob = new Blob(new Array(output.trim()), {type: "text/plain;charset=utf-8"});
    saveAs(blob, "stoichiometricMatrix.csv")
}

const StoichiometricMatrix = () => {
    const state = useSelector(state=> state);
    const dispatch = useDispatch();
    return (<div>
            <button className={"downloadButton"} onClick={()=>fetchStochiometricInformation(state, dispatch)}>stochiometric matrix</button>
        </div>
    );
};

export default StoichiometricMatrix;
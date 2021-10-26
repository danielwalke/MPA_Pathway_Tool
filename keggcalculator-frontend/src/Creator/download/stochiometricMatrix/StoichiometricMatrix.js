import React, {useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {saveAs} from "file-saver";
import {getReactionObjects} from "./ReactionObject";
import clonedeep from "lodash/cloneDeep"

const fetchStochiometricInformation = (dispatch, props) => {
    const {generalState, graphState} = clonedeep(props)
    //fetches all reactions and information
    const nodeIds = graphState.data.nodes.map(node => node.id.substring(node.id.length-6, node.id.length))
    const reactionIds = nodeIds.filter(id => id.match(/[R,U][0-9][0-9][0-9][0-9][0-9]/))
    const reactions = generalState.reactionsInSelectArray.filter(reaction => reactionIds.includes(reaction.reactionId))
    const forwardReactions = reactions.filter(reaction => reaction.isForwardReaction)
    const backwardReactions = reactions.filter(reaction => !reaction.isForwardReaction)
    const compoundSet = new Set()

    //adds compound names to stoichiometric coefficients in each reactions
    const reactionObjects = getReactionObjects(forwardReactions, backwardReactions, compoundSet, graphState)

    //creates stoichiometric matrix
    const compoundArray = Array.from(compoundSet)
    const stoichiometricMatrix = []
    const stoichiometricMatrixHeader = ["-"]
    reactionObjects.map(reaction => stoichiometricMatrixHeader.push(reaction.reactionName))
    stoichiometricMatrix.push(stoichiometricMatrixHeader)
    compoundArray.map(compound =>{
        const stoichiometricMatrixLine = []
        stoichiometricMatrixLine.push(compound)
        reactionObjects.map(reaction =>{
            const filteredMetabolites = reaction.metabolites.filter(metabolite => metabolite.id === compound)
            let sc
            if(filteredMetabolites.length === 0){//considered compound is not in the considered reaction
                sc = "0"
            }else if(filteredMetabolites.length === 1){// considered compound is either on substrate side or on product side
                const stoichiometricCoefficients = filteredMetabolites.map(metabolite => metabolite.stoichiometry)
                stoichiometricCoefficients.map(coefficient => {
                    sc = coefficient
                    return null;
                })
            }else if(filteredMetabolites.length>1){ // considered compound is on substrate side and on product side
                const stoichiometricCoefficients = filteredMetabolites.map(metabolite => +metabolite.stoichiometry)
                const coefficientNumbers = stoichiometricCoefficients.filter(coefficient => !isNaN(coefficient))
                if(coefficientNumbers.length === stoichiometricCoefficients.length){ //stoichiometric coefficients are both numbers
                    sc = 0
                    stoichiometricCoefficients.map(coefficient => sc+=coefficient)
                    sc = sc.toString()
                }else if(coefficientNumbers.length === 0){ //stoichiometric coefficients are both strings
                    sc = ""
                    filteredMetabolites.map(metabolite => sc+= metabolite.stoichiometry)
                }else{ //stoichiometric coefficients are string and number
                    sc = ""
                    filteredMetabolites.map(metabolite => sc+= metabolite.stoichiometry)
                }
            }
            stoichiometricMatrixLine.push(sc)
            return sc

        })
        stoichiometricMatrix.push(stoichiometricMatrixLine)
    })

    let output =""
    stoichiometricMatrix.map(line => {
        line.map(item => output+=`${item}\t`)
        output+="\n"
        return null;
    })

    let blob = new Blob(new Array(output.trim()), {type: "text/plain;charset=utf-8"});
    saveAs(blob, "stoichiometricMatrix.csv")
}

const StoichiometricMatrix = (props) => {
    const dispatch = useDispatch();
    return (<div>
            <button disabled={!props.graphState.data.nodes.length>0}  className={"downloadButton"} onClick={()=>fetchStochiometricInformation(dispatch, props)}>stochiometric matrix</button>
        </div>
    );
};

export default StoichiometricMatrix;
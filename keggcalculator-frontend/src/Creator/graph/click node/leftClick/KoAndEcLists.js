import React from "react";
import {useSelector} from "react-redux";

const KoAndEcLists = () => {
    let koNumbers = []
    let ecNumbers = []
    let reactionName = ""
    const graphState = useSelector(state => state.graph)
    const generalState = useSelector(state => state.general)
    const nodeId = graphState.chosenNode
    generalState.reactionsInSelectArray.map(r =>{
        console.log(nodeId + "\t" +  r.reactionId)
        if(r.reactionId === nodeId){
            koNumbers = r.koNumbersString
            ecNumbers = r.ecNumbersString
            reactionName = r.reactionName
        }
        return null
    })
    return(
        <div>
            {reactionName}
            <br/>
            KO- numbers:<ul>
            {koNumbers.map((ko,i) => <li key={ko.concat(i.toString())}>
                {ko}
            </li>)}
            </ul>
            EC: numbers<ul>
            {ecNumbers.map((ec, i)=> <li key={ec.concat(i.toString())}>
                {ec}
            </li>)}
            </ul>
        </div>
    )
}

export default KoAndEcLists
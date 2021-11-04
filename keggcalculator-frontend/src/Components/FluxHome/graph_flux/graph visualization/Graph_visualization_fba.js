import React from "react";
import {Graph} from "react-d3-graph";
import {useDispatch, useSelector} from "react-redux";
import {Card, Table} from "react-bootstrap";
import ReactionInfo from "../click node/leftClick/ReactionInfo";
import {handleSubmit} from "../../../../Creator/keggReaction/substrate and products/SubmitHandler";
import {reaction} from "mobx";
import {handleClick} from "../click node/HandleClick";
import Information from "./Information";
import "./Custom.css"
import GraphVisualization from "../../../../Creator/graph/graph visualization/GraphVisualization";

const onClickNode = (nodeId, graphState, generalState, dispatch) => {

    var nam = nodeId.slice(nodeId.length - 6);
    var abd = "kafi"
    // dispatch({type: "SETCLICKNODE_FBA", payload: nam})
    // dispatch({type: "SWITCHSHOWFBASTRUCTURE"})

    if (nodeId.match(/[R,UP][0-9][0-9][0-9][0-9][0-9]/) != null) {
        dispatch({type: "SETCHOSENNODE", payload: nodeId.substring(nodeId.length - 6, nodeId.length)})
        dispatch({type: "SETSHOWINFO", payload: true})
        //dispatch({type: "SWITCHSHOWFBASTRUCTURE", payload: true})
    }
    if (nodeId.match(/[C,G][0-9][0-9][0-9][0-9][0-9]/) != null) {
        dispatch({type: "SETCHOSENNODE2", payload: nodeId.substring(nodeId.length - 6, nodeId.length)})
        dispatch({type: "SETSHOWINFO2", payload: true})
    }


    console.log(generalState);
    // generalState.reactionsInSelectArray.forEach(reaction =>{
    //     var name = nodeId.slice(nodeId.length - 6);
    //     if(name == reaction.reactionId){
    //         var stateOfgraph = generalState.fbaSolution[name];
    //         flux = generalState.fbaSolution[name].fbaSolution;
    //         handleClick(flux, stateOfgraph, name);
    //         console.log("Clicked");
    //     }
    //     else{
    //         console.log("Not Clicked");
    //     }
    //
    // });
    // the graph configuration, you only need to pass down properties
// that you want to override, otherwise default ones will be used

}

const style = {
    color : 'black',
    textAlign: 'center',
    width: 40,
    marginLeft: 'auto',
    marginRight: 'auto',


}

const Graph_visualization_fba = () =>{

    const graphState = useSelector(state => state.graph)
    const generalState = useSelector(state => state.general)
    const fbaState = useSelector(state => state.fba)
    const dispatch = useDispatch()
    const myConfig = {
        height: 0.75*window.innerHeight,
        width:  0.95*window.innerWidth,
        nodeHighlightBehavior: true,

        directed: true,
        node: {
            size: graphState.nodeSize,

            highlightStrokeColor: "yellow",

        },
        link: {

            //color: "red",
            //strokeWidth:1, //this will change accordingly to flux rate
            linkStrength: 5,
            renderLabel: true,



        },
        d3: {
            gravity: -80,
            linkStrength: 5.0,
            disableLinkForce: graphState.isForceDisabled
        }
    };


    if (generalState.new_data_gen.nodes.length > 0) {
        return (
            <div>
                <div>
                    <Graph
                        bottom={0}
                        id="graph"
                        data={generalState.new_data_gen}
                        config={myConfig}
                        onClickNode={(nodeId) => onClickNode(nodeId, graphState, generalState, dispatch)}

                    />

                </div>
            </div>


        )
    }
    else {
        return (
            <div>

                <div>
                    <GraphVisualization/>
                </div>
            </div>


        )
    }
}

export default Graph_visualization_fba
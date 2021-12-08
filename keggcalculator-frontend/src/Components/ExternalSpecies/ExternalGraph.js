import React from 'react'
import { Graph } from "react-d3-graph";
import {Button} from "@mui/material";
import {dataBuilder} from "./DataBuilder";
import {useDispatch, useSelector} from "react-redux";


const ExternalGraph = () =>{
    const state = useSelector(state => state)
    const fbaState = state.fba
    const dispatch = useDispatch()
    console.log(fbaState.data_circular)
    console.log(fbaState.data_circular.nodes.length == 0)
    var myArray = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]

    const data = {
        nodes: [
            {
                id: "ExternalSpecies",
                color: '#F8F8FF',
                size: 15000,
                symbolType: 'diamond',
                x : 500,
                y : 250,
                labelPosition: 'top',
            },
            ],
        links: [


        ],
    };

// the graph configuration, just override the ones you need
    const myConfig = {
        nodeHighlightBehavior: true,
        height: 800,
        width: 1300,
        //staticGraph: true,
        staticGraphWithDragAndDrop: true,

        d3: {
            gravity: -80,
            linkStrength: 1.2,

        }

    };




    const onRightClickNode = (e, nodeId, dispatch) =>  {
        e.preventDefault()
        dispatch({type: "SWITCHDELETEMODALCIRCULAR"})
        dispatch({type: "SETDELETENODECIRCULAR", payload: nodeId})
    };

    var i = 0
    const handleOnClickButton = () => {
        i = i + 1;
        console.log(i)
        var counter = 0
        dataBuilder(counter, fbaState, dispatch, data.nodes[0])
    }


    return(
      <div className="mainContainerSpec">
          <div className= "graph">
              <Graph
                  id="graph-id" // id is mandatory
                  data={fbaState.data_circular.nodes.length ==0 ? data : fbaState.data_circular}
                  config={myConfig}
                  onRightClickNode={(event, nodeId) => onRightClickNode(event, nodeId, dispatch)}
              />
          </div>


          <div className="button_add">
              <Button onClick={handleOnClickButton}>ADD NEW</Button>
          </div>
      </div>
    );
}
// graph payload (with minimalist structure)

export default ExternalGraph;


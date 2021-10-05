import React from "react";
import "./Flux.css";
import "./interface.css";
import GraphVisualization_flux from "./graph_flux/graph visualization/GraphVisualization_flux";
import Fluxcreate from "./fluxcreate/Fluxcreate";
import FbaSolution from "../../Creator/Flux/FbaSolution";
import Graph_visualization_fba from "./graph_flux/graph visualization/Graph_visualization_fba";
import NodeAndLinks from "./GraphCreator/NodeAndLinks";
import {Button} from "react-bootstrap";
import CreateFBA from "./CreateFBA";
import ModalHeader from "react-bootstrap/ModalHeader";


function FluxHome() {



  return (
    <div>
      <ModalHeader>Flux Analysis</ModalHeader>
      <div className={"interfaceContainer"}>

        <div>
          <button
            className={"downloadButton"}>
            <NodeAndLinks></NodeAndLinks>
            {/*<Graph_visualization_fba/>*/}
          </button>         
        </div>
        <div>
          <button className={"downloadButton"}>
            <FbaSolution></FbaSolution>
            </button>


        </div>
      </div>

      <div className={"main"}>
        <Graph_visualization_fba/>
      </div>




    </div>
  );
}

export default FluxHome;

//export default inject("ModuleStore")(observer(FluxHome))
// export default Module;
//export default FluxHome;

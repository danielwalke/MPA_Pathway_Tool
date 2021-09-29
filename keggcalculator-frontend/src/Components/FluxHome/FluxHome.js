import React from "react";
import "./Flux.css";
import "./interface.css";
import GraphVisualization_flux from "./graph_flux/graph visualization/GraphVisualization_flux";
import Fluxcreate from "./fluxcreate/Fluxcreate";
import FbaSolution from "../../Creator/Flux/FbaSolution";


function FluxHome() {



  return (
    <div>
      <header>Flux Analysis</header>
      <div className={"interfaceContainer"}>
        <div>
          <button
            className={"downloadButton"}>
            <Fluxcreate/>
          </button>         
        </div>
        <div>
          <button
            className={"downloadButton"}>
            Flux visualization
          </button>         
        </div>
        <div>
          <button
            className={"downloadButton"}>
            Flux Upload
          </button>         
        </div>
        <div>
          <button className={"downloadButton"}>
            <FbaSolution></FbaSolution></button>


        </div>
      </div>

      <div className={"main"}>
        <GraphVisualization_flux/>
      </div>
    </div>
  );
}

export default FluxHome;

//export default inject("ModuleStore")(observer(FluxHome))
// export default Module;
//export default FluxHome;

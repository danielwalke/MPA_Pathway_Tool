import React from "react";
import "./Flux.css";
import "./interface.css";
import GraphVisualization from "./graph visualization/GraphVisualization";

function FluxHome() {
  return (
    <div>
      <header>Flux Analysis</header>
      <div className={"interfaceContainer"}>
        <div>
          <button
            className={"downloadButton"}>
            Flux Creation
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
          <button
            className={"downloadButton"}>
            download
          </button>         
        </div>
      </div>

      <div className={"main"}>
        <GraphVisualization/>
      </div>
    </div>
  );
}

export default FluxHome;

//export default inject("ModuleStore")(observer(FluxHome))
// export default Module;
//export default FluxHome;

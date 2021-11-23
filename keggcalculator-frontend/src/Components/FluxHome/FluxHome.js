import React from "react";
import "./Flux.css";
import "./interface.css";

import FbaSolution from "../../Creator/Flux/FbaSolution";
import Graph_visualization_fba from "./graph_flux/graph visualization/Graph_visualization_fba";
import NodeAndLinks from "./GraphCreator/NodeAndLinks";
import {Button} from "react-bootstrap";
import CreateFBA from "./CreateFBA";
import ModalHeader from "react-bootstrap/ModalHeader";
import {useDispatch, useSelector} from "react-redux";
import ReactionInfo from "./graph_flux/click node/leftClick/ReactionInfo";
import NodeInfo from "./graph_flux/click node/leftClick/NodeInfo";
import GraphVisualization from "../../Creator/graph/graph visualization/GraphVisualization";
import {makeStyles, Toolbar} from "@material-ui/core";
import clsx from "clsx";
import MenuIcon from "@material-ui/icons/Menu";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import {Drawer, useTheme} from "@material-ui/core";
import UserInterface from "../../Creator/main/user-interface/UserInterface";
import Information from "./graph_flux/graph visualization/Information";
import DownloadCSV from "./download/DownloadCSV";
import Loading from "../../Creator/loading/Loading";
import StructureModal from "./graph_flux/double click node/StructureModal";
import CircularComponent from "./CircularComponent";

function FluxHome() {
    const [open, setOpen] = React.useState(true)
    const [drawerOffSet, setDrawerOffset] = React.useState(0)
    const graphState = useSelector(state => state.graph)
    const dispatch = useDispatch()
    const proteinState = useSelector(state => state.mpaProteins)
    const generalState = useSelector(state => state.general)
    const fbaState = useSelector(state => state.fba)
    const theme = useTheme()
    const useStyles = makeStyles({
        drawerPaper: {
            position:"relative",
            top: `${drawerOffSet}px`,
            height:"70vh"

        }
    });

    const classes = useStyles()

    console.log(generalState.fbaSolution.length);
          return (
              <div className={"mainContainer"}>

                  {graphState.showInfo ? <ReactionInfo/> : null}
                  {graphState.showInfo2 ? <NodeInfo/> : null}
                  <div className={"main"}>
                      <div className={"interface"}>
                          {/*<ModalHeader>Flux Analysis</ModalHeader>*/}
                          <Toolbar>
                              <IconButton
                                  color="inherit"
                                  aria-label="open drawer"
                                  onClick={() => setOpen(true)}
                                  className={clsx({marginRight: theme.spacing(2)}, open && {display: "none"})}
                              >
                                  {!open && <MenuIcon/>}
                              </IconButton>
                          </Toolbar>
                          <Drawer
                              style={{
                                  width: "20vw",
                                  flexShrink: 0
                              }}
                              variant="persistent"
                              anchor="left"
                              open={open}

                              classes={{
                                  paper: classes.drawerPaper
                              }}
                          >
                              <div className={"interfaceContainer"}>
                                  <IconButton onClick={() => setOpen(false)}>
                                      {<CloseIcon/>}
                                  </IconButton>
                              </div>
                              <StructureModal/>
                              <div>
                                  <button
                                      className={"downloadButton"}>
                                      <NodeAndLinks/>
                                      {/*<Graph_visualization_fba/>*/}
                                  </button>
                              </div>
                              {generalState.fbaSolution.length == 0 ? <Loading/> : null}

                              <div>
                                  <button className={"downloadButton"}>
                                      <FbaSolution/>
                                  </button>


                              </div>
                              <div>
                                  <button className={"downloadButton"}>
                                      <DownloadCSV generalState={generalState} graphState={graphState} fbaState = {fbaState}/>
                                  </button>


                              </div>

                              <div>
                                  <p>Please Click ADD Flux to calculate the Flux</p>
                              </div>

                              <div>
                                  <Information/>
                              </div>


                          </Drawer>
                      </div>
                      <div><CircularComponent/></div>
                      {/*<div className={"graph"}>*/}
                      {/*    {generalState.new_data_gen.nodes.length<0 ? <GraphVisualization/> : <Graph_visualization_fba dispatch = {dispatch}/>}*/}
                      {/*</div>*/}


                      <div className={"graph"}><Graph_visualization_fba dispatch={dispatch}/></div>



                  </div>


              </div>
          );

      // else{
      //     return(
      //         <div>
      //             <ModalHeader>Flux Analysis</ModalHeader>
      //             <div className={"interfaceContainer"}>
      //
      //                 <div>
      //                     <button
      //                         className={"downloadButton"}>
      //                         <NodeAndLinks></NodeAndLinks>
      //                         {/*<Graph_visualization_fba/>*/}
      //                     </button>
      //                 </div>
      //                 <div>
      //                     <button className={"downloadButton"}>
      //                         <FbaSolution></FbaSolution>
      //                     </button>
      //
      //
      //                 </div>
      //             </div>
      //
      //             <div className={"main"}>
      //
      //                 <GraphVisualization></GraphVisualization>
      //             </div>
      //
      //
      //         </div>
      //     );
      // }


}

export default FluxHome;

//export default inject("ModuleStore")(observer(FluxHome))
// export default Module;
//export default FluxHome;

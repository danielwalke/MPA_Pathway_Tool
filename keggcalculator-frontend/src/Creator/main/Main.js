import React, {useEffect} from "react";
import ReactionInfo from "../graph/click node/leftClick/ReactionInfo";
import Loading from "../loading/Loading";
import GraphVisualization from "../graph/graph visualization/GraphVisualization";
import {handleSetCompoundList} from "../request/RequestHandling"
import {useDispatch, useSelector} from "react-redux";
import DeleteModal from "../graph/click node/delete_rightClick/DeleteModal";
import ReactionDetails from "../specReaction/reaction/ReactionDetails";
import StructureModal from "../graph/double click node/StructureModal";
import UserInterface from "./user-interface/UserInterface";
import "./Main.css"
import Sample from "../data-mapping/Sample";
import NextReactionModal from "../graph/click node/leftClick/NextReactionModal";
import KeggReaction from "../keggReaction/main/KeggReaction";
import SpecUserReaction from "../specReaction/main/SpecUserReaction";
import UserInfo from "../graph/help/UserInfo";
import UserCaptionThree from "../data-mapping/UserCaptionThree";
import ModuleListModal from "../keggReaction/multiple reactions/ModuleListModal";
import {requestGenerator} from "../request/RequestGenerator";
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import {Drawer, makeStyles, Toolbar} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import "../download/DownloadGraph.css"
import {
    endpoint_getEcNumberList,
    endpoint_getKoNumberList,
    endpoint_getModuleList, endpoint_getReactionList, endpoint_getTaxonomyList, endpoint_getFbaSolution
} from "../../App Configurations/RequestURLCollection";
import Graph_visualization_fba from "../../Components/FluxHome/graph_flux/graph visualization/Graph_visualization_fba";
//main class for graph visualization and UI for modifying graph
//BUG: API doppelt C00668 bei C00267 => einmal linke Seite, einmal Rechte vllt anpassen in meiner api
//FILTER: in api filter after compounds who only have reactions-> others dont make sense
// const ModuleStore = React.createContext(); //idea for storing all states a separate store
const moduleUrl = endpoint_getModuleList
const ecNumbersUrl = endpoint_getEcNumberList
const koNumbersUrl = endpoint_getKoNumberList
const reactionUrl= endpoint_getReactionList
const taxonomyListLink = endpoint_getTaxonomyList
const fbaSolution = endpoint_getFbaSolution
export const taxonomicRanks = ["superkingdom", "kingdom", "phylum", "class", "order", "family", "genus", "species"]

export const useStylesMain = makeStyles({
    icon: {
        marginLeft: "50vw",
        marginTop:"20vh",
        bottom:"1px",
    },
    drawer: {
        overflow: "auto"
    },
    drawerPaper: {
        height: "20vh"
    },
    indicator: {
        backgroundColor:"red"
    }
});

const Main = () => {
    const [open, setOpen] = React.useState(false)

    const graphState = useSelector(state => state.graph)
    const dispatch = useDispatch()
    const proteinState = useSelector(state => state.mpaProteins)
    const generalState = useSelector(state => state.general)
    const exit = () => "Are you sure you want to exit?"
    useEffect(() => {     //first effect triggered after page loads first time (componentDidMount)
            dispatch({type: "SWITCHLOADING"})
            handleSetCompoundList(dispatch)
            requestGenerator("GET", ecNumbersUrl, "", "").then(response => dispatch({
                type: "SETECNUMBERSET",
                payload: response.data
            }))
            requestGenerator("GET", koNumbersUrl, "", "").then(response => dispatch({
                type: "SETKONUMBERSET",
                payload: response.data
            }))
            requestGenerator("GET", moduleUrl, "", "").then(response => dispatch({
                type: "SETMODULELIST",
                payload: response.data
            }))
        requestGenerator("GET", reactionUrl, "","").then(resp=>{
            dispatch({type:"SETKEGGREACTIONS", payload: resp.data})

        })
        // requestGenerator("GET", fbaSolution, "", "").then(resp=>{
        //     dispatch({type:"SETFLUXREACTION", payload: resp.data})
        // })
            window.onbeforeunload = exit

        }, []
    )

    const classes = useStylesMain()

    return (
        <div className={"mainContainer"}>
            <Loading className={"loadingContainer"}/>
            <ModuleListModal/>
            <KeggReaction/>
            <SpecUserReaction/>
            <NextReactionModal/>
            <UserInfo/>
            {graphState.showInfo ? <ReactionInfo/> : null}
            <StructureModal/>
            <DeleteModal/>
            <ReactionDetails/>
            <div className={"main"}>
                <div className={"interface"}><UserInterface/></div>
                <div className={"graph"}>
                    <GraphVisualization dispatch={dispatch}/>

                </div>

                <div className={open? "footer" :  ""}>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            edge={"end"}
                            aria-label="open drawer"
                            onClick={() => {
                                setOpen(true)
                            }}
                            className={classes.icon}

                        >
                            <ExpandLessIcon/>
                        </IconButton>
                    </Toolbar>
                    {proteinState.proteinSet.size > 0 && <UserCaptionThree/>}
                    <Drawer
                        style={{
                            flexShrink: 0
                        }}
                        className={classes.drawer}
                        variant="persistent"
                        anchor="bottom"
                        open={open}
                        classes={
                            {paper: classes.drawerPaper}
                        }
                    >
                        <IconButton onClick={() => {
                            setOpen(false)
                        }}>
                            {<CloseIcon/>}
                        </IconButton>
                        <div>
                            {proteinState.proteinSet.size === 0 && <h4>Waiting for experimental data...</h4>}
                        </div>
                        <Sample/>
                    </Drawer>
                </div>
            </div>

        </div>
    )
}
export default Main

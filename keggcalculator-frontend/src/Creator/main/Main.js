import React, {useEffect} from "react";
import ReactionInfo from "../graph/ReactionInfo";
import Loading from "../loading/Loading";
import GraphVisualization from "../graph/GraphVisualization";
import {handleSetCompoundList} from "../request/RequestHandling"
import {useDispatch, useSelector} from "react-redux";
import DeleteModal from "../delete/DeleteModal";
import ReactionDetails from "../specReaction/ReactionDetails";
import StructureModal from "../graph/StructureModal";
import UserInterface from "./UserInterface";
import "./Main.css"
import Sample from "../upload/Sample";
import NextReactionModal from "../keggReaction/NextReactionModal";
import KeggReaction from "../keggReaction/KeggReaction";
import SpecUserReaction from "../specReaction/SpecUserReaction";
import UserInfo from "../graph/UserInfo";
import UserCaptionThree from "../upload/UserCaptionThree";
import ModuleListModal from "./ModuleListModal";
import {requestGenerator} from "../request/RequestGenerator";
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import {Drawer, makeStyles, Toolbar, useTheme} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
//main class for graph visualization and UI for modifying graph
//BUG: API doppelt C00668 bei C00267 => einmal linke Seite, einmal Rechte vllt anpassen in meiner api
//FILTER: in api filter after compounds who only have reactions-> others dont make sense
// const ModuleStore = React.createContext(); //idea for storing all states a separate store
const moduleUrl = "http://127.0.0.1/keggcreator/modulelist"
const ecNumbersUrl = "http://127.0.0.1/keggcreator/ecnumberlist"
const koNumbersUrl = "http://127.0.0.1/keggcreator/konumberlist"
const reactionUrl= "http://127.0.0.1/keggcreator/reactions"
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
            window.onbeforeunload = exit
        }, [dispatch]
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

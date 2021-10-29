import React, {useEffect} from "react";
import GraphVisualization from "../graph/graph visualization/GraphVisualization";
import {useDispatch} from "react-redux";
import UserInterface from "./user-interface/UserInterface";
import "./Main.css"
import {makeStyles} from "@material-ui/core";
import "../download/DownloadGraph.css"
import {queryKeggInformation} from "./lib/Fetching";
import SampleFooter from "./components/SampleFooter";
import {triggerWindowExitWarning, isHostLocalHost, triggerLoadingWarning} from "./lib/LoadingWarning";
//BUG: API doppelt C00668 bei C00267 => einmal linke Seite, einmal Rechte vllt anpassen in meiner api

export const taxonomicRanks = ["superkingdom", "kingdom", "phylum", "class", "order", "family", "genus", "species"]

export const useStylesMain = makeStyles({
    icon: {
        marginLeft: "50vw",
        marginTop: "20vh",
        bottom: "1px",
    },
    drawer: {
        overflow: "auto"
    },
    drawerPaper: {
        height: "20vh"
    },
    indicator: {
        backgroundColor: "red"
    }
});

const Main = () => {

    const dispatch = useDispatch()

    useEffect(async () => {
            triggerLoadingWarning(dispatch)
            await queryKeggInformation(dispatch)
            if (!isHostLocalHost) triggerWindowExitWarning()
        }, [])

    return (
        <div className={"mainContainer"}>
            <div className={"main"}>
                <UserInterface/>
                <GraphVisualization/>
                <SampleFooter/>
            </div>
        </div>
    )
}
export default Main

import React, {useEffect, useState} from "react";
import {Drawer, makeStyles, Toolbar, useTheme} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import clsx from "clsx";
import MenuIcon from "@material-ui/icons/Menu";
import {ToolTipBig} from "../../Creator/main/user-interface/UserInterface";
import CloseIcon from "@material-ui/icons/Close";
import "../../Creator/main/user-interface/UserInterface.css"
import {getDummyFluxData} from "../services/DummyFlux";
import {useDispatch, useSelector} from "react-redux";
import {createFbaGraphData, createFbaGraphDummyData} from "../services/CreateFbaGraphData";
import {parseRequestArray} from "../services/ParseRequestArray";
import {requestGenerator} from "../../Creator/request/RequestGenerator";
import {endpoint_postNetworkForFBA} from "../../App Configurations/RequestURLCollection";

export default function FluxAnalysisUserInterface() {
    const [open, setOpen] = useState(true)
    const [drawerOffSet, setDrawerOffset] = useState(0)

    const dispatch = useDispatch()
    const generalState = useSelector(state => state.general)
    const fluxState = useSelector(state => state.fluxAnalysis)
    const graphState = useSelector(state => state.graph)

    const theme = useTheme()
    const useStyles = makeStyles({
        drawerPaper: {
            position: "absolute",
            top: `${drawerOffSet}px`,
            height: "80vh"
        }
    });
    const classes = useStyles()

    useEffect(() => {
        const headerHeight = document.getElementsByClassName(
            'MuiPaper-root MuiAppBar-root MuiAppBar-positionStatic MuiAppBar-colorPrimary MuiPaper-elevation4')[0].clientHeight;
        const tabHeight = document.getElementsByClassName("MuiTabs-root")[0].clientHeight
        setDrawerOffset(tabHeight + headerHeight)
    }, [])

    const handleOptimizeClick = async () => {
        const requestReactionObj = await parseRequestArray(generalState.reactionsInSelectArray)
        const response = await requestGenerator(
            "POST", endpoint_postNetworkForFBA, "", "", requestReactionObj)
        const newGraphData = createFbaGraphData(fluxState, response.data)

        // const dummyDataResponse = await getDummyFluxData(generalState.reactionsInSelectArray)
        // const newGraphData = createFbaGraphDummyData(fluxState, dummyDataResponse.data)

        const newReactionsInSelectArray = [...generalState.reactionsInSelectArray]
        newReactionsInSelectArray.forEach(reaction => {
            const fluxObj = response.data.find(flux =>
                Object.keys(flux)[0] === reaction.reactionId)
            console.log(fluxObj)
            reaction.flux = fluxObj[Object.keys(fluxObj)[0]].fbaSolution
        })
        dispatch({type: "SET_FLUX_GRAPH", payload: newGraphData.data})
        dispatch({type: "SETREACTIONSINARRAY", payload: newReactionsInSelectArray})
    }

    return(
        <div className={"interface"}>
            <Toolbar>
                <ToolTipBig title={"Click to open the menu"} placement={"right"}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={() => setOpen(true)}
                        className={clsx({marginRight: theme.spacing(2)}, open && {display: "none"})}
                    >
                        {!open && <MenuIcon/>}
                    </IconButton>
                </ToolTipBig>
            </Toolbar>
            <Drawer
                variant="persistent"
                anchor="left"
                open={open}
                classes={{paper: classes.drawerPaper}}>
                <div className={"interfaceContainer"} style={{width: "20vw", flexShrink: 0}}>
                    <div style={{display:"flex", justifyContent:"center"}}>
                        <ToolTipBig title={"Click for closing the menu"} placement={"right"}>
                            <IconButton onClick={() => setOpen(false)}>
                                {<CloseIcon/>}
                            </IconButton>
                        </ToolTipBig>
                    </div>
                    <div className={"helpContainer"}>
                        <ToolTipBig title={"perform FBA and FVA for the displayed network"} placement={"right"}>
                            <button className={"download-button"} onClick={() => handleOptimizeClick()}>
                                Optimize
                            </button>
                        </ToolTipBig>
                    </div>
                </div>
            </Drawer>
        </div>
    )
}

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
import FluxBalanceAnalysis from "../flux-analysis-fba/FluxBalanceAnalysis";
import Loading from "../../Creator/loading/Loading";
import DownloadFbaResults from "../flux-analysis-download/DownloadFbaResults";

export default function FluxAnalysisUserInterface() {
    const [open, setOpen] = useState(true)
    const [drawerOffSet, setDrawerOffset] = useState(0)

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

    return(
        <div className={"interface"}>
            <Loading />
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
                    <FluxBalanceAnalysis />
                    <DownloadFbaResults />
                </div>
            </Drawer>
        </div>
    )
}
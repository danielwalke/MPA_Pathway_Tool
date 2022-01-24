import React, {useEffect, useState} from "react";
import {Drawer, makeStyles, Toolbar, useTheme} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import clsx from "clsx";
import MenuIcon from "@material-ui/icons/Menu";
import {ToolTipBig} from "../../Creator/main/user-interface/UserInterface";
import CloseIcon from "@material-ui/icons/Close";
import "../../Creator/main/user-interface/UserInterface.css"
import FluxBalanceAnalysis from "../flux-analysis-fba/FluxBalanceAnalysis";
import Loading from "../../Creator/loading/Loading";
import DownloadFbaResults from "../flux-analysis-download/DownloadFbaResults";
import {FBAWithAutopacmen} from "../flux-analysis-fba/FBAWithAutopacmen";
import ChangeDisplayedFBAResults from "../flux-analysis-fba/ChangeDisplayedFbaResults";
import {convertReactionArray} from "../../Creator/upload/annotationModal/convertReactionarray";
import {useDispatch, useSelector} from "react-redux";
import FluxAnalysisModal from "./FluxAnalysisModal";


function checkReactionArray(reactionArray, setDisableOptimizeButton) {
    if (typeof reactionArray === "undefined" || reactionArray.length === 0) {
        setDisableOptimizeButton(true)
    } else {
        setDisableOptimizeButton(false)
    }
}

export default function FluxAnalysisUserInterface(props) {
    const [open, setOpen] = useState(true)
    const [drawerOffSet, setDrawerOffset] = useState(0)
    const [disableOptimizeButton, setDisableOptimizeButton] = useState(true)

    const fluxState = useSelector(state => state.fluxAnalysis)

    const dispatch = useDispatch()

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

    useEffect(() => {
        checkReactionArray(props.reactionArray, setDisableOptimizeButton);
    },[props.reactionArray])

    return(
        <div className={"interface"}>
            <Loading />
            {fluxState.showFluxAnalysisModal && <FluxAnalysisModal/>}
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
                    <FluxBalanceAnalysis
                        disableOptimizeButton={disableOptimizeButton}
                        setDisableOptimizeButton={setDisableOptimizeButton}/>
                    <FBAWithAutopacmen
                        disableOptimizeButton={disableOptimizeButton}
                        setDisableOptimizeButton={setDisableOptimizeButton}/>
                    <DownloadFbaResults />
                    <ChangeDisplayedFBAResults />
                    <div>
                        <ToolTipBig title={"Annotate network compounds and reactions"} placement={"right"}>
                            <button className={"download-button"}
                                    // disabled={!fluxState.flux}
                                    onClick={() => {
                                        dispatch({type: "SHOW_FLUX_ANALYSIS_MODAL", payload: true})
                                        dispatch({type: "SHOW_FBA_RESULT_TABLE", payload: true})
                                    }}>
                                FBA Result Table
                            </button>
                        </ToolTipBig>
                    </div>
                </div>
            </Drawer>
        </div>
    )
}

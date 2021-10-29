import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import "./UserInterface.css"
import DonwloadModal from "../../download/DonwloadModal";
import UploadModal from "../../upload/main/UploadModal";
import MultiReactionModal from "../../keggReaction/multiple reactions/MultiReactionModal";
import NodeConfigurationModal from "../../graph/configurations/NodeConfigurationModal";
import TextField from "@material-ui/core/TextField";
import {Drawer, makeStyles, Toolbar, useTheme, withStyles} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import clsx from "clsx";
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import "../../download/DownloadGraph.css"
import Tooltip from '@material-ui/core/Tooltip';
import Loading from "../../loading/Loading";
import ModuleListModal from "../../keggReaction/multiple reactions/ModuleListModal";
import KeggReaction from "../../keggReaction/main/KeggReaction";
import SpecUserReaction from "../../specReaction/main/SpecUserReaction";
import NextReactionModal from "../../graph/click node/leftClick/NextReactionModal";
import UserInfo from "../../graph/help/UserInfo";
import StructureModal from "../../graph/double click node/StructureModal";
import DeleteModal from "../../graph/click node/delete_rightClick/DeleteModal";
import ReactionDetails from "../../specReaction/reaction/ReactionDetails";
import ReactionInfo from "../../graph/click node/leftClick/ReactionInfo";

export const ToolTipBig = withStyles({
    tooltip: {
        color: "white",
        backgroundColor: "rgb(150, 25, 130)",
        fontSize: "0.8em"
    }
})(Tooltip);

const UserInterface = () => {
    const [open, setOpen] = React.useState(true)
    const [drawerOffSet, setDrawerOffset] = React.useState(0)
    const [coordinates, setCoordinates] = React.useState({x: 0, y: 0})
    const graphState = useSelector(state => state.graph)
    const dispatch = useDispatch()

    useEffect(() => {
        const headerHeight = document.getElementsByClassName('MuiPaper-root MuiAppBar-root MuiAppBar-positionStatic MuiAppBar-colorPrimary MuiPaper-elevation4')[0].clientHeight;
        const tabHeight = document.getElementsByClassName("MuiTabs-root")[0].clientHeight
        setDrawerOffset(tabHeight + headerHeight)
    }, [])

    useEffect(() => {
        setCoordinates({x: graphState.chosenCompound.x, y: graphState.chosenCompound.y})
    }, [graphState.chosenCompound])


    const handleShowSpecReaction = () => {
        dispatch({type: "SWITCHSHOWSPECIFICREACTION"})
    }
    const handleShowKeggReaction = () => {
        dispatch({type: "SWITCHSHOWKEGGREACTION"})
    }

    const handleXChange = async (value) => {
        await dispatch({type: "SETDATA", payload: {nodes: [], links: []}})
        graphState.data.nodes.push({
            id: `${graphState.chosenCompound.id}`,
            opacity: graphState.chosenCompound.opacity,
            symbolType: graphState.chosenCompound.symbolType,
            color: graphState.chosenCompound.color,
            x: +value,
            y: +graphState.chosenCompound.y,
            reversible: graphState.chosenCompound.reversible
        })
        setCoordinates(prevCoordinates => ({x: value, y: prevCoordinates.y}))
        const data = {nodes: graphState.data.nodes, links: graphState.oldData.links}
        await dispatch({type: "SETDATA", payload: data})
    }

    const handleYChange = async (value) => {
        await dispatch({type: "SETDATA", payload: {nodes: [], links: []}})
        graphState.data.nodes.push({
            id: `${graphState.chosenCompound.id}`,
            opacity: graphState.chosenCompound.opacity,
            symbolType: graphState.chosenCompound.symbolType,
            color: graphState.chosenCompound.color,
            x: +graphState.chosenCompound.x,
            y: +value,
            reversible: graphState.chosenCompound.reversible
        })
        const data = {nodes: graphState.data.nodes, links: graphState.oldData.links}
        setCoordinates(prevCoordinates => ({x: prevCoordinates.x, y: value}))
        await dispatch({type: "SETDATA", payload: data})
    }
    // const compound = typeof graphState.data.nodes.filter(node => node.id === graphState.doubleClickNode)[0] === "undefined" ? {} : graphState.data.nodes.filter(node => node.id === graphState.doubleClickNode)[0]

    const theme = useTheme()
    const useStyles = makeStyles({
        drawerPaper: {
            position: "absolute",
            top: `${drawerOffSet}px`,
            height: "80vh"
        }
    });

    const classes = useStyles()
    return (
        <div className={"interface"}>
            <Loading className={"loadingContainer"}/>
            <ModuleListModal/>
            {graphState.showInfo ? <ReactionInfo/> : null}
            <KeggReaction/>
            <SpecUserReaction/>
            <NextReactionModal/>
            <UserInfo/>
            <StructureModal/>
            <DeleteModal/>
            <ReactionDetails/>
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
                style={{
                    width: "30vw",
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
                    <ToolTipBig title={"Click for closing the menu"} placement={"right"}>
                        <IconButton onClick={() => setOpen(false)}>
                            {<CloseIcon/>}
                        </IconButton>
                    </ToolTipBig>
                    <div className={"uploadFilesContainer"}>
                        <div>
                            <ToolTipBig title={"Click for entering the upload section"} placement={"right"}>
                                <button className={"downloadButton"}
                                        onClick={() => dispatch({type: "SWITCHUPLOADMODAL"})}>Upload
                                </button>
                            </ToolTipBig>
                            <UploadModal setOpen={setOpen}/>
                        </div>
                    </div>
                    <div className={"helpContainer"}>
                        <ToolTipBig title={"Click for receiving help"} placement={"right"}>
                            <button className={"downloadButton"}
                                    onClick={() => {
                                        dispatch({type: "ADD_HELP_TO_AUDIT_TRAIL"})
                                        dispatch({type: "SWITCHSHOWUSERINFO"})
                                    }}>Help
                            </button>
                        </ToolTipBig>
                    </div>
                    <div>
                        <ToolTipBig title={"Click for changing the visualization of the pathway"} placement={"right"}>
                            <button className={"downloadButton"}
                                    onClick={() => {
                                        dispatch({type: "SWITCHNODECONFIGURATIONMODAL"})
                                    }}>node configurations
                            </button>
                        </ToolTipBig>
                        <NodeConfigurationModal/>
                    </div>
                    <div className={"keggReaction"}>
                        <ToolTipBig title={"Click for adding a reaction from KEGG"} placement={"right"}>
                            <button className={"downloadButton"}
                                    onClick={handleShowKeggReaction}>Add Kegg
                                Reaction
                            </button>
                        </ToolTipBig>
                    </div>
                    <div className={"userReaction"}>
                        <ToolTipBig title={"Click for defining your own reaction"} placement={"right"}>
                            <button className={"downloadButton"}
                                    onClick={handleShowSpecReaction}>Add User-defined
                                Reaction
                            </button>
                        </ToolTipBig>
                    </div>
                    <div>
                        <ToolTipBig title={"Click for importing multiple reactions"} placement={"right"}>
                            <button className={"downloadButton"}
                                    onClick={() => dispatch({type: "SWITCHMULTIREACTIONMODAL"})}>import multiple
                                reactions
                            </button>
                        </ToolTipBig>
                        <MultiReactionModal/>
                    </div>
                    <div className={"downloadContainer"}>
                        <div>
                            <ToolTipBig title={"Click for importing multiple reactions"} placement={"right"}>
                                <button className={"downloadButton"}
                                        onClick={() => dispatch({type: "SWITCHDOWNLOADMODAL"})}>Download
                                </button>
                            </ToolTipBig>
                        </div>
                        <DonwloadModal/>
                    </div>
                    {graphState.doubleClickNode.length > 0 &&
                    <div style={{width: "15vw", height: "25vh", overflow: "auto", margin: "3px"}}>
                        {graphState.chosenCompound.id}
                        <div>x:</div>
                        <ToolTipBig title={"x-coordinate for chosen node"} placement={"right"}>
                            <TextField type={"number"} id={"x coordinates"}
                                       value={coordinates.x}
                                       onChange={(e) => {
                                           handleXChange(e.target.value)
                                       }}/>
                        </ToolTipBig>
                        <div>y:</div>
                        <ToolTipBig title={"y-coordinate for chosen node"} placement={"right"}>
                            <TextField type={"number"} id={"y coordinates"}
                                       value={coordinates.y}
                                       onChange={(e) => {
                                           handleYChange(e.target.value)
                                           // dispatch({type: "SETY", payload: e.target.value})
                                       }}/>
                        </ToolTipBig>

                    </div>}
                </div>
            </Drawer>
        </div>

    )

}
export default UserInterface

import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import "./UserInterface.css"
import DonwloadModal from "../../download/DonwloadModal";
import UploadModal from "../../upload/main/UploadModal";
import MultiReactionModal from "../../keggReaction/multiple reactions/MultiReactionModal";
import NodeConfigurationModal from "../../graph/configurations/NodeConfigurationModal";
import TextField from "@material-ui/core/TextField";
import {Drawer, makeStyles, Toolbar, useTheme} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import clsx from "clsx";
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import "../../download/DownloadGraph.css"

const UserInterface = () => {
    const [open, setOpen] = React.useState(true)
    const [drawerOffSet, setDrawerOffset] = React.useState(0)
    const [coordinates, setCoordinates] = React.useState({x:0, y:0})
    const graphState = useSelector(state => state.graph)
    const dispatch = useDispatch()

    useEffect(()=>{
        const headerHeight = document.getElementsByClassName('MuiPaper-root MuiAppBar-root MuiAppBar-positionStatic MuiAppBar-colorPrimary MuiPaper-elevation4')[0].clientHeight;
        const tabHeight = document.getElementsByClassName("MuiTabs-root")[0].clientHeight
        setDrawerOffset(tabHeight+headerHeight)
    },[])

    useEffect(()=>{
        setCoordinates({x: graphState.chosenCompound.x,y: graphState.chosenCompound.y})
    },[graphState.chosenCompound])


    const handleShowSpecReaction = () => {
        dispatch({type: "SWITCHSHOWSPECIFICREACTION"})
    }
    const handleShowKeggReaction = () => {
        dispatch({type: "SWITCHSHOWKEGGREACTION"})
    }

    const handleXChange = async(value) => {
        await dispatch({type: "SETDATA", payload: {nodes:[], links:[]}})
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

    const handleYChange = async(value) => {
        await dispatch({type: "SETDATA", payload: {nodes:[], links:[]}})
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
            position:"absolute",
            top: `${drawerOffSet}px`,
            height:"80vh"

        }
    });

    const classes = useStyles()
    return (
        <div>
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
                    <IconButton onClick={() => setOpen(false)}>
                        {<CloseIcon/>}
                    </IconButton>
                    <div className={"uploadFilesContainer"}>
                        <div>
                            <button className={"downloadButton"}
                                    onClick={() => dispatch({type: "SWITCHUPLOADMODAL"})}>Upload
                            </button>
                            <UploadModal/>
                        </div>
                    </div>
                    <div className={"helpContainer"}>
                        <button className={"downloadButton"}
                                onClick={() => {
                                    dispatch({type:"ADD_HELP_TO_AUDIT_TRAIL"})
                                    dispatch({type: "SWITCHSHOWUSERINFO"})
                                }}>Help
                        </button>
                    </div>
                    <div>
                        <button className={"downloadButton"} onClick={() => {
                            dispatch({type: "SWITCHNODECONFIGURATIONMODAL"})
                        }}>node configurations
                        </button>
                        <NodeConfigurationModal/>
                    </div>
                    <div className={"keggReaction"}>
                        <button className={"downloadButton"} onClick={handleShowKeggReaction}>Kegg
                            Reactions
                        </button>
                    </div>
                    <div className={"userReaction"}>
                        <button className={"downloadButton"} onClick={handleShowSpecReaction}>User-defined
                            Reactions
                        </button>
                    </div>
                    <div>
                        <button className={"downloadButton"}
                                onClick={() => dispatch({type: "SWITCHMULTIREACTIONMODAL"})}>import multiple reactions
                        </button>
                        <MultiReactionModal/>
                    </div>
                    <div className={"downloadContainer"}>
                        <div>
                            <button className={"downloadButton"}
                                    onClick={() => dispatch({type: "SWITCHDOWNLOADMODAL"})}>Download
                            </button>
                        </div>
                        <DonwloadModal/>
                    </div>
                    {graphState.doubleClickNode.length > 0 && <div style={{width:"15vw", height:"25vh", overflow:"auto", margin:"3px"}}>
                        {graphState.chosenCompound.id}
                        <div>x:</div>
                        <TextField type={"number"} id={"x coordinates"}
                                   value={coordinates.x}
                                   onChange={(e) => {
                                       handleXChange(e.target.value)
                                   }}/>
                        <div>y:</div>
                        <TextField type={"number"} id={"y coordinates"}
                                   value={coordinates.y}
                                   onChange={(e) => {
                                       handleYChange(e.target.value)
                                       // dispatch({type: "SETY", payload: e.target.value})
                                   }}/>
                    </div>}
                </div>
            </Drawer>
        </div>

    )

}
export default UserInterface

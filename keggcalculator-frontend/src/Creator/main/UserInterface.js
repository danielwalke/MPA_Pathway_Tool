import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import "./UserInterface.css"
import DonwloadModal from "../download/DonwloadModal";
import UploadModal from "../upload/UploadModal";
import MultiReactionModal from "../keggReaction/MultiReactionModal";
import NodeConfigurationModal from "../graph/NodeConfigurationModal";
import TextField from "@material-ui/core/TextField";
import {Drawer, makeStyles, Toolbar, useTheme} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import clsx from "clsx";
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';

const UserInterface = () => {
    const [open, setOpen] = React.useState(true)
    const [drawerOffSet, setDrawerOffset] = React.useState(0)
    const state = useSelector(state => state.general)
    const keggState = useSelector(state=> state.keggReaction)
    const graphState = useSelector(state => state.graph)
    const dispatch = useDispatch()
    useEffect(()=>{
        const headerHeight = document.getElementsByClassName('MuiPaper-root MuiAppBar-root MuiAppBar-positionStatic MuiAppBar-colorPrimary MuiPaper-elevation4')[0].clientHeight;
        const tabHeight = document.getElementsByClassName("MuiTabs-root")[0].clientHeight
        setDrawerOffset(tabHeight+headerHeight)
    },[])
    const handleShowSpecReaction = () => {
        dispatch({type: "SWITCHSHOWSPECIFICREACTION"})
    }
    const handleShowKeggReaction = () => {
        dispatch({type: "SWITCHSHOWKEGGREACTION"})
    }
    const handleDelete = () => {
        const newDataNodes = graphState.data.nodes.filter(node => node.id !== compound.id)
        const sourceLinks = graphState.data.links.filter(links => links.source !== compound.id)
        const newLinks = sourceLinks.filter(links => links.target !== compound.id)
        const newData = {nodes: newDataNodes, links: newLinks}
        dispatch({type: "SETDATA", payload: newData})
    }
    const handleXChange = () => {
        graphState.data.nodes.push({
            id: `${graphState.chosenCompound.id}`,
            opacity: graphState.chosenCompound.opacity,
            symbolType: graphState.chosenCompound.symbolType,
            color: graphState.chosenCompound.color,
            x: +graphState.x,
            y: +graphState.y
        })
        const data = {nodes: graphState.data.nodes, links: graphState.oldData.links}
        dispatch({type: "SETDATA", payload: data})
    }
    const compound = typeof graphState.data.nodes.filter(node => node.id === graphState.doubleClickNode)[0] === "undefined" ? {} : graphState.data.nodes.filter(node => node.id === graphState.doubleClickNode)[0]
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
                {/*<div style={{*/}
                {/*    display: 'flex',*/}
                {/*    alignItems: 'center',*/}
                {/*    justifyContent: 'flex-end',*/}
                {/*    padding: theme.spacing(0, 1),*/}
                {/*}}>*/}
                {/*  */}
                {/*</div>*/}
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
                                onClick={() => dispatch({type: "SWITCHSHOWUSERINFO"})}>Help
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
                        {compound.id}
                        <div>x:</div>
                        <TextField type={"text"} id={"x coordinates"}
                                   defaultValue={graphState.chosenCompound.x.toString()}
                                   onChange={(e) => {
                                       handleDelete()
                                       dispatch({type: "SETX", payload: e.target.value})
                                   }}/>
                        <div>y:</div>
                        <TextField type={"text"} id={"y coordinates"}
                                   defaultValue={graphState.chosenCompound.y.toString()}
                                   onChange={(e) => {
                                       handleDelete()
                                       dispatch({type: "SETY", payload: e.target.value})
                                   }}/>
                        <button className={"downloadButton"} onClick={() => handleXChange()}>submit coordinates</button>
                    </div>}
                </div>
            </Drawer>
        </div>

    )

}
export default UserInterface
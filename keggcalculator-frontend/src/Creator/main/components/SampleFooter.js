import React from 'react';
import {useSelector} from "react-redux";
import {Drawer, Toolbar} from "@material-ui/core";
import {ToolTipBig} from "../user-interface/UserInterface";
import IconButton from "@material-ui/core/IconButton";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import UserCaptionThree from "../../data-mapping/UserCaptionThree";
import CloseIcon from "@material-ui/icons/Close";
import Sample from "../../data-mapping/Sample";
import {useStylesMain} from "../Main";

const SampleFooter = () => {
    const [open, setOpen] = React.useState(false)
    const proteinState = useSelector(state => state.mpaProteins)

    const classes = useStylesMain()
    return (
        <div className={open ? "footer" : ""}>
            <Toolbar>
                <ToolTipBig title={"Click to open the mapping user-interface"} placement={"top"}>
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
                </ToolTipBig>
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
                <ToolTipBig title={"Click to close the mapping user-interface"} placement={"top"}>
                    <IconButton onClick={() => {
                        setOpen(false)
                    }}>
                        {<CloseIcon/>}
                    </IconButton>
                </ToolTipBig>
                <div>
                    {proteinState.proteinSet.size === 0 && <h4>Waiting for experimental data...</h4>}
                </div>
                <Sample/>
            </Drawer>
        </div>
    );
};

export default SampleFooter;

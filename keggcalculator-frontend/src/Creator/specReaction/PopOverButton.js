import {Popover} from "@material-ui/core";
import SyncAltIcon from "@material-ui/icons/SyncAlt";
import React, {useState} from "react";
import {makeStyles} from "@material-ui/styles";
import {useDispatch} from "react-redux";

const PopOverButton =(props)=>{
    const [openCompoundPopOver, setOpenCompoundPopOver] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null)
    const dispatch = useDispatch()
    const useStyles = makeStyles((theme) => ({
        popover: {
            pointerEvents: 'none',
        },
        paper: {
            padding: theme.spacing(1),
        },
    }))
    const classes = useStyles()
    return(
        <div>
            <Popover
                id="mouse-over-popover"
                className={classes.popover}
                classes={{
                    paper: classes.paper,
                }}
                open={openCompoundPopOver}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                // onClose={handlePopoverClose}
                disableRestoreFocus
            >
                {props.text}
            </Popover>
            <button
                onMouseLeave={e=> {
                    setOpenCompoundPopOver(false)
                    setAnchorEl(e.currentTarget)
                }}
                className={"notFoundButton"} style={{width:"90%"}} onMouseOver={e => {
                setOpenCompoundPopOver(true)
                setAnchorEl(e.currentTarget)
            }}
                onClick={() => dispatch({type: props.dispatchType})}>    <SyncAltIcon/></button>
        </div>
    )
}

export default PopOverButton
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {Snackbar, Typography} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

const Loading = () =>{
    const state = useSelector(state => state.general)
   return(<div>
       <SnackbarLoader state={state}/>
       {/*<Card style={{bottom: "-10vh",left:"0", position: 'absolute', zIndex: "2000000000", display:"flex"}}><ClipLoader*/}
       {/*                  size={"5vh"}*/}
       {/*                  loading={state.loading}/><div>Loading..</div></Card>*/}
   </div> )
}

export default Loading

const SnackbarLoader = ({state}) =>{
    const dispatch = useDispatch()

    return (
        <div>
            {state.loading &&
            <Snackbar anchorOrigin={{vertical: "bottom", horizontal: "left"}}
                      open={state.loading}
                      message={
                          <div>
                              {state.loading && <div style={{display: "flex"}}>
                                  <Typography style={{display: "flex", alignItems: "center"}}>Loading...</Typography>
                                  &nbsp;&nbsp;
                                  <CircularProgress/>
                              </div>}
                          </div>
                      }
                      action={state.loading && <div>
                          <IconButton size="small" aria-label="close" color="inherit" onClick={() => dispatch({type:"SWITCHLOADING"})}>
                              <CloseIcon fontSize="small" />
                          </IconButton>
                      </div>}
            />}
        </div>
    )
}
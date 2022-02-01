import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {Snackbar, Typography} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

export default function Loading(props) {
    const state = useSelector(state => state.general)

    const loaderLabel = props.label ? props.label : "Loading..."

    return (
        <div>
            <SnackbarLoader state={state} label={loaderLabel}/>
        </div>
    )
}

const SnackbarLoader = ({state, label}) => {
    const dispatch = useDispatch()
    console.log(label)
    return (
        <div>
            {state.loading &&
                <Snackbar anchorOrigin={{vertical: "bottom", horizontal: "left"}}
                          open={state.loading}
                          message={
                              <div>
                                  {
                                      state.loading &&
                                      <div style={{display: "flex"}}>
                                          <Typography
                                              style={{display: "flex", alignItems: "center"}}>{label}</Typography>
                                          &nbsp;&nbsp;
                                          <CircularProgress/>
                                      </div>
                                  }
                              </div>
                          }
                          action={
                              state.loading &&
                              <div>
                                  <IconButton size="small" aria-label="close" color="inherit"
                                              onClick={() => dispatch({type: "SWITCHLOADING"})}>
                                      <CloseIcon fontSize="small"/>
                                  </IconButton>
                              </div>
                          }
                />
            }
        </div>
    )
}

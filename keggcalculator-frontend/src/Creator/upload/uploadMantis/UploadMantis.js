import React from 'react';
import {ToolTipBig} from "../../main/user-interface/UserInterface";
import UploadIcon from "../../icons/uploadIconWhite.svg";
import {useDispatch, useSelector} from "react-redux";
import {onMantisFileChange, startMantisJob} from "./lib";
import {Snackbar, Typography} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import {requestGenerator} from "../../../Request Generator/RequestGenerator";
import {saveAs} from "file-saver"

const UploadMantis = () => {
    const dispatch = useDispatch()
    const mantisState = useSelector(state => state.mantis)
    const generalState = useSelector(state => state.general)

    const handleDownload =() => {
        requestGenerator("GET", mantisState.downloadLink, "", "", "").then(response => {
            if (response.status === 200) {
                let blob = new Blob(new Array(response.data), {type: "text/plain;charset=utf-8"});
                saveAs(blob, "MpaFile.csv")
            } else {
                dispatch({type:"SET_ERROR_MESSAGE",payload: "failed"});
            }
        })
    }

    return (
        <div>
            <ToolTipBig title={"Click for uploading a data as CSV for mantis"} placement={"right"}>
                <label className={"uploadLabel"} htmlFor={"module-file"}>Upload file for mantis<img src={UploadIcon}
                                                                                                    style={{
                                                                                                        width: `clamp(6px, 1.7vw, 12px)`,
                                                                                                        transform: "translate(0,0.2vw)"
                                                                                                    }}
                                                                                                    alt={""}/></label>
            </ToolTipBig>
            <input className={"moduleInput"} style={{display: "none"}} id={"module-file"}
                   onClick={() => dispatch({type: "SET_IS_MANTIS_LOADING", payload: true})} type={"file"}
                   name={"module-file"}
                   onChange={(event) => onMantisFileChange(event.target.files, dispatch)}/>
            <br/>
            <div
                className={"fileName"}>{mantisState.mantisFileName.length > 0 ? mantisState.mantisFileName : "No file selected"}</div>
            <div style={{display:"grid", gridTemplateColumns: "repeat(3, 1fr)"}}>
                <button className={"downloadButton"} onClick={()=> startMantisJob(dispatch, mantisState)} disabled={mantisState.mantisFile === undefined}>
                    Start Mantis
                </button>
                <button className={"downloadButton"}  disabled={mantisState.downloadLink.length === 0} onClick={()=> handleDownload()}>
                    Download
                </button>
                <Snackbar anchorOrigin={{vertical: "bottom", horizontal: "right"}}
                          open={generalState.loading}
                          message={
                              <div>
                                  {generalState.loading && <div style={{display: "flex"}}>
                                      <Typography style={{display: "flex", alignItems: "center"}}>{mantisState.jobMessage}</Typography>
                                      &nbsp;&nbsp;
                                      <CircularProgress/>
                                  </div>}
                              </div>
                          }
                />
            </div>

        </div>
    );
};

export default UploadMantis;

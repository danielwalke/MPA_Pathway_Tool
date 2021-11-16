import React from 'react';
import {ToolTipBig} from "../../main/user-interface/UserInterface";
import UploadIcon from "../../icons/uploadIconWhite.svg";
import {useDispatch, useSelector} from "react-redux";
import {onMantisFileChange, startMantisJob} from "./lib";

const UploadMantis = () => {
    const dispatch = useDispatch()
    const mantisState = useSelector(state => state.mantis)
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
                   onClick={() => dispatch({type: "SETLOADING", payload: true})} type={"file"}
                   name={"module-file"}
                   onChange={(event) => onMantisFileChange(event.target.files, dispatch)}/>
            <br/>
            <div
                className={"fileName"}>{mantisState.mantisFileName.length > 0 ? mantisState.mantisFileName : "No file selected"}</div>
            <button className={"downloadButton"} onClick={()=> startMantisJob(dispatch, mantisState)} disabled={mantisState.mantisFile === undefined}>
                Start Mantis
            </button>
        </div>
    );
};

export default UploadMantis;

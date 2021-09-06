import React, {Component} from "react";
import DropZone from "./DropZone";
import Button from "@material-ui/core/Button";
import {inject, observer} from "mobx-react";
import {requestGenerator} from "../../Request Generator/RequestGenerator";
import * as RequestURL from "../../App Configurations/RequestURLCollection"
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import GetAppIcon from '@material-ui/icons/GetApp';
import Snackbar from "@material-ui/core/Snackbar";
import CircularProgress from "@material-ui/core/CircularProgress";
import {Typography} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from '@material-ui/icons/Close';
import {saveAs} from "file-saver"
import MetaDataCalculator from "./MetaDataCalculator";
import {ToolTipBig} from "../../Creator/main/user-interface/UserInterface";
import {getCurrentDateMinute} from "../../Creator/usefulFunctions/Date";
import TaxonomicDetails from "./taxonomicDetails/TaxonomicDetails";

class UploadPanel extends Component {

    constructor(props) {
        super(props);
        this.fetchStatus = this.fetchStatus.bind(this)
        this.downloadData = this.downloadData.bind(this)
        this.startProcessing = this.startProcessing.bind(this)
        this.state={
            jobID: undefined
        }
    }

    fetchStatus(jobID){
        requestGenerator("GET", RequestURL.endpoint_status, {jobid: jobID}, "", "").then(response => {
            if(response.status === 200){
                const {message} = response.data;
                if(message === "finished") {
                    this.props.CalculatorStore.endTime = getCurrentDateMinute()
                    this.props.CalculatorStore.setDownloadStatusAndMessage(`${RequestURL.endpoint_download}/${jobID}`, message)
                    this.props.CalculatorStore.processing = false;
                }
                else if(message === "failed") {
                    this.props.CalculatorStore.setErrorMessage(message);
                }
                else{
                    setTimeout(() => this.fetchStatus(jobID), 5000)
                }
            }
        });
    };

    downloadData(){
        requestGenerator("GET", this.props.CalculatorStore.downloadLink, "", "", "").then(response => {
            if(response.status === 200) {
                let blob = new Blob(new Array(response.data), {type: "text/plain;charset=utf-8"});
                saveAs(blob, "PathwayCalculator.csv")
            }
            else {
                this.props.CalculatorStore.setErrorMessage("Failed to Download");
            }
        })
    }

    downloadDataUnmatchedProteins(jobID){
        requestGenerator("GET", `${RequestURL.endpoint_download_unmatched_proteins}/${jobID}`, "", "", "").then(response => {
            if(response.status === 200) {
                let blob = new Blob(new Array(response.data.trim()), {type: "text/plain;charset=utf-8"});
                saveAs(blob, "unmatchedProteins.csv")
            }
            else {
                this.props.CalculatorStore.setErrorMessage("Failed to Download");
            }
        })
    }

    startProcessing(){
        this.props.CalculatorStore.startTime = getCurrentDateMinute()
        this.props.CalculatorStore.processing = true;
        let MPAFileName = this.props.CalculatorStore.getMPAFile[0].name
        let moduleFileNames = [];
        this.props.CalculatorStore.getModuleFiles.map(moduleFile => {
            moduleFileNames.push(moduleFile.name);
            return null
        })
        let body = { jobID: "", mpaCSVFile: MPAFileName, moduleFiles: moduleFileNames, message: "", downloadLink: "" };
        requestGenerator("POST", RequestURL.endpoint_fetchUUID,"","", body).then( response => {
            if(response.status === 200) {
                const {jobID, message} = response.data;
                this.setState({jobID: jobID})
                const header = {"Content-Type": "multipart/form-data", "type": "formData", "Transfer-Encoding": "chunked"};
                let formData = new FormData();
                formData.append("Content-Type", "multipart/form-data");
                formData.append("uploaded_file", this.props.CalculatorStore.getMPAFile[0]);
                // let body = {"Content-Type": "multipart/form-data", "uploaded_file":this.props.CalculatorStore.getMPAFile[0]}
                this.props.CalculatorStore.setJobIDAndMessage(jobID, message);
                requestGenerator("POST", RequestURL.endpoint_uploadMPAFile, {jobid: jobID}, header, formData).then(response => {
                    if(response.status !== 200){
                        this.props.CalculatorStore.setErrorMessage("MPA file processing failed");
                    }
                });
                this.props.CalculatorStore.getModuleFiles.map(moduleFile => {
                    formData = new FormData();
                    formData.append("Content-Type", "multipart/form-data");
                    formData.append("uploaded_file", moduleFile);
                    // body = {"Content-Type": "multipart/form-data", "uploaded_file": moduleFile};
                    requestGenerator("POST", RequestURL.endpoint_uploadModuleFiles, {jobid: jobID}, header, formData).then(response => {
                        if(response.status !== 200){
                            this.props.CalculatorStore.setErrorMessage("Module file processing failed");
                        }
                    })
                    return null
                });
                if(!this.props.CalculatorStore.error) {
                    this.fetchStatus(jobID)
                }
            }
            else {
                    this.props.CalculatorStore.setErrorMessage("Failed to initiate the job");
            }
        })
    };

    render() {
        return (
            <div>
                <div style={{display: "flex", padding: "20px 0 20px 0px"}}>
                    <div style={{height: "auto",width: "47%", padding: "0 1% 0 2.5%"}}>
                        <DropZone fileType={"MPAFile"} message={"Drag a experimental data file here or click the upload file button"}
                                  uploadFileButton={"Upload a experimental data file"}
                        />
                    </div>
                    <div style={{height: "auto",width: "47%", padding: "0 1% 0 0"}}>
                        <DropZone fileType={"moduleFile"} message={"Drag pathway files here or click the upload files button"}
                                  uploadFileButton={"Upload pathway files"}
                        />
                    </div>
                </div>
                <div style={{display: "flex", justifyContent: "space-evenly" }}>
                    <ToolTipBig title={"Download results of mapping"} placement={"left"}>
                    <Button disabled={this.props.CalculatorStore.downloadLink === undefined} variant={"contained"} color={"primary"} endIcon={<GetAppIcon/>} onClick={() => this.downloadData()}>Download</Button>
                    </ToolTipBig>
                    <ToolTipBig title={"Download unmatched features, e.g. unmatched proteins"} placement={"top"}>
                    <Button disabled={this.props.CalculatorStore.downloadLink === undefined} variant={"contained"} color={"primary"} endIcon={<GetAppIcon/>} onClick={() => this.downloadDataUnmatchedProteins(this.state.jobID)}>Download unmatched Proteins</Button>
                    </ToolTipBig>
                    <TaxonomicDetails jobId={this.props.CalculatorStore.jobID} isNotFinished={this.props.CalculatorStore.downloadLink === undefined} CalculatorStore={this.props.CalculatorStore}/>
                    <MetaDataCalculator/>

                    <Button disabled={this.props.CalculatorStore.downloadLink !== undefined || typeof this.props.CalculatorStore.getMPAFile === "undefined" || this.props.CalculatorStore.processing}
                            variant={"contained"} color={"primary"} onClick={() => this.startProcessing()} endIcon={<KeyboardArrowRightIcon/>}>Start</Button>

                </div>
                {(this.props.CalculatorStore.processing || this.props.CalculatorStore.error) &&
                <Snackbar anchorOrigin={{vertical: "bottom", horizontal: "right"}}
                          open={(this.props.CalculatorStore.processing || this.props.CalculatorStore.error)}
                          message={
                              <div>
                                  {this.props.CalculatorStore.processing && <div style={{display: "flex"}}>
                                      <Typography style={{display: "flex", alignItems: "center"}}>Processing...</Typography>
                                      &nbsp;&nbsp;
                                      <CircularProgress/>
                                  </div>}
                                  {this.props.CalculatorStore.error && <div>Error occurred during uploading. Check your input files or try again later</div>}
                              </div>
                          }
                          action={this.props.CalculatorStore.error && <div>
                              <IconButton size="small" aria-label="close" color="inherit" onClick={() => this.props.CalculatorStore.error = false}>
                                  <CloseIcon fontSize="small" />
                              </IconButton>
                          </div>}
                />}
            </div>
        );
    }

}

export default inject("CalculatorStore")(observer(UploadPanel));

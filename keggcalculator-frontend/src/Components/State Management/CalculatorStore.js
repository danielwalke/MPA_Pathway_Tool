import {action, observable, computed, decorate, toJS} from "mobx"

class Calculator_Store {

    constructor() {
        this.jobID = undefined;

        this.MPAFile = [];

        this.moduleFiles = [];

        this.currentStatus = undefined;

        this.downloadLink = undefined;

        this.processing = false;

        this.startTime = "";

        this.endTime = ""

        this.error = undefined;
        this.setUploadedFiles = this.setUploadedFiles.bind(this)
        this.setJobIDAndMessage = this.setJobIDAndMessage.bind(this)
        this.setErrorMessage = this.setErrorMessage.bind(this)
        this.setDownloadStatusAndMessage = this.setDownloadStatusAndMessage.bind(this)
        this.getSize = this.getSize.bind(this)
        this.removeFiles = this.removeFiles.bind(this)
    }

    // jobID = undefined;
    //
    // MPAFile = [];
    //
    // moduleFiles = [];
    //
    // currentStatus = undefined;
    //
    // downloadLink = undefined;
    //
    // processing = false;
    //
    // error = undefined;

    setUploadedFiles(fileType, collection){
        this.downloadLink = undefined;
        this.currentStatus = undefined;
        if(fileType === "MPAFile") {
            this.MPAFile = collection;
        }
        else {
            this.moduleFiles.push(collection);
        }
    };

    setJobIDAndMessage(jobID, message){
        this.jobID = jobID;
        this.currentStatus = message;
    };

    setErrorMessage(errorMessage){
        this.currentStatus = errorMessage;
        this.processing = false;
        this.downloadLink = undefined;
        this.currentStatus = undefined;
        this.error = true;
    };

    setDownloadStatusAndMessage(downloadLink, message){
        this.downloadLink = downloadLink;
        this.currentStatus = message;
    };

    getSize (fileType) {
        if(fileType === "MPAFile") {
            return this.MPAFile.length;
        }
        else {
            return this.moduleFiles.length
        }
    };

    get getMPAFile() {
        return toJS(this.MPAFile)
    }

    get getModuleFiles() {
        return toJS(this.moduleFiles);
    }

    removeFiles (fileType, index) {
        this.downloadLink = undefined;
        this.currentStatus = undefined;
        if(fileType === "MPAFile") {
            this.MPAFile = [];
        }
        else {
            this.moduleFiles.splice(index, 1)
        }
    };

}

decorate(Calculator_Store,{
    jobID: observable,
    MPAFile: observable,
    startTime: observable,
    endTime: observable,
    moduleFiles: observable,
    downloadLink: observable,
    processing: observable,
    error: observable,
    setUploadedFiles: action,
    setErrorMessage: action,
    setDownloadStatusAndMessage: action,
    removeFiles: action,
    getMPAFile: computed,
    getModuleFiles: computed,
});

const CalculatorStore = new Calculator_Store();

export default CalculatorStore;

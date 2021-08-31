import React from 'react';
import {saveAs} from "file-saver"
import {inject, observer} from "mobx-react";
import GetAppIcon from "@material-ui/icons/GetApp";
import Button from "@material-ui/core/Button";
import {ToolTipBig} from "../../Creator/main/user-interface/UserInterface";


const MetadataCalculator = (props) => {

    const handleDownloadMetadata = () => {
        let zip = require("jszip")()
        const expData = zip.folder("experimental data")
        const pathwayFolder = zip.folder("pathway file")
        const expDataFile = props.CalculatorStore.getMPAFile[0]
        const pathwayFiles = props.CalculatorStore.getModuleFiles
        expData.file(expDataFile.name, expDataFile)
        pathwayFiles.forEach(pathwayFile => pathwayFolder.file(pathwayFile.name, pathwayFile))

        const metaData = `${props.CalculatorStore.startTime} - ${props.CalculatorStore.endTime}\texperimental data from ${expDataFile.name} were successfully mapped on the following pathways ${pathwayFiles.map(pathwayFile => `\n - ${pathwayFile.name}`)}`
        const metaDataBlob = new Blob(new Array(metaData.trim()), {type: "text/plain;charset=utf-8"})
        const metaDataFile= new File(new Array(metaDataBlob), "metadata.txt")
        zip.file(metaDataFile.name, metaDataFile)
        zip.generateAsync({type:"blob"}).then(function(content) {
            saveAs(content, "metadata.zip");
        });

    }
    return (
        <div>
            <ToolTipBig title={"Download metadata from mapping as *.zip"} placement={"top"}>
            <Button disabled={props.CalculatorStore.downloadLink === undefined} variant={"contained"} color={"primary"} endIcon={<GetAppIcon/>}  onClick={handleDownloadMetadata}>download metadata</Button>
            </ToolTipBig>
        </div>
    );
};

export default inject('CalculatorStore')(observer(MetadataCalculator))

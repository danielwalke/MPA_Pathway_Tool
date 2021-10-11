import React from 'react';
import {saveAs} from "file-saver"
import {createCsvBlob} from "../csv download/CsvDownLoader";
import {ToolTipBig} from "../../main/user-interface/UserInterface";


const Metadata = (props) => {
    const {fileStates, generalState, graphState, downloadedHeatMapData} = props

    const handleDownloadMetadata = () => {
        let zip = require("jszip")()
        const expData = zip.folder("experimental data")
        fileStates.experimentalDataFile && expData.file(fileStates.experimentalDataFile.name, fileStates.experimentalDataFile)
        const pathwayFile = zip.folder("pathway file")
        let pathwayName = ""
        if (fileStates.pathwayFile === null) {
            pathwayFile.file("pathway file.csv", new File(new Array(createCsvBlob(generalState, graphState)), "pathway file.csv"))
            pathwayName = "created file"
        } else {
            pathwayFile.file(fileStates.pathwayFile.name, fileStates.pathwayFile)
            pathwayName = `uploaded file ${fileStates.pathwayFile.name}`
        }
        let metaDataBlob = null
        if (fileStates.experimentalDataFile) {
            const metaData = `${generalState.mappingStart} - ${generalState.mappingEnd} \texperimental data from the file ${fileStates.experimentalDataFile.name} were successfully mapped on the ${pathwayName}`
            metaDataBlob = new Blob(new Array(metaData.trim()), {type: "text/plain;charset=utf-8"})
        }
        const nullMetaDataBlob = new Blob(new Array("no data were mapped"), {type: "text/plain;charset=utf-8"})
        const metaDataFile = downloadedHeatMapData ? new File(new Array(metaDataBlob), "metadata.txt") : new File(new Array(nullMetaDataBlob), "metadata.txt")
        zip.file(metaDataFile.name, metaDataFile)
        zip.generateAsync({type: "blob"}).then(function (content) {
            saveAs(content, "metadata.zip");
        });

    }
    return (
        <div>
            <ToolTipBig title={"Click for downloading metadata about mapping as *.zip"} placement={"right"}>
                <button disabled={graphState.data.nodes.length === 0} className={"download-button"}
                        onClick={handleDownloadMetadata}>download metadata
                </button>
            </ToolTipBig>
        </div>
    );
};

export default Metadata;

import React from 'react';
import {saveAs} from "file-saver"
import {createCsvBlob} from "../csv download/CsvDownLoader";
import {ToolTipBig} from "../../main/user-interface/UserInterface";
import {requestGenerator} from "../../request/RequestGenerator";
import {endpoint_getDependencies} from "../../../App Configurations/RequestURLCollection";


const Metadata = (props) => {
    const {fileStates, generalState, graphState, downloadedHeatMapData} = props

    // const [dependencies, setDependencies] = useState([])
    // const [serverDependencies, setServerDependencies] = useState([])

    // useEffect(()=> {
    //     const packageJson = require("../../../../package.json");
    //     setDependencies(packageJson.dependencies)
    //     requestGenerator("GET", endpoint_getDependencies, "", "").then(resp => {
    //         setServerDependencies(resp.data)
    //     })
    //
    // },[])

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
        let metaData = ""
        if (fileStates.experimentalDataFile) {
            metaData = `${generalState.mappingStart} - ${generalState.mappingEnd} \texperimental data from the file ${fileStates.experimentalDataFile.name} were successfully mapped on the ${pathwayName}`

        }
        if(!downloadedHeatMapData){
            metaData = "no data were mapped"
        }
        metaData += "\n\n"
        metaData += "data\tmodification-date\n"
        //TODO: Keep the following data modification dates up to date
        metaData += "KEGG\t30.09.2020\n"
        metaData += "NCBI\t08.07.2021\n"
        metaData += "MPA_Pathway_Tool-Version 1\t03.10.21\n"
        // metaData += "\n"
        // metaData += "dependencies(client-side)\tversion\n"
        // for(const dependency in dependencies){
        //     const version = dependencies[dependency]
        //     metaData += `${dependency}\t${version}\n`
        // }
        // metaData+= "\n\n"
        // metaData += "dependencies(server-side)\tversion\n"
        // for(const dependency in serverDependencies){
        //     metaData += `${dependency}\t${serverDependencies[dependency]}\n`
        // }
        metaDataBlob = new Blob(new Array(metaData.trim()), {type: "text/plain;charset=utf-8"})
        // const nullMetaDataBlob = new Blob(new Array(), {type: "text/plain;charset=utf-8"})
        // const metaDataFile = downloadedHeatMapData ? new File(new Array(metaDataBlob), "metadata.txt") : new File(new Array(nullMetaDataBlob), "metadata.txt")
        const metaDataFile = new File(new Array(metaDataBlob), "metadata.txt")
        zip.file(metaDataFile.name, metaDataFile)
        zip.generateAsync({type: "blob"}).then(function (content) {
            saveAs(content, "metadata.zip");
        });

    }
    return (
        <div>
            <ToolTipBig title={"Click for downloading metadata about mapping as *.zip"} placement={"right"}>
                <button
                    disabled={graphState.data.nodes.length === 0} className={"download-button"}
                        onClick={handleDownloadMetadata}>download metadata
                </button>
            </ToolTipBig>
        </div>
    );
};

export default Metadata;

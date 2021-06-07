import React from 'react';
import PathwayJson from "../../../exampleData/WoodLjungdahlpathway.json"
import {saveAs} from "file-saver";

const handleDownload = () =>{
    const jsonBlob = new Blob(new Array(JSON.stringify(PathwayJson, null, 2)), {type: "text/plain;charset=utf-8"})
    saveAs(jsonBlob, "Wood-Ljungdahl pathway.json")
}

const ExampleJsonDownload = () => {
    return (
        <div>
            <button className={"downloadButton"} style={{width:"10vw"}} onClick={()=>handleDownload()}>download</button>
        </div>
    );
};

export default ExampleJsonDownload;
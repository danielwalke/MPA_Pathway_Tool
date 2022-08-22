import React from 'react';
import PathwayJson from "../../../exampleData/WoodLjungdahlpathway.json"
import {saveAs} from "file-saver";
import {Link} from "react-router-dom";

const handleDownload = () => {
    const jsonBlob = new Blob(new Array(JSON.stringify(PathwayJson, null, 2)), {type: "text/plain;charset=utf-8"})
    saveAs(jsonBlob, "Wood-Ljungdahl pathway.json")
}

const ExampleJsonDownload = () => {
    return (
        <div>
            <Link style={{
                textDecoration: "none", color: "white", width: "80%",
                backgroundColor: "rgb(150, 25, 130)",
                borderRadius: "1.5vw",
                transition: "all 400ms ease-in-out",
                textTransform: "uppercase",
                fontSize: "clamp(12px, 1vw, 22px)",
                fontFamily: "Arial" ,
                margin: "5",
                padding: "8px"
            }} onClick={() => handleDownload()}>download</Link>
        </div>
    );
};

export default ExampleJsonDownload;

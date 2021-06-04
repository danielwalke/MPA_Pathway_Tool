import React from 'react';
import {Link} from "react-router-dom";
import {Card} from "@material-ui/core";
import ExperimentalData from "../../../exampleData/format for experimental data.csv"
import PathwayCsv from "../../../exampleData/WoodLjungdahlpathway.csv"
import PathwayJson from "../../../exampleData/WoodLjungdahlpathway.json"

const ExampleData = () => {
    return (
        <div>
            <Card>
                <Card style={{margin:"5px 0"}}><ExampleDownload link={ExperimentalData}/>example for experimental data</Card>
                <Card style={{margin:"5px 0"}}><ExampleDownload link={PathwayCsv}/>example for pathway as CSV</Card>
                {/*<Card style={{margin:"5px 0"}}><ExampleDownload link={PathwayJson}/>example for pathway as JSON</Card>*/}
                {/*<Card style={{margin:"5px 0"}}><ExampleDownload link={PathwaySbml}/>example for pathway as SBML</Card>*/}

            </Card>
        </div>
    );
};

export default ExampleData;

const ExampleDownload = (props) =>{
    const {link} = props
    return(
            <button className={"downloadButton"} style={{width:"10vw"}}>
                <Link style={{textDecoration:"none", color:"white"}} to={link} target={"_blank"} download>download</Link>
            </button>

    )
}
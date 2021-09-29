import React from 'react';
import {Link} from "react-router-dom";
import {Card} from "@material-ui/core";
import ExperimentalData from "../../../exampleData/format for experimental data.csv"
import PathwayCsv from "../../../exampleData/WoodLjungdahlpathway.csv"
import PathwaySbml from "../../../exampleData/Wood-Ljungdahl-pathway.xml"
import ExampleJsonDownload from "./ExampleJsonDownload";

const ExampleData = () => {
    return (
        <div>
            <Card>
                <Card style={{margin: "8px 0",padding:"5px", display:"flex"}}><ExampleDownload link={ExperimentalData}/><div style={{margin:"2px"}}>example for experimental data</div></Card>
                <Card style={{margin: "8px 0",padding:"5px", display:"flex"}}><ExampleDownload link={PathwayCsv}/><div style={{margin:"2px"}}>example for pathway as CSV</div></Card>
                <Card style={{margin: "8px 0",padding:"5px", display:"flex"}}><ExampleDownload link={PathwaySbml}/><div style={{margin:"2px"}}>example for pathway as SBML</div></Card>
                <Card style={{margin: "8px 0",padding:"5px", display:"flex"}}><ExampleJsonDownload/><div style={{margin:"2px"}}>example for pathway as JSON</div></Card>
            </Card>
        </div>
    );
};

export default ExampleData;

const ExampleDownload = (props) => {
    const {link} = props
    return (
        <div style={{margin:"5"}}>      <Link style={{
            textDecoration: "none", color: "white", width: "80%",
            backgroundColor: "rgb(150, 25, 130)",
            borderRadius: "1.5vw",
            transition: "all 400ms ease-in-out",
            textTransform: "uppercase",
            fontSize: "clamp(12px, 1vw, 22px)",
            fontFamily: "Roboto",
            margin: "5",
            padding: "8px"
        }} to={link} target={"_blank"} download>download</Link></div>
    )
}
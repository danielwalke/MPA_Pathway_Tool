import React from "react"
import OVGULogo from "../../images/OVGU_bioprocess.png"
// import DBSELogo from "../../images/DBSE_logo.png"
import denbiLogo from "../../images/denbi-logo-color.svg"
import {AppBar} from "@material-ui/core";

export default function NavigationBar(props) {

    let style = {
        navBar: {flexDirection: "row", flex: 1, display: "flex", justifyContent: "space-between"},
        title: {display: "flex", margin: "0 130px 0 0", alignItems: "center", fontSize: "1.25rem", fontWeight: "600", userSelect: "none"},
        denbiLogo: {width: "100px", margin: "0 25px 0 0", padding: "10px", background: "white", cursor: "pointer" },
        OVGULogo: {cursor: "pointer"}
    }

    return (
        <div>
            <AppBar position={"static"} style={style.navBar}>
                <img style={style.OVGULogo} src={OVGULogo} alt={"OVGU Magdeburg"} onClick={() => window.open("http://www.bpt.ovgu.de/", "_blank")}/>
                <div style={style.title}>
                    MPA_Pathway_Tool
                </div>
                <img src={denbiLogo} alt={"denbi"} style={style.denbiLogo} onClick={() => window.open("https://www.denbi.de/", "_blank")}/>
            </AppBar>
        </div>
    );
}
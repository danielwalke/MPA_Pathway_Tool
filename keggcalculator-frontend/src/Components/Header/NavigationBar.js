import React from "react"
// import DBSELogo from "../../images/DBSE_logo.png"
import {AppBar} from "@material-ui/core";

export default function NavigationBar(props) {

    let style = {
        navBar: {flexDirection: "row", flex: 1, display: "flex", justifyContent: "center"},
        title: {display: "flex", alignItems: "center", fontSize: "1.25rem", fontWeight: "600", userSelect: "none"},
    }

    return (
        <div>
            <AppBar position={"static"} style={style.navBar}>
                <div style={style.title}>
                    MPA_Pathway_Tool
                </div>
            </AppBar>
        </div>
    );
}

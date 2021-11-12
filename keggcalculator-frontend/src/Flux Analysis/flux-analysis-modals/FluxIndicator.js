import React, {useEffect, useState} from "react";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import {useSelector} from "react-redux";

export default function FluxIndicator({flux}) {

    const [offsetString, setOffsetString] = useState("0")

    useEffect(() => {
        const offset = (flux + 1000) / 2000 * 100
        setOffsetString(String(offset))
    },[])

    return(
        <div>
            <div style={{
                width: "fit-content",
                position: "relative",
                left: "calc(-11px + "+offsetString+"%)",
                top: "-2px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
            }}>
                <ArrowUpwardIcon/>
            </div>
            <div style={{display: "flex", alignItems: "center"}}>
                <span style={{
                    paddingLeft: "min(calc(100% - 5rem),"+offsetString+"%)",
                    whiteSpace: "nowrap"
                }}>
                Flux: {parseFloat(flux).toFixed(2)}
            </span>
            </div>
        </div>
    )
}

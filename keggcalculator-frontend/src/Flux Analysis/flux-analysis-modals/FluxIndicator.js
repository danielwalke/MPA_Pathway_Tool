import React, {useEffect, useState} from "react";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import {useSelector} from "react-redux";

export default function FluxIndicator({flux}) {

    const [offsetString, setOffsetString] = useState(0)

    useEffect(() => {
        const offset = flux/1000 * 45
        setOffsetString("calc(1px + "+offset+"%")
    },[])

    return(
        <div style={{
            // width: "100%",
            position: "relative",
            left: offsetString,
            top: "-2px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
        }}>
            <ArrowUpwardIcon/>
            <span>Flux:</span>
            <span>{parseFloat(flux).toFixed(2)}</span>
        </div>
    )
}

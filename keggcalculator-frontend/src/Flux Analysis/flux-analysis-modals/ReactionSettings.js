import React, {useEffect, useState} from "react";
import StyledSlider from "./StyledSlider";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import FluxIndicator from "./FluxIndicator";

export default function ReactionSettings(props) {

    const [bounds, setBounds] = useState([-1000.0, 1000.0]);


    useEffect(() => {
        setBounds([props.dataObj.lowerBound, props.dataObj.upperBound])
    }, [])

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
        }}>
            <StyledSlider
                bounds={bounds} setBounds={setBounds}/>
            <FluxIndicator flux={props.dataObj.flux}/>
        </div>
    )
}

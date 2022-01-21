import {Slider, StylesProvider} from "@material-ui/core";
import React from "react";


export default function StyledSlider({bounds, setBounds, setFinalBounds, setFlux}) {

    const marks = [
        {value: 0.0,},
        {value: -500.0,},
        {value: -1000.0,},
        {value: 500.0,},
        {value: 1000.0,}];

    return (
        <StylesProvider injectFirst>
            <Slider
                style={{width: "90%", paddingBottom: "0"}}
                getAriaLabel={() => 'Flux Bounds'}
                value={bounds}
                onChange={(event, value) => setBounds(value)}
                onChangeCommitted={(event, value) => {
                    setFinalBounds(value)
                    setFlux(null)
                    // resetFluxData(fluxAnalysis, dispatch)
                }}
                valueLabelDisplay="auto"
                // getAriaValueText={valuetext}
                min={-1000.0}
                max={1000.0}
                marks={marks}
            />
        </StylesProvider>
    )
}

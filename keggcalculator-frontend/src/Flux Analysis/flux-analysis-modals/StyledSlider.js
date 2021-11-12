import {createTheme, Slider, StylesProvider} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import { ThemeProvider } from "@material-ui/styles";
import {resetFluxData} from "../services/CreateFbaGraphData";
import {useDispatch, useSelector} from "react-redux";

export default function StyledSlider({bounds, setBounds, setFinalBounds, setFlux}) {

    const generalState = useSelector(state => state.general)
    const fluxAnalysis = useSelector(state => state.fluxAnalysis)
    const dispatch = useDispatch()

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
                    setFlux(undefined)
                    resetFluxData(generalState.reactionsInSelectArray, fluxAnalysis.data, dispatch)
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

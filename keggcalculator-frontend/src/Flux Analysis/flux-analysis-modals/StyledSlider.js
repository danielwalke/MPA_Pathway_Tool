import {createTheme, Slider, StylesProvider} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import { ThemeProvider } from "@material-ui/styles";

export default function StyledSlider({bounds, setBounds, setFinalBounds}) {

    const marks = [
        {value: 0.0,},
        {value: -500.0,},
        {value: -1000.0,},
        {value: 500.0,},
        {value: 1000.0,}];

    const PrettoSlider = createTheme({
        overrides: {
            MuiSlider: {
                root: {
                    color: 'rgb(150, 25, 130)',
                    height: 8
                },
                thumb: {
                    height: 20,
                    width: 20,
                    backgroundColor: "#fff",
                    border: "2px solid currentColor",
                    marginTop: -8,
                    marginLeft: -12,
                    "&:focus,&:hover,&$active": {
                        boxShadow: "inherit"
                    }
                },
                active: {},
                valueLabel: {
                    left: "calc(-50%)"
                },
                track: {
                    height: 8,
                    borderRadius: 4
                },
                rail: {
                    height: 8,
                    borderRadius: 4
                }
            }
        }
    });

    return (
            <StylesProvider injectFirst>
            <Slider
                style={{width: "90%", paddingBottom: "0"}}
                getAriaLabel={() => 'Flux Bounds'}
                value={bounds}
                onChange={(event, value) => setBounds(value)}
                onChangeCommitted={(event, value) => {
                    setFinalBounds(value)
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

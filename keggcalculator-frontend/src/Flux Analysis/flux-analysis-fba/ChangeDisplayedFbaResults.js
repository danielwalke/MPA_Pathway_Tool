import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {createFbaGraphData} from "../services/createFbaGraphData";
import {Button} from "@mui/material";
import styled from "@emotion/styled";

export const SwitchButtonLeft = styled(Button)({
    flex: "0 0 50%",
    backgroundColor: "rgb(150, 25, 130)",
    borderTopLeftRadius: "5px",
    borderBottomLeftRadius: "5px",
    borderTopRightRadius: "0",
    borderBottomRightRadius: "0",
    border: "none",
    boxShadow: "0px 0px 1px rgb(56, 9, 49)",
    color: "white",
    transition: "all 200ms ease-in-out",
    /*text-transform: uppercase;*/
    fontSize: "clamp(12px, 1rem, 22px)",
    /*font-family: Roboto, serif;*/
    padding: "4px",
    paddingRight: "0",
    textTransform: "none",
    '&:hover': {
        backgroundColor: "rgb(110, -15, 90)",
        cursor: "pointer",
    },
    '&:disabled': {
        backgroundColor: "lightgray",
        cursor: "default",
        color: "black",
    }
});

export const SwitchButtonRight = styled(Button)({
    flex: "0 0 50%",
    backgroundColor: "rgb(150, 25, 130)",
    borderTopLeftRadius: "0",
    borderBottomLeftRadius: "0",
    borderTopRightRadius: "5px",
    borderBottomRightRadius: "5px",
    border: "none",
    boxShadow: "0px 0px 1px rgb(56, 9, 49)",
    color: "white",
    transition: "all 200ms ease-in-out",
    /*text-transform: uppercase;*/
    fontSize: "clamp(12px, 1rem, 22px)",
    /*font-family: Roboto, serif;*/
    padding: "4px",
    paddingLeft: "0",
    textTransform: "none",
    '&:hover': {
        backgroundColor: "rgb(110, -15, 90)",
        cursor: "pointer",
    },
    '&:disabled': {
        backgroundColor: "lightgray",
        cursor: "default",
        color: "black",
    }
});


export default function ChangeDisplayedFBAResults() {

    const graphState = useSelector(state => state.graph)
    const fluxState = useSelector(state => state.fluxAnalysis)

    const dispatch = useDispatch()

    const handleSwitchResults = () => {

        let fba_data

        if (!fluxState.showSMomentFlux) {
            fba_data = fluxState.sMomentFlux
        } else {
            fba_data = fluxState.flux
        }

        const newGraphData = createFbaGraphData(graphState, fba_data)
        dispatch({type: "TOGGLE_FBA_RESULTS"})
        dispatch({type: "SET_FLUX_GRAPH", payload: newGraphData.data})
    }

    return(
        <div className={"switch-buttons"}>
            {/*<ToolTipBig title={"Toggle between fba results of the original and sMOMENT models"} placement={"right"}>*/}
            {/*    <span>*/}
            {/*        <CustomButton*/}
            {/*            size="small"*/}
            {/*        disabled={!fluxState.sMomentFlux}*/}
            {/*        className={"download-button"}*/}
            {/*        onClick={() => handleSwitchResults()}*/}
            {/*        >*/}
            {/*        Toggle FBA Results*/}
            {/*    </CustomButton>*/}
            {/*    </span>*/}
            {/*</ToolTipBig>*/}
            <SwitchButtonLeft>Original</SwitchButtonLeft>
            <SwitchButtonRight>sMOMENT</SwitchButtonRight>
        </div>
    )
}

import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {createFbaGraphData} from "../services/createFbaGraphData";
import {Button} from "@mui/material";
import styled from "@emotion/styled";
import {ToolTipBig} from "../../Creator/main/user-interface/UserInterface";

export const SwitchButton = styled(Button)((props) => ({
    flex: "0 0 50%",
    backgroundColor: props.toggled === "true" ? "rgb(150, 25, 130)" : "unset",
    color: props.toggled === "true" ? "white" : "rgb(150, 25, 130)",
    borderTopLeftRadius: props.pos === "left" ? "5px" : "0px",
    borderBottomLeftRadius: props.pos === "left" ? "5px" : "0px",
    borderTopRightRadius: props.pos === "right" ? "5px" : "0px",
    borderBottomRightRadius: props.pos === "right" ? "5px" : "0px",
    border: "2px solid rgb(150, 25, 130)",
    borderRight: props.pos === "left" && "1px",
    borderLeft: props.pos !== "left" && "1px",
    boxShadow: "0px 0px 1px rgb(56, 9, 49)",
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
        color: props.toggled === "true" ? "rgb(150, 25, 130)" : "white",
    },
    '&:disabled': {
        backgroundColor: "lightgray",
        cursor: "default",
        color: "black",
        border: "none",
    }
}));

export default function ChangeDisplayedFBAResults() {

    const graphState = useSelector(state => state.graph)
    const fluxState = useSelector(state => state.fluxAnalysis)
    const [toggled, setToggled] = useState({left: false, right: false})

    const dispatch = useDispatch()

    const handleSwitchResults = (result) => {

        setToggled(result === "original" ? {left: true, right: false} : {left: false, right: true })

        let fbaData

        if (!fluxState.showSMomentFlux && result !== "original") {
            fbaData = fluxState.sMomentFlux
        } else if (fluxState.showSMomentFlux && result === "original") {
            fbaData = fluxState.flux
        }

        if (fbaData) {
            const newGraphData = createFbaGraphData(graphState, fbaData)
            dispatch({type: "TOGGLE_FBA_RESULTS"})
            dispatch({type: "SET_FLUX_GRAPH", payload: newGraphData.data})
        }
    }

    useEffect(() => {
        if (fluxState.flux) {
            setToggled({left: true, right: false})
        }
    },[fluxState.flux])

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
            <ToolTipBig title={"Display FBA results of the original or sMOMENT model on the graph."} placement={"right"}>
                <span style={{width: "100%", display: "flex"}}>
                    <SwitchButton pos={'left'} toggled={toggled.left.toString()}
                                 onClick={() => handleSwitchResults("original")}
                                 disabled={!fluxState.flux}>Original</SwitchButton>
                    <SwitchButton pos={'right'} toggled={toggled.right.toString()}
                                  onClick={() => handleSwitchResults("smoment")}
                                  disabled={!fluxState.sMomentFlux}>sMOMENT</SwitchButton>
                </span>
            </ToolTipBig>
        </div>
    )
}

import React from "react";
import {TextField} from "@material-ui/core";
import {ToolTipBig} from "../../Creator/main/user-interface/UserInterface";

export default function ConfigurationFormElement(props) {

    return(
        <ToolTipBig
            title={props.tooltip}
            placement={"right"}>
            <TextField
                InputLabelProps={{shrink: true}}
                size={"small"}
                style={{width: "40%"}}
                type={"number"}
                inputProps={{
                    type: "number",
                    step: 0.001,
                }}
                label={props.label}
                variant="outlined"
                value={props.configuration}
                onChange={(event) => {
                    let value = event.target.value
                    if (event.target.value > props.max) {
                        value = props.max
                    }
                    if (event.target.value < props.min) {
                        value = props.min
                    }
                    props.setConfigurations(props.prop, value)
                }}
            />
        </ToolTipBig>
    )
}

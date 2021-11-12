import TextField from "@material-ui/core/TextField";
import {checkAndGenerateNewReactionId, getUserReactionId} from "../functions/SpecReactionFunctions";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import "./SpecReaction.css"
import {ToolTipBig} from "../../main/user-interface/UserInterface";

const SpecReaction = () => {
    const dispatch = useDispatch()
    const generalState = useSelector(state => state.general)
    return (
        <div className={"reactionContainerSpec"}>
            <ToolTipBig title={"Type in a reaction name"} placement={"right"}>
                <TextField
                    size={"small"}
                    placeholder={"name of your reaction"}
                    className={"reaction"}
                    label="Reaction name"
                    variant="outlined"
                    id="reaction"
                    onChange={(e) => dispatch({
                        type: "SETSPECIFICREACTION",
                        payload: e.target.value.concat(
                            ` ${checkAndGenerateNewReactionId(generalState.reactionsInSelectArray)}`)
                    })}
                />
            </ToolTipBig>
        </div>
    )
}

export default SpecReaction

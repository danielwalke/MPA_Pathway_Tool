import TextField from "@material-ui/core/TextField";
import {getUserReactionId} from "./SpecReactionFunctions";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import "./SpecReaction.css"
import TaxonomicRank from "../graph/TaxonomicRank";

const SpecReaction = () => {
    const dispatch = useDispatch()
    const generalState = useSelector(state => state.general)
    return (
        <div className={"reactionContainerSpec"}>
            <TextField
                size={"small"}
                placeholder={"name of your reaction"}
                className={"reaction"}
                label="Reaction name"
                variant="outlined"
                id="reaction"
                onChange={(e) => dispatch({
                    type: "SETSPECIFICREACTION",
                    payload: e.target.value.concat(` U${getUserReactionId(generalState)}`)
                })}
            />
        </div>
    )
}

export default SpecReaction
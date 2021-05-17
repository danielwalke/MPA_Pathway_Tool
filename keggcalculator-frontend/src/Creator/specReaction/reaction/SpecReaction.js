import TextField from "@material-ui/core/TextField";
import {getUserReactionId} from "../functions/SpecReactionFunctions";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import "./SpecReaction.css"
import TaxonomicRank from "../../graph/double click node/TaxonomicRank";

const SpecReaction = () => {
    const dispatch = useDispatch()
    const graphState = useSelector(state => state.graph)
    const reactionList = graphState.data.nodes.filter(node => node.symbolType === "diamond")
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
                    payload: e.target.value.concat(` U${getUserReactionId(reactionList.length)}`)
                })}
            />
        </div>
    )
}

export default SpecReaction
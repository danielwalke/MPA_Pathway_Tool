import {getNLastChars} from "../../usefulFunctions/Strings";
import {changeLinkOrientation} from "./ChangeLinkOrientation";

export const invertDirection = (state, dispatch, generalState) => {

    const node = state.data.nodes.find(node => getNLastChars(node.id, 6) === getNLastChars(state.doubleClickNode, 6))
    let reactionObj = generalState.reactionsInSelectArray.find(reaction => reaction.reactionName === node.id)

    const direction = !reactionObj ?
        "forward" : reactionObj.isForwardReaction ?
            "reverse" : "forward" // changes directions

    const nodeReversibility = node.reversible ? "reversible" : "irreversible"
    const linkDirection = nodeReversibility === "reversible" ? "forward" : direction

    const data = changeLinkOrientation(node, state, generalState, nodeReversibility, linkDirection, false)

    dispatch({type: "SETDATA", payload: data})
}

export const clone = (object) => {
    return JSON.parse(JSON.stringify(object))
}

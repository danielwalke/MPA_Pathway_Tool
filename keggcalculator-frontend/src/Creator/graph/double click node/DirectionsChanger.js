import {getNLastChars} from "../../usefulFunctions/Strings";
import {changeLinkOrientation} from "./ChangeLinkOrientation";

export const invertDirection = (state, dispatch, generalState) => {

    const node = state.data.nodes.find(node => getNLastChars(node.id, 6) === getNLastChars(state.doubleClickNode, 6))

    const {data, reversibleState} = changeLinkOrientation(node, state, generalState, false, true)


    dispatch({type: "SETDATA", payload: data})
}

export const clone = (object) => {
    return JSON.parse(JSON.stringify(object))
}

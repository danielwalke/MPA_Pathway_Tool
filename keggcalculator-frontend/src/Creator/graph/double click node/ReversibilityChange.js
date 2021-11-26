import React, {useEffect, useState} from 'react';
import {Checkbox} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {ToolTipBig} from "../../main/user-interface/UserInterface";
import {getNLastChars} from "../../usefulFunctions/Strings";
import {changeLinkOrientation, changeLinkOrientation2} from "./ChangeLinkOrientation";
import {reaction} from "mobx";

const ReversibilityChange = (props) => {
    const [reversible, setReversible] = useState(false)
    const state = useSelector(state => state)
    const dispatch = useDispatch()
    const node = state.graph.data.nodes.find(node => getNLastChars(node.id, 6)  === props.nodeId)

    useEffect(() => {
        setReversible(node.reversible)
    }, [])

    const updateReversibility = () => {

        const reactionObj = state.general.reactionsInSelectArray.find(reaction => reaction.reactionName === node.id)

        let nodeReversibility
        if (reversible) {
            nodeReversibility = "irreversible"
            reactionObj.lowerBound = 0.0
            reactionObj.upperBound = 1000.0
        } else {
            nodeReversibility = "reversible"
            reactionObj.lowerBound = -1000.0
            reactionObj.upperBound = 1000.0
        }

        console.log(nodeReversibility)

        const data = changeLinkOrientation2(
            node, state.graph, state.general, nodeReversibility, "forward")

        setReversible(!reversible)
        dispatch({type: "SETDATA", payload: data})
    }

    return (
        <div style={{display: "flex"}}>
            <div>
                <ToolTipBig title={reversible ? "Make reaction irreversible" : "Make reaction reversible"}
                             placement={"right"}>
                <Checkbox checked={reversible} onChange={() => updateReversibility()}/>
                </ToolTipBig>
            </div>
            <div>Reversible</div>
        </div>
    );
};

export default ReversibilityChange;

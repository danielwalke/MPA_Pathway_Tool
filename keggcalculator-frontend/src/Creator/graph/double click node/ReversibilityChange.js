import React, {useEffect, useState} from 'react';
import {Checkbox} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {ToolTipBig} from "../../main/user-interface/UserInterface";
import {getNLastChars} from "../../usefulFunctions/Strings";
import {changeLinkOrientation} from "./ChangeLinkOrientation";

const ReversibilityChange = (props) => {
    const [reversible, setReversible] = useState(false)
    const state = useSelector(state => state)
    const dispatch = useDispatch()
    const node = state.graph.data.nodes.find(node => getNLastChars(node.id, 6)  === props.nodeId)

    useEffect(() => {
        setReversible(node.reversible)
    }, [])

    const updateReversibility = () => {
        const {data, reversibleState} = changeLinkOrientation(
            node, state.graph, state.general, true, false)
        setReversible(reversibleState)
        dispatch({type: "SETDATA", payload: data})
    }

    return (
        <div style={{display: "flex"}}>
            <div><ToolTipBig title={reversible ? "Make reaction irreversible" : "Make reaction reversible"}
                             placement={"right"}>
                <Checkbox checked={reversible} onChange={() => updateReversibility()}/>
            </ToolTipBig></div>
            <div>Reversible</div>
        </div>
    );
};

export default ReversibilityChange;

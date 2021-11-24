import React, {useEffect, useState} from 'react';
import {Checkbox} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {ToolTipBig} from "../../main/user-interface/UserInterface";

const ReversibilityChange = (props) => {
    const [reversible, setReversible] = useState(false)
    const state = useSelector(state => state)
    const dispatch = useDispatch()
    const node = state.graph.data.nodes.filter(node => node.id.substring(node.id.length - 6, node.id.length) === props.nodeId)[0]

    useEffect(() => {
        setReversible(node.reversible)
    }, [props])

    const deleteLinks = (links) => {
        links = links.filter(link => !((link.source === node.id || link.target === node.id) && link.isReversibleLink))
        return links
    }

    const addLinks = (links) => {
        links.map(link => {
                if (link.source === node.id || link.target === node.id) {
                    const reverseLink = {
                        source: link.target,
                        target: link.source,
                        opacity: link.opacity,
                        isReversibleLink: true
                    }
                    links.push(reverseLink)
                }
                return link
            }
        )
        return links
    }

    const changeReversibility = () => {
        const nodes = state.graph.data.nodes.map(node => {
            if (node.id.substring(node.id.length - 6, node.id.length) === props.nodeId) {
                node.reversible = !reversible
            }
            return node
        })
        let links
        if (reversible) {
            links = deleteLinks(state.graph.data.links)
        } else {
            links = addLinks(state.graph.data.links)
        }
        const data = {nodes: nodes, links: links}
        setReversible(!reversible)
        changeReversibilityInReactions()
        dispatch({type: "SETDATA", payload: data})
    }

    const changeReversibilityInReactions = () => {
        const reaction = state.general.reactionsInSelectArray.find(reaction => reaction.reactionId === node.id.substring(node.id.length - 6, node.id.length))
        reaction.reversible = !reaction.reversible
        if (reaction.reversible) {
            reaction.lowerBound = reaction.lowerBound < 0 ? reaction.lowerBound : -(reaction.upperBound)
        } else {
            reaction.lowerBound = reaction.lowerBound > 0 ? reaction.lowerBound : 0.0
        }
    }

    return (
        <div style={{display: "flex"}}>
            <div><ToolTipBig title={reversible ? "Make reaction irreversible" : "Make reaction reversible"}
                             placement={"right"}>
                <Checkbox checked={reversible} onChange={() => changeReversibility()}/>
            </ToolTipBig></div>
            <div>Reversible</div>
        </div>
    );
};

export default ReversibilityChange;

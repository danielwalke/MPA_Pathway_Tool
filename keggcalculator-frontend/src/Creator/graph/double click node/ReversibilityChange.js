import React, {useEffect, useState} from 'react';
import {Checkbox} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";

const ReversibilityChange = (props) => {
    const [reversible, setReversible] = useState(false)
    const state = useSelector(state => state)
    const dispatch = useDispatch()
    const node = state.graph.data.nodes.filter(node => node.id.substring(node.id.length - 6, node.id.length) === props.nodeId)[0]

    useEffect(() => {
        setReversible(node.reversible)
    }, [props])

    const deleteLinks = (links) => {
        links = links.filter(link =>!((link.source === node.id || link.target === node.id) && link.isReversibleLink))
        return links
    }

    const addLinks = (links) => {
        links.map(link => {
                if(link.source === node.id || link.target === node.id){
                    const reverseLink = {source: link.target, target: link.source, opacity: link.opacity, isReversibleLink: true}
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
        dispatch({type: "SETDATA", payload: data})
    }

    return (
        <div style={{display: "flex"}}>
            <div><Checkbox checked={reversible} onChange={() => changeReversibility()}/></div>
            <div>Reversible</div>
        </div>
    );
};

export default ReversibilityChange;
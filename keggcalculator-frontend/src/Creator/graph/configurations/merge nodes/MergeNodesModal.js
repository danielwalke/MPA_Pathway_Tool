import Modal from "@material-ui/core/Modal";
import React, {useEffect, useState} from "react";
import {useStyles} from "../../../ModalStyles/ModalStyles";
import {useDispatch, useSelector} from "react-redux";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import DeleteIcon from "@material-ui/icons/Delete";
import {ToolTipBig} from "../../../main/user-interface/UserInterface";
import {updateElementsInReactionArray} from "../../../usefulFunctions/reactionArrayFunctions";

const MergeNodesModal = () => {
    const classes = useStyles()
    const graphState = useSelector(state => state.graph)
    const generalState = useSelector(state => state.general)
    const dispatch = useDispatch()

    const [mergeOptions, setMergeOptions] = useState([])

    useEffect(() => {
        const options = []
        graphState.data.nodes.forEach(node => {
            if (node.symbolType === 'circle') {
                options.push(node.id)
            }
        })
        setMergeOptions(options)
    },[])

    const body = (
        <div style={{width: "60vw", height: "80vh", backgroundColor: "white", padding: "5px"}}>
            <ToolTipBig title={"Choose a node"} placement={"right"}>
                <Autocomplete
                    size={"small"}
                    id={"merge nodes selector"}
                    options={mergeOptions}
                    onChange={(event, value) => {
                        dispatch({type: "SETMERGENODE", payload: value})
                    }}
                    renderInput={params => (
                        <TextField
                            onChange={(e) => dispatch({type: "SETMERGENODE", payload: e.target.value})}
                            value={graphState.mergeNode}
                            {...params}
                            label={"add node you want to merge"}
                            variant="outlined"
                        />
                    )}
                />
            </ToolTipBig>
            <ToolTipBig title={"Add node for merging"} placement={"right"}>
                <button className={"download-button"} onClick={() => dispatch({type: "ADDMERGENODE"})}>add</button>
            </ToolTipBig>
            <ul style={{listStyleType: "none"}}>
                {graphState.mergeNodes.map((id, index) => {
                    return (
                        <li key={`${index}_${id}`}>
                            <ToolTipBig title={"Unselect node for merging"} placement={"right"}>
                                <DeleteIcon
                                    onClick={() => dispatch({type: "SPLICEMERGENODES", payload: id})}
                                    style={{transform: "translate(0,4px)"}}/>
                            </ToolTipBig>
                            {id}
                        </li>
                    )
                })}
            </ul>
            <div style={{padding: "5px"}}>merged node name:
                <ToolTipBig title={"Select a name for the new merged node"} placement={"right"}>
                    <Autocomplete
                        size={"small"}
                        id={"merge nodes name selector"}
                        options={graphState.mergeNodes}
                        onChange={(event, value) => {
                            dispatch({type: "SETMERGENODESNAME", payload: value})
                        }}
                        renderInput={params => (
                            <TextField
                                onChange={(e) => dispatch({type: "SETMERGENODESNAME", payload: e.target.value})}
                                value={graphState.mergeNodesName}
                                {...params}
                                label={"add name for the merged node from other nodes"}
                                variant="outlined"
                            />
                        )}
                    />
                </ToolTipBig>
                <ToolTipBig title={"Submit the new name"} placement={"right"}>
                    <button className={"download-button"}>submit node name</button>
                </ToolTipBig>
            </div>
            <ToolTipBig title={"Submit merging nodes"} placement={"right"}>
                <button className={"download-button"}
                        disabled={(graphState.mergeNodes.length < 2 || graphState.mergeNodesName.length < 1)}
                        onClick={() => mergeNodes(graphState, generalState, dispatch)}>merge selected nodes
                </button>
            </ToolTipBig>
        </div>
    )
    return (
        <div>
            <Modal className={classes.modal} open={graphState.showMergeNodesModal}
                   onClose={() => dispatch({type: "SWITCHSHOWMERGENODESMODAL"})}>
                {body}
            </Modal>
        </div>
    )
}

const mergeNodes = (graphState, generalState, dispatch) => {
    console.log(graphState.mergeNodesName)
    const {symbolType, color} = graphState.data.nodes.find(node => node.id === graphState.mergeNodesName)
    const mergeLinks = graphState.data.links.map(link => {
        if (graphState.mergeNodes.includes(link.source)) {
            link.source = graphState.mergeNodesName
        }
        if (graphState.mergeNodes.includes(link.target)) {
            link.target = graphState.mergeNodesName
        }
        return link
    })

    const mergeNodes = graphState.data.nodes.filter(node => !graphState.mergeNodes.includes(node.id))
    mergeNodes.push({id: graphState.mergeNodesName, opacity: 1, symbolType: symbolType, x: 0, y: 0, color: color})

    for (const node of graphState.mergeNodes) {
        updateElementsInReactionArray(
            node,
            {
                x: 0,
                y: 0,
                name: graphState.mergeNodesName
            },
            generalState.reactionsInSelectArray,
            dispatch)
    }

    const data = {nodes: mergeNodes, links: mergeLinks}
    dispatch({type: "SETDATA", payload: data})
    dispatch({type: "EMPTY_MERGE_NODES"})
    dispatch({
        type: "ADD_MERGE_NODES_TO_AUDIT_TRAIL", payload: {
            merged_source: graphState.mergeNodes,
            merged_name: graphState.mergeNodesName
        }
    })
}

export default MergeNodesModal

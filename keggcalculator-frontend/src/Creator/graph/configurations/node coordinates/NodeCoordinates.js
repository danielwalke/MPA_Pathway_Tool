import Modal from "@material-ui/core/Modal";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {useStyles} from "../../../ModalStyles/ModalStyles";
import TextField from "@material-ui/core/TextField";

const NodeCoordinates = () => {
    const dispatch = useDispatch()
    const graphState = useSelector(state => state.graph)
    const classes = useStyles()

    const handleCoordinateChange = async (node) => {
        await dispatch({type: "SETDATA", payload: {nodes: [], links: graphState.data.links}})
        graphState.data.nodes.push({
            id: `${node.id}`,
            opacity: node.opacity,
            symbolType: node.symbolType,
            color: node.color,
            x: +graphState.x,
            y: +graphState.y
        })
        const data = {nodes: graphState.data.nodes, links: graphState.oldData.links}
        await dispatch({type: "SETDATA", payload: data})
    }
    const body = (
        <div className={classes.paper} style={{width: "80vw"}}>
            {graphState.oldData.nodes.map(node => {
                return (<div style={{display: "grid"}}>
                        <div>{node.id}</div>
                        <div>x: <TextField type={"text"} id={"x coordinates"}
                                           defaultValue={node.x.toString()}
                                           onChange={(e) => {
                                               // handleDelete(node)
                                               dispatch({type: "SETX", payload: e.target.value})
                                           }}/></div>
                        <div>
                            y: <TextField type={"text"} id={"y coordinates"}
                                          defaultValue={node.y.toString()}
                                          onChange={(e) => {
                                              // handleDelete(node)
                                              dispatch({type: "SETY", payload: e.target.value})
                                          }}/>
                        </div>
                        <div>
                            <button className={"download-button"} onClick={() => handleCoordinateChange(node)}>submit
                            </button>
                        </div>
                    </div>
                )
            })}
        </div>
    )
    return (
        <div>
            <Modal style={{width: "90vw", margin: "5vw", overflow: "auto"}}
                   open={graphState.showNodeCoordinatesModal}
                   onClose={() => dispatch({type: "SWITCHSHOWNODECOORDINATESMODAL"})}>
                {body}
            </Modal>
        </div>
    )
}

export default NodeCoordinates

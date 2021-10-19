import React from "react";
import {Graph} from "react-d3-graph";
import {useDispatch, useSelector} from "react-redux";
import {handleSubmit} from "../../keggReaction/substrate and products/SubmitHandler";
import clonedeep from "lodash/cloneDeep"
import {NOT_KEY_COMPOUND_OPACITY} from "../Constants";
import {isColliding} from "../collision/CollisionCheck";
import Example from "../../upload/example/Example";
import Typography from "@material-ui/core/Typography";
import {Card} from "@material-ui/core";

const onClickNode = (nodeId, dispatch, graphState, keggState) => {
    const setProducts = ({productList, prodReactionsMap}) => {
        dispatch({type: "SETPRODUCTS", payload: productList})
        dispatch({type: "SETPRODUCTREACTIONMAP", payload: prodReactionsMap})
    }
    // the graph configuration, you only need to pass down properties
// that you want to override, otherwise default ones will be used
    if (nodeId.match(/[R,UP][0-9][0-9][0-9][0-9][0-9]/) != null) {
        dispatch({type: "SETCHOSENNODE", payload: nodeId.substring(nodeId.length - 6, nodeId.length)})
        dispatch({type: "SETSHOWINFO", payload: true})
    }
    if (nodeId.match(/[C,G][0-9][0-9][0-9][0-9][0-9]/) != null) {
        dispatch({type: "SWITCHSHOWNEXTREACTION"})
        dispatch({type: "SWITCHLOADING"})
        dispatch({type: "SETSUBSTRATE", payload: nodeId})
        handleSubmit(nodeId.substring(nodeId.length - 6, nodeId.length), graphState, keggState, dispatch)
            .then(({productList, prodReactionsMap}) => setProducts({productList, prodReactionsMap}))
            .then(() => dispatch({type: "SWITCHLOADING"}))
    }
}

const onRightClickNode = (e, nodeId, dispatch, graphState) => {
    e.preventDefault()
    dispatch({type: "SWITCHDELETEMODAL"})
    dispatch({type: "SETDELETENODE", payload: nodeId})

}

const handleNodePositionChange = (graphState, x, y, nodeId, dispatch) => {
    const nodes = graphState.data.nodes.map(node => {
        if (node.id === nodeId) {
            node.x = +x
            node.y = +y
        }
        return node
    })
    const targetNode = nodes.find(node => node.id === nodeId)
    const otherNodes = nodes.filter(node => node.id !== nodeId)
    const newNodes = isColliding(targetNode, otherNodes)
    const data = {nodes: newNodes, links: graphState.data.links}
    dispatch({type: "SETDATA", payload: data})
}

const GraphVisualization = () => {
    const graphState = useSelector(state => state.graph)
    const keggState = useSelector(state => state.keggReaction)
    const dispatch = useDispatch()

    const labelCallbackNodes = (node) => {
        if (typeof graphState.abbreviationsObject[`${node.id}`] !== "undefined") {
            return graphState.abbreviationsObject[`${node.id}`]
        } else if (node.id.includes("__")) {
            const idEntries = node.id.split("__")
            return idEntries[1]
        } else {
            return node.id
        }

    }
    const myConfig = {
        height: 0.75 * window.innerHeight,
        width: 0.95 * window.innerWidth,
        nodeHighlightBehavior: true,
        directed: true,
        node: {
            size: graphState.nodeSize,
            highlightStrokeColor: "blue",
            labelProperty: labelCallbackNodes
        },
        link: {
            highlightColor: "lightblue",
            strokeWidth: 2
        },
        d3: {
            gravity: -80,
            linkStrength: 1.2,
            disableLinkForce: graphState.isForceDisabled
        }
    };

    React.useEffect(() => {
        myConfig.node.labelProperty = labelCallbackNodes
    }, [graphState.abbreviationsObject, graphState.data.nodes])


    const handleDoubleClick = (node) => {
        // let nodeId
        // if(node.includes("__")){
        //     const index = node.split("__")
        //     nodeId = `${index}${node.substring(node.length - 6, node.length)}`
        // }else{
        //     nodeId = node.substring(node.length - 6, node.length)
        // }
        const compound = graphState.data.nodes.filter(graphNode => graphNode.id === node)[0]
        dispatch({type: "SETOLDDATA", payload: graphState.data})
        dispatch({type: "SETCHOSENCOMPOUND", payload: clonedeep(compound)})
        dispatch({type: "SETDOUBLECLICKEDNODE", payload: node})
        dispatch({type: "SWITCHSHOWSTRUCTURE"})

    }

    const handleClickLink = (source, target) => {
        const chosenLinks = graphState.data.links.filter(link => link.source === source && link.target === target)
        const otherLinks = graphState.data.links.filter(link => link.source !== source || link.target !== target)
        chosenLinks.map(chosenLink => {
            if (chosenLink.opacity === 1) {
                chosenLink.opacity = NOT_KEY_COMPOUND_OPACITY
            } else {
                chosenLink.opacity = 1
            }
            otherLinks.push(chosenLink)
            return null;
        })
        const data = {nodes: graphState.data.nodes, links: otherLinks}
        dispatch({type: "SETDATA", payload: data})
    }

    if (graphState.data.nodes.length > 0) {
        return (
            <div>
                <Graph
                    bottom={0}
                    id="graph"
                    data={graphState.data}
                    config={myConfig}
                    onClickNode={(nodeId) => onClickNode(nodeId, dispatch, graphState, keggState)}
                    onRightClickNode={(event, nodeId) => onRightClickNode(event, nodeId, dispatch, graphState)}
                    onDoubleClickNode={(node) => handleDoubleClick(node)}
                    onClickLink={(source, target) => handleClickLink(source, target)}
                    onNodePositionChange={(id, x, y) => handleNodePositionChange(graphState, x, y, id, dispatch)}
                />
            </div>
        )
    }
    return (
        <div style={{display:"flex", justifyContent: "center"}}>
            <Card style={{width:"60vw", height: "80vh", padding: "10px"}}>
                <Typography variant="h5" component="h1" style={{fontSize:"2rem"}}> Upload a pathway or start
                    building your own pathway from scratch!</Typography>
                <div style={{padding: "5px"}}>
                    <a href={"https://www.youtube.com/channel/UCf_p5aayjVS5BXfaCHbsX1Q"}><Typography>Click here for watching
                        our
                        tutorials!</Typography></a>
                </div>
                <div style={{padding: "5px"}}>
                    <a href={"https://github.com/danielwalke/MPA_Pathway_Tool/tree/main/pathway%20examples"}><Typography>Click
                        here for already created pathway files!</Typography></a>
                </div>
                <div style={{padding: "5px"}}>
                    <a href={"https://github.com/danielwalke/MPA_Pathway_Tool"}><Typography>Click here for the source
                        code!</Typography></a>
                </div>
                <Typography variant="h5" component="h5">Do you want an example? Click on the following button: </Typography>
                <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <div style={{width: "20vw"}}>
                        <Example/>
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default GraphVisualization


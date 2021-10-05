import React from "react";
import {Graph} from "react-d3-graph";
import {useDispatch, useSelector} from "react-redux";
import Infromation from "../Information";
import {handleSubmit} from "../../../Creator/keggReaction/substrate and products/SubmitHandler";
import clonedeep from "lodash/cloneDeep"

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
        dispatch({type:"SWITCHSHOWNEXTREACTION"})
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

const handleNodePositionChange = (graphState, x, y, nodeId,dispatch)=>{
    const nodes = graphState.data.nodes.map(node => {
        if(node.id === nodeId){
            node.x = +x
            node.y = +y
        }
        return node
    })
    const data = {nodes: nodes, links: graphState.data.links}
    dispatch({type:"SETDATA", payload: data})

}

const GraphVisualization_flux = () => {
    const graphState = useSelector(state => state.graph)
    const keggState = useSelector(state => state.keggReaction)
    const dispatch = useDispatch()

    const labelCallbackNodes = (node) =>{
        if(typeof graphState.abbreviationsObject[`${node.id}`] !== "undefined"){
            return graphState.abbreviationsObject[`${node.id}`]
        }else if(node.id.includes("__")){
            const idEntries = node.id.split("__")
            return idEntries[1]
        }
        else{
            return node.id
        }

    }
    const showFluxrate = (link) => {
        if(typeof graphState.fbaSolution[''] !== 'null'){
            return graphState.fbaSolution['']
        }
        else{
            return "null";
        }
    }

    const fluxRate = (f) => {
        if(f >=0 & f <=100 ){
            return 1
        }
        else if(f>100 & f<=200){
            return 1.5
        }
        else if(f>200 & f<= 500){
            return 2
        }
        else if (f<0){
            return 0.5
        }
        else{
            return 1
        }
    }

    const myConfig = {
        height: 0.75*window.innerHeight,
        width:  0.95*window.innerWidth,
        nodeHighlightBehavior: true,

        directed: true,
        node: {
            size: graphState.nodeSize,

            highlightStrokeColor: "yellow",
            labelProperty: labelCallbackNodes
        },
        link: {
            labelProperty: graphState.fbaSolution,
            linkColor: 'red',
            strokeWidth:showFluxrate(100), //this will change accordingly to flux rate
            linkStrength: 5


        },
        d3: {
            gravity: -80,
            linkStrength: 5.0,
            disableLinkForce: graphState.isForceDisabled
        }
    };

    React.useEffect( () => {
        myConfig.link.labelProperty = showFluxrate()
    }, [graphState.fbaSolution, graphState.data.links])

    React.useEffect(()=> {
        myConfig.node.labelProperty = labelCallbackNodes
    },[graphState.abbreviationsObject, graphState.data.nodes])


    const handleDoubleClick = (node) => {
        // let nodeId
        // if(node.includes("__")){
        //     const index = node.split("__")
        //     nodeId = `${index}${node.substring(node.length - 6, node.length)}`
        // }else{
        //     nodeId = node.substring(node.length - 6, node.length)
        // }
        const compound = graphState.data.nodes.filter(graphNode => graphNode.id === node)[0]
        dispatch({type:"SETOLDDATA", payload: graphState.data})
        dispatch({type:"SETCHOSENCOMPOUND", payload: clonedeep(compound)})
        dispatch({type: "SETDOUBLECLICKEDNODE", payload: node})
        dispatch({type: "SWITCHSHOWSTRUCTURE"})

    }

    const handleClickLink = (source,target) =>{
        const chosenLinks = graphState.data.links.filter(link => link.source === source && link.target ===target)
        const otherLinks = graphState.data.links.filter(link => link.source !== source || link.target !==target)
        chosenLinks.map(chosenLink=>{
            if(chosenLink.opacity===1){
                chosenLink.Flux = 100
                chosenLink.opacity = 0.4
                chosenLink.highlightColor = 'red'

            }else{
                chosenLink.opacity=1

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
                    onClickLink={(source,target)=> handleClickLink(source,target)}
                    onNodePositionChange={(id,x,y)=> handleNodePositionChange(graphState, x, y, id,dispatch)}
                />
                <div>
                    <Infromation></Infromation>
                </div>
            </div>

        )
    }
    return (
        <div>
            <h3>upload or build network</h3>
        </div>
    )
}

export default GraphVisualization_flux


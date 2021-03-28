import Modal from "@material-ui/core/Modal";
import React from "react";
import {makeStyles} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {getStructureBody} from "./StuctureModalBody";

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        fontFamily: "Roboto",
        border: '2px solid rgb(150, 25, 130)',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    }
}));


const StructureModal = () => {
    const generalState = useSelector(state => state.general)
    const state = useSelector(state => state.graph)
    const dispatch = useDispatch()
    // const [x, setX] = useState("")
    // const [y, setY] = useState("")
    // const [compound, setCompound] = useState({id: ""})
    let body;
    if(state.doubleClickNode.length>0){
         body = getStructureBody(state,dispatch, generalState)
    }

    // useEffect(() => {
    //     if (state.data.nodes.length > 1) {
    //         setX(+getNodePosition(state.doubleClickNode).x)
    //         setCompound(state.data.nodes.filter(node => node.id.substring(node.id.length - 6, node.id.length) === state.doubleClickNode)[0])
    //         // getNodePosition(state.doubleClickNode).y
    //     }
    // }, [state.doubleClickNode])
    // const handleXChange = (e) => {
    //     setX(+e.target.value)
    // }
    // const handleSubmitX = () => {
    //     const newNodes = state.data.nodes.map(node => {
    //         const id = node.id.substring(node.id.length - 6, node.id.length)
    //         if (node.id === compound.id) {
    //             node.x = x
    //             node.y = 30
    //         } else {
    //             node.x = +getNodePosition(id).x
    //             node.y = +getNodePosition(id).y
    //         }
    //         return node
    //     })
    //     const data = {nodes: newNodes, links: state.data.links}
    //     dispatch({type: "SETDATA", payload: data})
    // }

    return (
        <div>
            <Modal style={{width: "90vw", marginLeft: "5vw", maxHeight:"80vh", overflow:"auto", marginTop: "10vh"}} open={state.showStructure}
                   onClose={() => dispatch({type: "SWITCHSHOWSTRUCTURE"})}>

                {body}
            </Modal>
        </div>
    )
}

export default StructureModal
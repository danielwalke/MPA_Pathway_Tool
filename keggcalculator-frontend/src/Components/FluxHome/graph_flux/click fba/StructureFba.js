// import Modal from "@material-ui/core/Modal";
// import React, {useState} from "react";
// import {useDispatch, useSelector} from "react-redux";
//
// import {getStructureBody} from "../double click node/StuctureModalBody"
//
// import {useStyles} from "../../../../Creator/ModalStyles/ModalStyles"
//
// const StructureFba = () => {
//     const generalState = useSelector(state => state.general)
//     const state = useSelector(state => state.graph)
//     const dispatch = useDispatch()
//     const [isNcbiTaxonomy, setIsNcbiTaxonomy] = useState(true)
//     const classes = useStyles()
//     let body;
//
//     if(generalState.new_click_node.length>0){
//         console.log(generalState.new_click_node);
//         body = getStructureBody(state,dispatch, generalState,isNcbiTaxonomy, setIsNcbiTaxonomy)
//     }
//
//     return (
//         <div>
//             <Modal className={classes.modal} open={generalState.showfbastructure}
//                    onClose={() => dispatch({type: "SWITCHSHOWFBASTRUCTURE"})}>
//                 {body}
//             </Modal>
//         </div>
//     )
// }
//
// export default StructureFba;
//

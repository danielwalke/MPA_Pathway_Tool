import Modal from "@material-ui/core/Modal";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import DeleteIcon from '@material-ui/icons/Delete';
import {getTaxaList} from "../../graph/double click node/StuctureModalBody";
import {ToolTipBig} from "../../main/user-interface/UserInterface";
import {useStyles} from "../../ModalStyles/ModalStyles";

const ReactionDetails = () => {
    const state = useSelector(state => state.specificReaction)
    const dispatch = useDispatch()

    const classes = useStyles()
    const body = (
        <div style={{backgroundColor: "white", overflow: "auto", height: "60vh", padding: "5px"}}>
            Substrates:
            <ul style={{listStyleType: "none"}}>
                {state.specSubstrates.map((substrate, index) => <li key={substrate.concat(index.toString())}>
                    <ToolTipBig
                        title={"Delete substrate from reaction"}
                        placement={"left"}><DeleteIcon
                        onClick={() => dispatch({type: "SPLICESUBSTRATES", payload: index})}
                        style={{transform: "translate(0,4px)"}}/></ToolTipBig>{state.specSubstratesCoeff[index]} {substrate}
                </li>)}
            </ul>
            Products:
            <ul>
                {state.specProducts.map((product, index) => <li
                    key={product.concat(index.toString())}><ToolTipBig
                    title={"Delete product from reaction"}
                    placement={"left"}><DeleteIcon
                    onClick={() => dispatch({type: "SPLICEPRODUCTS", payload: index})}
                    style={{transform: "translate(0,4px)"}}/></ToolTipBig>{state.specProductsCoeff[index]} {product}
                </li>)}
            </ul>
            Reaction: {state.specReaction}
            <br/>
            KO- numbers:
            <ul>
                {state.specKoNumbers.map((ko, index) => <li key={ko.concat(index.toString())}><ToolTipBig
                    title={"Delete K number from reaction"}
                    placement={"left"}><DeleteIcon
                    onClick={() => dispatch({type: "SPLICEKONUMBERS", payload: index})}
                    style={{transform: "translate(0,4px)"}}/></ToolTipBig>{ko}</li>)}
            </ul>
            EC-numbers:
            <ul>
                {state.ecNumbers.map((ec, index) => <li key={ec.concat(index.toString())}><ToolTipBig
                    title={"Delete EC number from reaction"}
                    placement={"left"}><DeleteIcon
                    onClick={() => dispatch({type: "SPLICEECNUMBERS", payload: index})}
                    style={{transform: "translate(0,4px)"}}/></ToolTipBig>{ec}</li>)}
            </ul>
            Taxonomy:
            <ul>
                {getTaxaList(state.specTaxonomies).map((taxon, index) => <li key={taxon.concat(index.toString())}>
                    <ToolTipBig
                        title={"Delete taxonomic requirement from reaction"}
                        placement={"left"}><DeleteIcon
                        onClick={() => dispatch({type: "SPLICETAXONOMIES", payload: taxon})}
                        style={{transform: "translate(0,4px)"}}/></ToolTipBig>{taxon}</li>)}
            </ul>
        </div>
    )

    return (
        <div>
            <Modal className={classes.modal} open={state.showReactionDetails}
                   onClose={() => dispatch({type: "SWITCHSHOWREACTIONDETAILS"})}>
                {body}
            </Modal>
        </div>
    )
}

export default ReactionDetails

import {useStyles} from "../../../ModalStyles/ModalStyles";
import {useDispatch, useSelector} from "react-redux";
import Modal from "@material-ui/core/Modal";
import React from "react";
import PathwayTaxonomy from "./PathwayTaxonomy";

export default function PathwayTaxonomyModal (){
    const classes = useStyles()
    const state = useSelector(state => state)

    const dispatch = useDispatch()

    return (
        <Modal className={classes.modal} open={state.general.showPathwayTaxonomyModal} onClose={() => {
            dispatch({type: "SHOW_PATHWAY_TAXONOMY_MODAL", payload: false})
            dispatch({type: "SHOW_PATHWAY_TAXONOMY_CONFIGURATION", payload: false})
        }}>
            <div className={classes.paper}>
                <div className={"annotation-modal"}>
                    {
                        state.general.showPathwayTaxonomyModal &&
                        state.general.showPathwayTaxonomyConfiguration &&
                        <PathwayTaxonomy/>
                    }
                </div>
            </div>
        </Modal>
    );
};

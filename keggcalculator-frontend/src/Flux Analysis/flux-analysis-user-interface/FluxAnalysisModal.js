import React from "react";
import {useStyles} from "../../Creator/ModalStyles/ModalStyles";
import {useDispatch, useSelector} from "react-redux";
import Modal from "@material-ui/core/Modal";
import {ResultTable} from "./ResultTable";
import AutopacmenConfiguration from "./AutopacmenConfiguration";

export default function FluxAnalysisModal() {
    const classes = useStyles()
    const state = useSelector(state => state)
    const dispatch = useDispatch()

    const handleClose = () => {
        dispatch({type: "SHOW_FLUX_ANALYSIS_MODAL", payload: false})
        dispatch({type: "SHOW_FBA_RESULT_TABLE", payload: false})
    }

    return(
        <Modal className={classes.modal} open={state.fluxAnalysis.showFluxAnalysisModal} onClose={() => handleClose()}>
            <div className={classes.paper}>
                {
                    state.fluxAnalysis.showFluxAnalysisModal &&
                    state.fluxAnalysis.showFBAResultTable &&
                    <div className={"annotation-modal"}>
                        <ResultTable/>
                    </div>
                }
                {
                    state.fluxAnalysis.showFluxAnalysisModal &&
                    state.fluxAnalysis.showAutopacmenConfig &&
                    <div className={"small-modal"}>
                        <AutopacmenConfiguration />
                    </div>
                }
            </div>
        </Modal>
    )
}

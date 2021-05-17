import Modal from "@material-ui/core/Modal";
import React from "react";
import {useStyles} from "../ModalStyles/ModalStyles";
import {useDispatch, useSelector} from "react-redux";
import HeatMapCsvExporter from "./heatmap download/HeatMapCsvExporter";
import GraphSvgExporter from "./svg download/GraphSvgExporter";
import JSONDownloader from "./json download/JSONDownloader";
import SBMLDownloader from "./sbml download/SBMLDownloader";
import StoichiometricMatrix from "./stochiometricMatrix/StoichiometricMatrix";
import CsvDownLoader from "./csv download/CsvDownLoader";

const DonwloadModal = () =>{
    const classes = useStyles();
    const state = useSelector(state => state.general)
    const dispatch = useDispatch();
    const body = (
        <div className={classes.paper}>
            <CsvDownLoader/>
            <JSONDownloader/>
            <SBMLDownloader/>
            <GraphSvgExporter/>
            <HeatMapCsvExporter/>
            <StoichiometricMatrix/>
        </div>
    )
    return(
        <div>
            <Modal className={classes.modal} open={state.downloadModal} onClose={() => dispatch({type: "SWITCHDOWNLOADMODAL"})}>
                {body}
            </Modal>
        </div>
    )
}

export default DonwloadModal;
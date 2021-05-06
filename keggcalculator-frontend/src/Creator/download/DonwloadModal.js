import Modal from "@material-ui/core/Modal";
import React from "react";
import {useStyles} from "../ModalStyles/ModalStyles";
import {useDispatch, useSelector} from "react-redux";
import HeatMapCsvExporter from "../graph/HeatMapCsvExporter";
import GraphSvgExporter from "./GraphSvgExporter";
import DownloadGraph from "./DownloadGraph";
import JSONDownloader from "./JSONDownloader";
import SBMLDownloader from "./SBMLDownloader";
import StoichiometricMatrix from "../stochiometricMatrix/StoichiometricMatrix";

const DonwloadModal = () =>{
    const classes = useStyles();
    const state = useSelector(state => state.general)
    const dispatch = useDispatch();
    const body = (
        <div className={classes.paper}>
            <DownloadGraph/>
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
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
    const generalState = useSelector(state => state.general)
    const graphState = useSelector(state => state.graph)
    const dispatch = useDispatch();

    const body = (
        <div className={classes.paper}>
            {/*<CsvDownloader/>*/}
            <CsvDownLoader generalState={generalState} graphState={graphState}/>
            <JSONDownloader generalState={generalState} graphState={graphState}/>
            <SBMLDownloader generalState={generalState} graphState={graphState}/>
            <GraphSvgExporter graphState={graphState}/>
            <HeatMapCsvExporter generalState={generalState} graphState={graphState}/>
            <StoichiometricMatrix generalState={generalState} graphState={graphState}/>
        </div>
    )
    return(
        <div>
            <Modal className={classes.modal} open={generalState.downloadModal} onClose={() => dispatch({type: "SWITCHDOWNLOADMODAL"})}>
                {body}
            </Modal>
        </div>
    )
}

export default DonwloadModal;
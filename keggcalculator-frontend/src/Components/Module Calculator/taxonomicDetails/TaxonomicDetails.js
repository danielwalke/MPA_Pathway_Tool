import React, {useState} from 'react';
import GetAppIcon from "@material-ui/icons/GetApp";
import Button from "@material-ui/core/Button";
import {requestGenerator} from "../../../Request Generator/RequestGenerator";
import * as RequestURL from "../../../App Configurations/RequestURLCollection";
import {Modal} from "@material-ui/core";
import {useStyles} from "../../../Creator/ModalStyles/ModalStyles";
import TaxonomicDetailsBody from "./TaxonomicDetailsBody";
import {ToolTipBig} from "../../../Creator/main/user-interface/UserInterface";


const TaxonomicDetails = (props) => {
    const [data, setData] = useState("")
    const [open, setOpen] = useState(false)
    const [alreadyReceived, setAlreadyReceived] = useState(false)

    const classes = useStyles();

    const handleDetails = () => {
        if (!alreadyReceived) { //just fetch once -> file should be deleted after time limit but data should stay available
            requestGenerator("POST", RequestURL.endpoint_getTaxonomicDetails, {jobId: props.jobId}, "", "").then(response => {
                setData(response.data.trim())
                setOpen(true)
                setAlreadyReceived(true)
            })
        } else {
            setOpen(true)
        }
    }

    return (
        <div>
            <Modal className={classes.modal} open={open} onClose={() => setOpen(false)}><TaxonomicDetailsBody
                classes={classes} data={data} jobId={props.jobId} CalculatorStore={props.CalculatorStore}/></Modal>
            <ToolTipBig title={"See details about mapping"} placement={"top"}>
                <Button variant={"contained"} disabled={props.isNotFinished}
                        color={"primary"} endIcon={<GetAppIcon/>}
                        onClick={() => handleDetails()}>See details</Button>
            </ToolTipBig>
        </div>
    );
};

export default TaxonomicDetails;

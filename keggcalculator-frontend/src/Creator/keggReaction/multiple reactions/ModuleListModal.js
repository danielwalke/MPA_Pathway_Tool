import React from "react";
import {makeStyles} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import Modal from "@material-ui/core/Modal";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {isRequestValid} from "../../request/RequestValidation";
import {requestGenerator} from "../../request/RequestGenerator";
import {handleGraphUpload, handleReactionListUpload} from "../../upload/csv upload/module file/ModuleUploadFunctions";
import {endpoint_getModule} from "../../../App Configurations/RequestURLCollection";

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
const moduleUrl = endpoint_getModule
const ModuleListModal = () => {
    const state = useSelector(state => state.general)
    const graphState = useSelector(state => state.graph)
    const dispatch = useDispatch()
    const classes = useStyles()
    const handleAutoChange = (e) => {
        const {value} = e.target
        dispatch({type: "SETMODULE", payload: value})
    }

    const handleSubmitModule = () => {
        dispatch({type: "SWITCHLOADING"})
        const moduleId = state.module.substring(state.module.length-6, state.module.length)
        requestGenerator("POST", moduleUrl, {moduleId: moduleId}, "", "")
            .then(response => {
                const result = response.data.trim()
                const rows = result.split("\n")
                rows.shift() //header
                const {nodes, links} = handleGraphUpload(rows, dispatch, graphState)
                const reactionList = handleReactionListUpload(rows)
                const data = {nodes: nodes, links: links}
                dispatch({type: "SWITCHLOADING"})
                dispatch({type: "SETDATA", payload: data})
                dispatch({type: "SETDATALINKS", payload: links})
                dispatch({type: "ADDREACTIONSTOARRAY", payload: reactionList})
            })
    }
    const body = (
        <div className={classes.paper} style={{width:"40vw", display:"grid", gridTemplateColumns:"8fr 2fr"}} >
            <Autocomplete
                size={"small"}
                id={`combo-box-1 module`}
                options={state.moduleList}
                onChange={(event, value) => {
                    dispatch({type: "SETMODULE", payload: value})
                }}
                renderInput={params => (
                    <TextField
                        onChange={(e) => handleAutoChange(e)}
                        value={state.module}
                        {...params}
                        label={"module List"}
                        variant="outlined"
                    />
                )}
            />
            <button disabled={!isRequestValid(state.module)} className={"downloadButton"} onClick={()=> handleSubmitModule()}>submit</button>
        </div>
    )


    return (
        <Modal className={classes.modal} open={state.showModuleList}
               onClose={() => dispatch({type: "SWITCHSHOWMODULELIST"})}>
            {body}
        </Modal>
    )
}

export default ModuleListModal
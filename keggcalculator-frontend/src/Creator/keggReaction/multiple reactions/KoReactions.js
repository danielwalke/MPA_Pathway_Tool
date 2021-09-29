import React from "react";
import {makeStyles} from "@material-ui/core";
import Modal from "@material-ui/core/Modal";
import {useDispatch, useSelector} from "react-redux";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import DeleteIcon from "@material-ui/icons/Delete";
import {requestGenerator} from "../../request/RequestGenerator";
import {handleDrawGraph} from "./EcReactions";
import {endpoint_getReactionsByKoList, endpoint_getReactionUrl} from "../../../App Configurations/RequestURLCollection";

const reactionUrl = endpoint_getReactionUrl
const koUrl = endpoint_getReactionsByKoList
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

const KoReactions = () => {
    const state = useSelector(state => state.keggReaction)
    const classes = useStyles();
    const dispatch = useDispatch();
    const graphState = useSelector(state => state.graph)
    const generalState = useSelector(state => state.general)

    const handleAutoChange = (e) => {
        const {value} = e.target
        dispatch({type: "SETKONUMBERREQUEST", payload: value})
    }

    const handleKoRequest = () => {
        dispatch({type: "SWITCHLOADING"})
        let koString = "";
        for (const ko of state.koNumbersRequest) {
            koString += ko.substring(ko.length - 6, ko.length).toString();
            koString += "\n";
        }
        requestGenerator("POST", koUrl, {koNumbers: koString.trim()}, "", "")
            .then(response => {
                dispatch({type: "SETKOTOREACTIONOBJECT", payload: response.data})
                dispatch({type: "SWITCHLOADING"})
                return null;
            })
    }

    const handleReactionOptions = (ko) => {
        const koId = ko.substring(ko.length - 6, ko.length)
        return state.koToReactionObject[`${koId}`]
    }

    const handleAddReaction = (reaction) => {
        reaction.reactionName = reaction.reactionName.concat(" " + reaction.reactionId)
        dispatch({type: "ADDREACTIONSTOARRAY", payload: [reaction]})
    }

    const handleReactionSubmit = () => {
        const reactionId = state.reactionOfKo.substring(state.reactionOfKo.length - 6, state.reactionOfKo.length).toString()
        requestGenerator("POST", reactionUrl, {reactionId: reactionId}, "", "")
            .then(response => {
                const reaction = response.data;
                handleDrawGraph(reaction, state, dispatch, graphState, generalState, generalState.keggReactions);
                handleAddReaction(reaction);
                return null;
            })
    }

    const body = (
        <div className={classes.paper} style={{width: "60vw", height: "80vh", overflow: "auto"}}>
            <div style={{display: "grid", gridTemplateColumns: "8fr 2fr"}}>
                <TextField
                    className={"koRequest"}
                    size={"small"}
                    label="koRequest"
                    variant="outlined"
                    id="koRequest"
                    value={state.koNumbersRequestText}
                    placeholder={"K01234;K56789"}
                    onChange={(e) => dispatch({
                        type: "SETKONUMBERSREQUESTTEXT",
                        payload: e.target.value.toString()
                    })}
                />
                <button className={"downloadButton"}
                        onClick={() => dispatch({type: "SETKONUMBERSREQUEST", payload: state.koNumbersRequestText})}>set
                    ko numbers
                </button>
            </div>
            <div style={{display: "grid", gridTemplateColumns: "8fr 2fr"}}>
                <div><Autocomplete
                    size={"small"}
                    id="combo-box-demo"
                    options={state.koNumberSet}
                    className={"substrate"}
                    name={"koNumberSet"}
                    onChange={(event, value) => {
                        dispatch({type: "SETKONUMBERREQUEST", payload: value})
                    }}
                    renderInput={params => (
                        <TextField
                            onChange={(e) => handleAutoChange(e)}
                            value={state.koNumberRequest}
                            {...params}
                            label="Initialize"
                            variant="outlined"
                        />
                    )}
                /></div>
                <button className={"downloadButton"}
                        onClick={() => dispatch({type: "ADDKONUMBERREQUEST", payload: state.koNumberRequest})}>add ko
                    number
                </button>
            </div>
            <ul style={{listStyleType: "none"}}>
                {state.koNumbersRequest.map((ko, index) => {
                    return (
                        <li key={index} style={{border: "2px solid rgb(150, 25, 130)"}}>
                            <DeleteIcon
                                onClick={() => dispatch({type: "SPLICEKONUMBERSREQUEST", payload: index})}/>{ko}
                            {typeof handleReactionOptions(ko) === "undefined" ? null : <div>
                                <Autocomplete
                                    size={"small"}
                                    options={handleReactionOptions(ko)}
                                    className={"substrate"}
                                    name={"reactionsOfKoSet"}
                                    onChange={(event, value) => {
                                        dispatch({type: "SETREACTIONOFKO", payload: value})
                                    }}
                                    renderInput={params => (
                                        <TextField
                                            onChange={(e) => dispatch({
                                                type: "SETREACTIONOFKO",
                                                payload: e.target.value
                                            })}
                                            value={state.reactionOfKo}
                                            {...params}
                                            label="Initialize"
                                            variant="outlined"
                                        />
                                    )}
                                />
                                <button className={"downloadButton"} onClick={() => handleReactionSubmit()}>Submit
                                </button>
                            </div>

                            }
                        </li>
                    )
                })}
            </ul>
            <button className={"downloadButton"} onClick={() => handleKoRequest()}>Submit</button>
        </div>
    )
    return (
        <Modal className={classes.modal} open={state.showKoModal} onClose={() => dispatch({type: "SWITCHSHOWKOMODAL"})}>
            {body}
        </Modal>
    )
}

export default KoReactions
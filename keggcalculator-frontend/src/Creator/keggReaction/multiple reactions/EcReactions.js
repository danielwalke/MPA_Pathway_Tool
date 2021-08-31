import React from "react"
import {requestGenerator} from "../../request/RequestGenerator";
import Modal from "@material-ui/core/Modal";
import {makeStyles} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import DeleteIcon from "@material-ui/icons/Delete";
import {getLengthMinusNFirstChars} from "../../usefulFunctions/Strings";
import {handleJSONGraphUpload} from "../../upload/json upload/ModuleUploadFunctionsJSON";
import {endpoint_getReactionsByEcList, endpoint_getReactionUrl} from "../../../App Configurations/RequestURLCollection";
import {ToolTipBig} from "../../main/user-interface/UserInterface";

const reactionUrl = endpoint_getReactionUrl
const ecUrl = endpoint_getReactionsByEcList

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

const getCompoundNameById = (compoundId2Name, compoundId) => compoundId2Name[compoundId]

const addCompound = (compounds, compoundId, stoichiometry, compoundId2Name) => {
    const compound = {}
    compound.x = 0
    compound.y = 0
    compound.stochiometry = stoichiometry
    compound.opacity = 1
    compound.name = getCompoundNameById(compoundId2Name, compoundId)
    compound.abbreviation = getLengthMinusNFirstChars(getCompoundNameById(compoundId2Name, compoundId), 6)
    compounds.push(compound)
}

const addCompounds = (stoichiometryCompounds, compoundId2Name) => {
    const compounds = []
    if (stoichiometryCompounds instanceof Map) {
        for (const [compoundId, stoichiometry] of stoichiometryCompounds.entries()) {
            addCompound(compounds, compoundId, stoichiometry, compoundId2Name)
        }
    } else {
        Object.keys(stoichiometryCompounds).forEach(key => {
            const compoundId = key
            const stoichiometry = stoichiometryCompounds[key]
            addCompound(compounds, compoundId, stoichiometry, compoundId2Name)
        })
    }
    return compounds
}

//used for drawing nodes in graph
export const handleDrawGraph = (reaction, state, dispatch, graphState, generalState, reactions) => {
    reaction.opacity = 1
    reaction.reactionName = `${reaction.reactionName} ${reaction.reactionId}`
    reaction.taxa = {}
    reaction.isForwardReaction = true
    reaction.abbreviation = getLengthMinusNFirstChars(reaction.reactionName, 6)
    reaction.reversible = false
    reaction.x = 0
    reaction.y = 0
    reaction.substrates = addCompounds(reaction.stochiometrySubstratesString, state.compoundId2Name)
    reaction.products = addCompounds(reaction.stochiometryProductsString, state.compoundId2Name)
    const data = handleJSONGraphUpload([...reactions, reaction], dispatch, graphState)
    dispatch({type: "ADDREACTIONSTOARRAY", payload: [reaction]})
    dispatch({type: "SETDATA", payload: data})
}

const EcReactions = () => {

    const dispatch = useDispatch()
    const generalState = useSelector(state => state.general)
    const state = useSelector(state => state.keggReaction)
    const classes = useStyles()
    const graphState = useSelector(state => state.graph)

    const handleAutoChange = (e) => {
        const {value} = e.target
        dispatch({type: "SETECNUMBERREQUEST", payload: value})
    }

    const handleAutoChangeReaction = (e) => {
        dispatch({type: "SETREACTIONOFEC", payload: e.target.value})
    }

    const handleReactionSubmit = () => {
        const reactionId = state.reactionOfEc.substring(state.reactionOfEc.length - 6, state.reactionOfEc.length).toString()
        requestGenerator("POST", reactionUrl, {reactionId: reactionId}, "", "")
            .then(response => {
                const reaction = response.data;
                dispatch({type: "ADD_EC_NUMBERS_TO_AUDIT_TRAIL", payload: reaction})
                handleDrawGraph(reaction, state, dispatch, graphState, generalState, generalState.keggReactions);
                return null;
            })
    }

    const handleEcRequest = () => {
        dispatch({type: "SWITCHLOADING"})
        let ecString = "";
        for (const ec of state.ecNumbersRequest) {
            ecString += ec.toString();
            ecString += "\n";
        }
        requestGenerator("POST", ecUrl, {ecNumbers: ecString.trim()}, "", "")
            .then(response => {
                dispatch({type: "SETECTOREACTIONOBJECT", payload: response.data})
                dispatch({type: "SWITCHLOADING"})
                return null;
            })
    }

    const handleReactionOptions = (ec) => {
        const ecRegEx = new RegExp("\\d\\.\\d*\\.\\d*\\.\\d*", "g")
        const ecRegExException = new RegExp("\\d\\.\\d*\\.\\d*\\.-", "g")
        let match
        let matchException
        let ecNumber
        while ((match = ecRegEx.exec(ec)) !== null) {
            ecNumber = match[0] //last ec number is set
        }
        while ((matchException = ecRegExException.exec(ec)) !== null) {
            ecNumber = matchException[0].substring(0, matchException[0].length - 1) //last ec number is set
        }
        return state.ecToReactionObject[`${ecNumber}`]
    }

    const body = (
        <div className={classes.paper} style={{width: "60vw", height: "80vh", overflow: "auto"}}>
            <div style={{display: "grid", gridTemplateColumns: "8fr 2fr"}}>
                <ToolTipBig title={"Type in multiple EC numbers separated by a semicolon"} placement={"right"}>
                    <TextField
                        className={"ecRequest"}
                        size={"small"}
                        label="ecRequest"
                        variant="outlined"
                        id="ecRequest"
                        value={state.ecNumbersRequestText}
                        placeholder={"1.1.1.1;1.1.1.2"}
                        onChange={(e) => dispatch({
                            type: "SETECNUMBERSREQUESTTEXT",
                            payload: e.target.value.toString()
                        })}
                    />
                </ToolTipBig>
                <ToolTipBig title={"Submit EC numbers to query"} placement={"right"}>
                    <button className={"downloadButton"} onClick={() => dispatch({
                        type: "SETECNUMBERSREQUEST",
                        payload: state.ecNumbersRequestText
                    })}>set ec numbers
                    </button>
                </ToolTipBig>
            </div>
            <div style={{display: "grid", gridTemplateColumns: "8fr 2fr"}}>

                <div>
                    <ToolTipBig title={"Search a single EC number"} placement={"right"}>
                        <Autocomplete
                            size={"small"}
                            id="combo-box-demo"
                            options={state.ecNumberSet}
                            className={"substrate"}
                            name={"ecNumberSet"}
                            onChange={(event, value) => {
                                dispatch({type: "SETECNUMBERREQUEST", payload: value})
                            }}
                            renderInput={params => (
                                <TextField
                                    onChange={(e) => handleAutoChange(e)}
                                    value={state.ecNumberRequest}
                                    {...params}
                                    label="Initialize"
                                    variant="outlined"
                                />
                            )}
                        /></ToolTipBig></div>
                <ToolTipBig title={"Add a single EC number to query"} placement={"right"}>
                    <button className={"downloadButton"}
                            onClick={() => dispatch({type: "ADDECNUMBERREQUEST", payload: state.ecNumberRequest})}>add
                        ec number
                    </button>
                </ToolTipBig>
            </div>
            <ul style={{listStyleType: "none"}}>
                {state.ecNumbersRequest.map((ec, index) => {
                    return (
                        <li key={index} style={{border: "2px solid rgb(150, 25, 130)"}}>
                            <ToolTipBig title={"Delete EC number from query"} placement={"right"}>
                                <DeleteIcon
                                    onClick={() => dispatch({
                                        type: "SPLICEECNUMBERSREQUEST",
                                        payload: index
                                    })}/></ToolTipBig>{ec}
                            {
                                typeof handleReactionOptions(ec) === "undefined" ? null : <div>
                                    <ToolTipBig title={"Search reaction"} placement={"right"}>
                                        <Autocomplete
                                            size={"small"}
                                            options={handleReactionOptions(ec)}
                                            className={"substrate"}
                                            name={"reactionsOfEcSet"}
                                            onChange={(event, value) => {
                                                dispatch({type: "SETREACTIONOFEC", payload: value})
                                            }}
                                            renderInput={params => (
                                                <TextField
                                                    onChange={(e) => handleAutoChangeReaction(e)}
                                                    value={state.reactionOfEc}
                                                    {...params}
                                                    label="Initialize"
                                                    variant="outlined"
                                                />
                                            )}
                                        />
                                    </ToolTipBig>
                                    <ToolTipBig title={"Submit chosen reaction"} placement={"right"}>
                                        <button className={"downloadButton"}
                                                onClick={() => handleReactionSubmit()}>Submit
                                        </button>
                                    </ToolTipBig>
                                </div>

                            }

                        </li>
                    )
                })}
                    </ul>
                    <button className={"downloadButton"} onClick={()=> handleEcRequest()}>Submit</button>
                    </div>
                    )
                    return(
                    <Modal className={classes.modal} open={state.showEcModal} onClose={() => dispatch({type: "SWITCHSHOWECMODAL"})}>
                {body}
                    </Modal>
                    )
                }
                    export default EcReactions

import React from "react"
import {requestGenerator} from "../../request/RequestGenerator";
import Modal from "@material-ui/core/Modal";
import {makeStyles} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import DeleteIcon from "@material-ui/icons/Delete";
import {
    COMPOUND_NODE_COLOR,
    COMPOUND_NODE_SYMBOL,
    REACTION_NODE_COLOR,
    REACTION_NODE_SYMBOL
} from "../../graph/Constants";
import {getLengthMinusNFirstChars} from "../../usefulFunctions/Strings";
import {handleJSONGraphUpload} from "../../upload/json upload/ModuleUploadFunctionsJSON";
const reactionUrl = "http://127.0.0.1/keggcreator/getreaction"
const ecUrl = "http://127.0.0.1/keggcreator/getreactionlistbyeclist"

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

const getCompoundNameById = (compoundId2Name, compoundId)=>compoundId2Name[compoundId]

const addCompound = (compounds, compoundId, stoichiometry,compoundId2Name) =>{
    const compound= {}
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
    if(stoichiometryCompounds instanceof Map){
        for(const [compoundId, stoichiometry] of stoichiometryCompounds.entries()){
            addCompound(compounds, compoundId, stoichiometry,compoundId2Name)
        }
    }
    else{
        Object.keys(stoichiometryCompounds).forEach(key =>{
            const compoundId = key
            const stoichiometry = stoichiometryCompounds[key]
            addCompound(compounds, compoundId, stoichiometry,compoundId2Name)
        })
    }
    return compounds
}

//used for drawing nodes in graph
export const handleDrawGraph = (reaction, state, dispatch, graphState,generalState) =>{
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
    const data = handleJSONGraphUpload([...generalState.keggReactions, reaction],dispatch, graphState)
    dispatch({type:"ADDREACTIONSTOARRAY", payload:[reaction]})
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

    const handleAutoChangeReaction = (e) =>{
        dispatch({type:"SETREACTIONOFEC", payload: e.target.value})
    }

    const handleReactionSubmit = () => {
        const reactionId = state.reactionOfEc.substring(state.reactionOfEc.length-6, state.reactionOfEc.length).toString()
        requestGenerator("POST", reactionUrl, {reactionId: reactionId}, "", "")
            .then(response => {
                const reaction  = response.data;
                handleDrawGraph(reaction, state, dispatch,graphState,generalState);
                return null;
            })
    }

    const handleEcRequest = () =>{
        dispatch({type: "SWITCHLOADING"})
        let ecString = "";
        for(const ec of state.ecNumbersRequest){
            ecString+= ec.toString();
            ecString+="\n";
        }
        requestGenerator("POST", ecUrl, {ecNumbers: ecString.trim()}, "", "")
            .then(response => {
                dispatch({type: "SETECTOREACTIONOBJECT", payload: response.data})
                dispatch({type: "SWITCHLOADING"})
                return null;
            })
    }

    const handleReactionOptions = (ec)=>{
        const ecRegEx = new RegExp("\\d\\.\\d*\\.\\d*\\.\\d*", "g")
        const ecRegExException = new RegExp("\\d\\.\\d*\\.\\d*\\.-", "g")
        let match
        let matchException
        let ecNumber
        while((match = ecRegEx.exec(ec))!==null){
            ecNumber = match[0] //last ec number is set
        }
        while((matchException = ecRegExException.exec(ec))!==null){
            ecNumber = matchException[0].substring(0, matchException[0].length-1) //last ec number is set
        }
        return state.ecToReactionObject[`${ecNumber}`]
    }

    const body = (
        <div className={classes.paper} style={{width:"60vw", height:"80vh",overflow: "auto" }} >
            <div style={{display:"grid", gridTemplateColumns:"8fr 2fr"}}>
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
                <button className={"downloadButton"} onClick={()=> dispatch({type:"SETECNUMBERSREQUEST", payload: state.ecNumbersRequestText})}>set ec numbers</button>
            </div>
            <div style={{display:"grid", gridTemplateColumns:"8fr 2fr"}}>

                <div><Autocomplete
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
                /></div>
                <button className={"downloadButton"} onClick={()=> dispatch({type:"ADDECNUMBERREQUEST", payload: state.ecNumberRequest})}>add ec number</button>
            </div>
            <ul style={{listStyleType: "none"}}>
                {state.ecNumbersRequest.map((ec, index) =>{
                    return(
                        <li key={index} style={{border: "2px solid rgb(150, 25, 130)"}}>
                            <DeleteIcon
                                onClick={() => dispatch({type: "SPLICEECNUMBERSREQUEST", payload: index})}/>{ec}
                            {
                                typeof handleReactionOptions(ec) === "undefined"? null : <div>
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
                                    <button className={"downloadButton"} onClick={()=> handleReactionSubmit()}>Submit</button>
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
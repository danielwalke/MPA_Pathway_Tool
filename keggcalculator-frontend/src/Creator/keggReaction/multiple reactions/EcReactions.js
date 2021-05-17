import React from "react"
import {requestGenerator} from "../../request/RequestGenerator";
import Modal from "@material-ui/core/Modal";
import {makeStyles} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import DeleteIcon from "@material-ui/icons/Delete";
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

//used for drawing nodes in graph
export const handleDrawGraph = (reaction, state, dispatch, graphState) =>{
    const data = graphState.data
    const substrates = Object.keys(reaction.stochiometrySubstratesString)
    const products = Object.keys(reaction.stochiometryProductsString)
    const substratesName = substrates.map(substrate => state.compoundId2Name[substrate])
    const productsName = products.map(product => state.compoundId2Name[product])
    substratesName.map(substrate => data.nodes.push({id:substrate, color: "darkgreen", opacity: 1,x:0,y:0}))
    productsName.map(product => data.nodes.push({id:product, color: "darkgreen", opacity: 1,x:0,y:0}))
    data.nodes.push({id:`${reaction.reactionName} ${reaction.reactionId}`, color: "black", opacity: 1, symbolType: "diamond",x:0,y:0, reversible:false})
    substratesName.map(substrate => data.links.push({source: substrate, target: `${reaction.reactionName} ${reaction.reactionId}`, opacity:1,isReversibleLink: false}))
    productsName.map(product => data.links.push({source: `${reaction.reactionName} ${reaction.reactionId}`, target: product, opacity:1,isReversibleLink: false}))
    dispatch({type: "SETDATA", payload: data})
}

const EcReactions = () => {

    const dispatch = useDispatch()
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

    const handleAddReaction = (reaction) => {
        reaction.reactionName = reaction.reactionName.concat(" " + reaction.reactionId)
        dispatch({type: "ADDREACTIONSTOARRAY", payload: [reaction]})
    }



    const handleReactionSubmit = () => {
        const reactionId = state.reactionOfEc.substring(state.reactionOfEc.length-6, state.reactionOfEc.length).toString()
        requestGenerator("POST", reactionUrl, {reactionId: reactionId}, "", "")
            .then(response => {
                const reaction  = response.data;
                handleDrawGraph(reaction, state, dispatch,graphState);
                handleAddReaction(reaction);
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
                console.log(response.data)
                console.log(state.ecNumberRequest)
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
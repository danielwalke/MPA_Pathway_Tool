import Modal from "@material-ui/core/Modal";
import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useStyles} from "../../ModalStyles/ModalStyles";
import TextField from "@material-ui/core/TextField";
import {requestGenerator} from "../../request/RequestGenerator";
import {handleDrawGraph} from "./EcReactions";
import clonedeep from "lodash/cloneDeep";

const reactionUrl = "http://127.0.0.1/keggcreator/getreaction"

const MultipleKeggReactions = () => {
    const state = useSelector(state => state)
    const dispatch = useDispatch()
    const classes = useStyles()
    const [keggReactionsString, setKeggReactionString] = useState("")



    const handleKeggReactionRequest = () =>{
        const keggReactions = keggReactionsString.split(";").filter(reaction => reaction.match(/[R][0-9][0-9][0-9][0-9][0-9]/))
        for(const keggReaction of keggReactions){
            requestGenerator("POST", reactionUrl, {reactionId: keggReaction}, "").then(response => {
                const reaction = clonedeep(response.data)
                reaction.reactionName = reaction.reactionName.concat(" " + reaction.reactionId)
                dispatch({type: "ADDREACTIONSTOARRAY", payload: [reaction]})
                handleDrawGraph(response.data, state.general, dispatch, state.graph)
            })
        }
    }

    const multipleKeggReactions = (
        <div className={classes.paper} style={{width:"60wh"}}>
            <TextField
                size={"small"}
                label="kegg reaction"
                variant="outlined"
                id="keggReactionRequest"
                value={keggReactionsString}
                placeholder={"R00001;R00002"}
                onChange={(e) => setKeggReactionString(e.target.value)}
            />
            <button onClick={()=> handleKeggReactionRequest()} className={"downloadButton"}>submit</button>
        </div>
    )

    return(
        <Modal className={classes.modal} open={state.general.showMultipleKeggReactionModal} onClose={() => dispatch({type: "SWITCHSHOWMULTIPLEKEGGREACTIONS"})}>
            {multipleKeggReactions}
        </Modal>

    );
};

export default MultipleKeggReactions;

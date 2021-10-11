import Modal from "@material-ui/core/Modal";
import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useStyles} from "../../ModalStyles/ModalStyles";
import TextField from "@material-ui/core/TextField";
import {requestGenerator} from "../../request/RequestGenerator";
import {handleDrawGraph} from "./EcReactions";
import clonedeep from "lodash/cloneDeep";
import {endpoint_getReactionUrl} from "../../../App Configurations/RequestURLCollection";
import {ToolTipBig} from "../../main/user-interface/UserInterface";

const reactionUrl = endpoint_getReactionUrl

const MultipleKeggReactions = () => {
    const state = useSelector(state => state)
    const dispatch = useDispatch()
    const classes = useStyles()
    const [keggReactionsString, setKeggReactionString] = useState("")


    const handleKeggReactionRequest = () => {
        const keggReactions = keggReactionsString.split(";").filter(reaction => reaction.match(/[R][0-9][0-9][0-9][0-9][0-9]/))
        const reactions = state.general.keggReactions
        for (const keggReaction of keggReactions) {
            requestGenerator("POST", reactionUrl, {reactionId: keggReaction}, "").then(response => {
                const reaction = clonedeep(response.data)
                reaction.reactionName = reaction.reactionName.concat(" " + reaction.reactionId)
                dispatch({type: "ADDREACTIONSTOARRAY", payload: [reaction]})
                dispatch({type: "ADD_KEGG_REACTION", payload: reaction})
                dispatch({type: "ADD_REACTION_NUMBERS_TO_AUDIT_TRAIL", payload: reaction})
                reactions.push(reaction)
                handleDrawGraph(reaction, state.keggReaction, dispatch, state.graph, state.general, reactions)
            })
        }
    }

    const multipleKeggReactions = (
        <div className={classes.paper} style={{width: "60wh"}}>
            <ToolTipBig title={"Type in multiple R numbers separated by a semicolon"} placement={"right"}>
                <TextField
                    size={"small"}
                    label="kegg reaction"
                    variant="outlined"
                    id="keggReactionRequest"
                    value={keggReactionsString}
                    placeholder={"R00001;R00002"}
                    onChange={(e) => setKeggReactionString(e.target.value)}
                />
            </ToolTipBig>
            <ToolTipBig title={"Submit reactions"} placement={"right"}>
                <button onClick={() => handleKeggReactionRequest()} className={"download-button"}>submit</button>
            </ToolTipBig>
        </div>
    )

    return (
        <Modal className={classes.modal} open={state.general.showMultipleKeggReactionModal}
               onClose={() => dispatch({type: "SWITCHSHOWMULTIPLEKEGGREACTIONS"})}>
            {multipleKeggReactions}
        </Modal>

    );
};

export default MultipleKeggReactions;

import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import {useDispatch, useSelector} from "react-redux";
import SubmitReaction from "./SubmitReaction";
import React from "react"
import "./Reaction.css"
import {ToolTipBig} from "../../main/user-interface/UserInterface";

const Reaction = () => {
    const state = useSelector(state => state.keggReaction)
    const dispatch = useDispatch()

    const getReactionList = () => {
        if (state.reactions != null) {
            const redList = []
            state.reactions.map((reaction) => redList.push(reaction.reactionName))
            return (redList)
        }
    }

    return (
  <div className={"reactionContainer"}>
      <ToolTipBig title={"Search a reaction"} placement={"left"}>
      <Autocomplete
          size={"small"}
          id="reactionBox"
          options={getReactionList()}
          className={"reaction"}
          name={"reaction"}
          onChange={(event, value) => {
              dispatch({type: "SETREACTION", payload: value})
          }}
          renderInput={params => (
              <TextField
                  onChange={(e) => {
                      dispatch({type: "SETREACTION", payload: e.target.value})
                  }}
                  value={state.reaction}
                  {...params}
                  label="reaction"
                  variant="outlined"
              />
          )}
      /></ToolTipBig>
      {/*<Checkbox className={"checkBox"} checked={state.reaction.length>0 && isRequestValid(state.reaction)}/>*/}
      <SubmitReaction className={"submit"}/>
  </div>

    )
}

export default Reaction

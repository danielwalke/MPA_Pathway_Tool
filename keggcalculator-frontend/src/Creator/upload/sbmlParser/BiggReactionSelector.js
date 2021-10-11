import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import TextField from "@material-ui/core/TextField";
import {Autocomplete} from "@material-ui/lab";
import Chip from "@material-ui/core/Chip";

const BiggReactionSelector = (props) => {

    const state = useSelector(state => state)

    const [options, setOptions] = useState([])

    const dispatch = useDispatch()

    useEffect(() => {
        // set list of possible bigg ids
        let ecNumberOptions = []
        state.general.reactionAnnotationTableOptions.forEach(reaction => {
            for (const biggReaction of reaction.biggReactionIds) {
                // add bigg reaction id to options only if it isn't present already
                if (!props.reactionRowInfo.biggReaction.includes(biggReaction)) {
                    ecNumberOptions.push(biggReaction)
                }
            }
        })
        setOptions(ecNumberOptions)
    }, [state.general.reactionAnnotationTableOptions])

    useEffect(() => {
        console.log(options)
    }, [options])

    return (
        <div>
            <Autocomplete
                size={"small"}
                id={"biggReactionSelector"}
                options={options}
                value={props.reactionRowInfo.biggReaction}
                onChange={(event, value) => {
                    const newListOfReactions = props.listOfReactions
                    newListOfReactions[props.index].biggReaction = value

                    dispatch({type: "SETLISTOFREACTIONS", payload: newListOfReactions})
                }}
                renderInput={params => (
                    <TextField
                        // onChange={(event) => handleChange(event)}
                        value={props.reactionRowInfo.biggReaction}
                        {...params}
                        label="BIGG ID Suggestions"
                        variant="outlined"
                    />
                )}
            />
        </div>
    )
}

export default BiggReactionSelector

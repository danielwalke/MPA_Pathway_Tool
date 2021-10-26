import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {Autocomplete} from "@material-ui/lab";
import TextField from "@material-ui/core/TextField";
import {requestGenerator} from "../../../request/RequestGenerator";
import {endpoint_getKeggReactionNames} from "../../../../App Configurations/RequestURLCollection";

const ReactionKeggIdSelector = (props) => {
    const state = useSelector(state => state)

    const [options, setOptions] = useState(['Please enter a number or letter'])

    const dispatch = useDispatch()

    const handleTyping = (string) => {
        requestGenerator("GET", endpoint_getKeggReactionNames, {reactionString: string}, "", "").then( //endpoint: sends max. 100 taxonomic names
            resp => {
                if (resp.data.length > 100) {
                    setOptions([...resp.data, 'Please enter another number or letter'])
                } else {
                    setOptions(resp.data)
                }
            })
    }

    useEffect(() => {
        // get list of possible kegg ids
        setOptions(state.general.reactionAnnotationTableOptions.map(reaction => {
            return reaction.reactionName + " " + reaction.reactionId
        }))
    },[state.general.reactionAnnotationTableOptions])

    return (
        <div>
            <Autocomplete
                size={"small"}
                id={"keggReactionSelector"}
                options={options}
                noOptionsText={'I could\'t find this name'}
                getOptionDisabled={(option) =>
                    option === 'Please enter another number or letter' ||
                    option === 'Please enter a number or letter'
                }
                value={props.listOfReactions[props.index].keggId}
                onChange={(event, value) => {
                    const newListOfReactions = props.listOfReactions
                     if (value) {
                         const splitArray = value.split(" ")
                         newListOfReactions[props.index].keggId = splitArray[splitArray.length-1]
                     } else {
                         newListOfReactions[props.index].keggId = ""
                     }

                    dispatch({type: "SETLISTOFREACTIONS", payload: newListOfReactions})
                }}
                renderInput={params => (
                    <TextField
                        onChange={(event) => handleTyping(event.target.value)}
                        value={props.listOfReactions[props.index].keggId}
                        {...params}
                        label="KEGG Reaction ID"
                        variant="outlined"
                    />
                )}
            />
        </div>
    )
}

export default ReactionKeggIdSelector

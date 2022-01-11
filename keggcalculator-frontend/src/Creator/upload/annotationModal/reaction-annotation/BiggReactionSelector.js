import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import TextField from "@material-ui/core/TextField";
import {Autocomplete} from "@material-ui/lab";
import {requestGenerator} from "../../../request/RequestGenerator";
import {endpoint_getBiggReactionNames} from "../../../../App Configurations/RequestURLCollection";

const BiggReactionSelector = (props) => {

    const state = useSelector(state => state)

    const [options, setOptions] = useState([])

    const dispatch = useDispatch()

    useEffect(() => {
        // set list of possible bigg ids for selected kegg compounds
        let biggIdOptions = []
        state.general.reactionAnnotationTableOptions.forEach(reaction => {
            for (const biggReaction of reaction.biggReactionIds) {
                // add bigg reaction id to options only if it isn't present already
                if (!props.listOfReactions[props.index].biggReaction.includes(biggReaction)) {
                    biggIdOptions.push("  |  " + biggReaction)
                }
            }
        })
        setOptions(biggIdOptions)

        if (options.length === 0) {
            if (props.listOfReactions[props.index].biggReaction) {
                handleTyping(props.listOfReactions[props.index].biggReaction)
            } else {
                setOptions(['Please enter a number or letter'])
            }
        }
    }, [])

    const handleTyping = (string) => {
        requestGenerator("GET", endpoint_getBiggReactionNames, {biggName: string}, "", "").then( //endpoint: sends max. 100 taxonomic names
            resp => {
                if (resp.data.length > 100) {
                    setOptions([...resp.data, 'Please enter another number or letter'])
                } else {
                    setOptions(resp.data)
                }
            })
    }

    return (
        <div>
            <Autocomplete
                size={"small"}
                id={"biggReactionSelector"}
                options={options}
                noOptionsText={'I could\'t find this name'}
                getOptionDisabled={(option) =>
                    option === 'Please enter another number or letter' ||
                    option === 'Please enter a number or letter'
                }
                value={props.listOfReactions[props.index].biggReaction}
                onChange={(event, value) => {
                    const newListOfReactions = props.listOfReactions
                    const setValue =  value ? value.split("  |  ")[1] : ""
                    newListOfReactions[props.index].biggReaction = setValue

                    dispatch({type: "SETLISTOFREACTIONS", payload: newListOfReactions})
                }}
                renderInput={params => (
                    <TextField
                        onChange={(event) => handleTyping(event.target.value)}
                        value={props.listOfReactions[props.index].biggReaction}
                        {...params}
                        label="BIGG Reaction"
                        variant="outlined"
                    />
                )}
            />
        </div>
    )
}

export default BiggReactionSelector

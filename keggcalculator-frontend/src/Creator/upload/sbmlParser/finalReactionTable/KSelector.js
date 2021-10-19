import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import TextField from "@material-ui/core/TextField";
import {Autocomplete} from "@material-ui/lab";
import Chip from "@material-ui/core/Chip";
import {requestGenerator} from "../../../request/RequestGenerator";
import {endpoint_getFilteredKNumberList} from "../../../../App Configurations/RequestURLCollection";

const KSelector = (props) => {
    const state = useSelector(state => state)
    const dispatch = useDispatch()

    const [options, setOptions] = useState([])

    useEffect(() => {
        let kNumberOptions = []
        state.general.reactionAnnotationTableOptions.forEach(reaction => {
            for (const kNumber of reaction.koNumbersString) {
                // add ko number to options only if it isn't present already
                if (!props.listOfReactions[props.index].koNumbers.includes(kNumber)) {
                    kNumberOptions.push(" " + kNumber) // empty string is necessary! Typing sth yields response that has to be split by spaces
                }
            }
        })
        setOptions(kNumberOptions)

    }, [state.general.reactionAnnotationTableOptions, props.listOfReactions[props.index].koNumbers])

    const handleTyping = (string) => {
        requestGenerator("GET", endpoint_getFilteredKNumberList, {reactionString: string}, "", "").then( //endpoint: sends max. 100 taxonomic names
            resp => {
                setOptions(resp.data)
            })
    }

    return (
        <Autocomplete
            size={"small"}
            id={"kNumberSelector"}
            multiple
            limitTags={4}
            options={options}
            value={props.listOfReactions[props.index].koNumbers}

            onChange={(event, value) => {
                // addition of selected ec number
                const newListOfReactions = props.listOfReactions
                const kNumbers = value.map(kNumberString => {
                    const splitArray = kNumberString.split(" ")
                    return splitArray[splitArray.length-1]
                })

                newListOfReactions[props.index].koNumbers = [...kNumbers]

                dispatch({type: "SETLISTOFREACTIONS", payload: newListOfReactions})
            }}

            renderTags={(values) =>
                values.map((value) => (
                    <Chip
                        size="small"
                        label={value}
                        onDelete={() => {
                            // deletion of ec number
                            const newListOfReactions = props.listOfReactions
                            const newKNumbers = newListOfReactions[props.index].koNumbers

                            const arrIndex = props.listOfReactions[props.index].koNumbers.indexOf(value)

                            if (arrIndex > -1) {
                                newKNumbers.splice(arrIndex, 1)
                                newListOfReactions[props.index].koNumbers = [...newKNumbers]
                            }

                            dispatch({type: "SETLISTOFREACTIONS", payload: newListOfReactions})
                        }}
                    />
                ))
            }

            renderInput={params => (
                <TextField
                    onChange={(event) => handleTyping(event.target.value)}
                    value={props.listOfReactions[props.index].koNumbers}
                    {...params}
                    label="K Numbers"
                    variant="outlined"
                />
            )}
        />
    )

}

export default KSelector

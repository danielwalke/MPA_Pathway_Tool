import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import TextField from "@material-ui/core/TextField";
import {Autocomplete} from "@material-ui/lab";
import Chip from "@material-ui/core/Chip";
import {requestGenerator} from "../../../request/RequestGenerator";
import {
    endpoint_getFilteredEcNumberList
} from "../../../../App Configurations/RequestURLCollection";

const EcSelector = (props) => {
    const state = useSelector(state => state)
    const dispatch = useDispatch()

    const [options, setOptions] = useState([])

    useEffect(() => {
        let ecNumberOptions = []
        state.general.reactionAnnotationTableOptions.forEach(reaction => {
            for (const ecNumber of reaction.ecNumbersString) {
                // add ec number to options only if it isn't present already
                if (!props.listOfReactions[props.index].ecNumbers.includes(ecNumber)) {
                    ecNumberOptions.push(" " + ecNumber) // empty string is necessary! Typing sth yields response that has to be split by spaces
                }
            }
        })

        if (ecNumberOptions.length === 0) {
            setOptions(['Please enter a number or letter'])
        } else {
            setOptions(ecNumberOptions)
        }

    }, [state.general.reactionAnnotationTableOptions, props.listOfReactions[props.index].ecNumbers])

    const handleTyping = (string) => {
        requestGenerator("GET", endpoint_getFilteredEcNumberList, {reactionName: string}, "", "").then( //endpoint: sends max. 100 taxonomic names
            resp => {
                if (resp.data.length > 100) {
                    setOptions([...resp.data, 'Please enter another number or letter'])
                } else {
                    setOptions(resp.data)
                }
            })
    }

    return (
        <Autocomplete
            size={"small"}
            id={"ecNumberSelector"}
            multiple
            limitTags={4}
            options={options}
            noOptionsText={'I could\'t find this name'}
            getOptionDisabled={(option) =>
                option === 'Please enter another number or letter' ||
                option === 'Please enter a number or letter'
            }
            value={props.listOfReactions[props.index].ecNumbers}

            onChange={(event, value) => {
                // addition of selected ec number
                const newListOfReactions = props.listOfReactions
                const ecNumbers = value.map(ecNumberString => {
                    const splitArray = ecNumberString.split(" ")
                    return splitArray[splitArray.length-1]
                })
                newListOfReactions[props.index].ecNumbers = [...ecNumbers]

                dispatch({type: "SETLISTOFREACTIONS", payload: newListOfReactions})
            }}

            renderTags={(values) =>
                values.map((value, index) => (
                    <Chip
                        key={index}
                        size="small"
                        label={value}
                        onDelete={() => {
                            // deletion of ec number
                            const newListOfReactions = props.listOfReactions
                            const newEcNumbers = newListOfReactions[props.index].ecNumbers
                            const arrIndex = props.listOfReactions[props.index].ecNumbers.indexOf(value)

                            if (arrIndex > -1) {
                                newEcNumbers.splice(arrIndex, 1)
                                newListOfReactions[props.index].ecNumbers = [...newEcNumbers]
                            }

                            dispatch({type: "SETLISTOFREACTIONS", payload: newListOfReactions})
                        }}
                    />
                ))
            }

            renderInput={params => (
                <TextField
                    onChange={(event) => handleTyping(event.target.value)}
                    value={props.listOfReactions[props.index].ecNumbers}
                    {...params}
                    label="EC Numbers"
                    variant="outlined"
                />
            )}
        />
    )

}

export default EcSelector

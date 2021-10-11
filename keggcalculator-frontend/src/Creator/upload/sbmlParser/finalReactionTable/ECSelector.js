import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import TextField from "@material-ui/core/TextField";
import {Autocomplete} from "@material-ui/lab";
import Chip from "@material-ui/core/Chip";

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
                    ecNumberOptions.push(ecNumber)
                }
            }
        })
        setOptions(ecNumberOptions)

    }, [state.general.reactionAnnotationTableOptions, props.listOfReactions[props.index].ecNumbers])

    return (
        <Autocomplete
            size={"small"}
            id={"ecNumberSelector"}
            multiple
            limitTags={4}
            options={options}
            value={props.listOfReactions[props.index].ecNumbers}

            onChange={(event, value) => {
                // addition of selected ec number
                const newListOfReactions = props.listOfReactions
                newListOfReactions[props.index].ecNumbers = [...value]

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
                    // onChange={(event) => handleChange(event)}
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

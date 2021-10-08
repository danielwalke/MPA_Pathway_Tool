import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import TextField from "@material-ui/core/TextField";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import {FormControl, InputLabel, MenuItem, Select} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import {useStylesSelector} from "./Styles";
import Checkbox from "@material-ui/core/Checkbox";
import {Autocomplete} from "@material-ui/lab";
import Chip from "@material-ui/core/Chip";

const KoSelector = (props) => {
    const state = useSelector(state => state)
    const dispatch = useDispatch()

    const [options, setOptions] = useState([])

    useEffect(() => {
        let ecNumberOptions = []
        state.general.reactionAnnotationTableOptions.forEach(reaction => {
            for (const kNumber of reaction.koNumbersString) {
                // add ec number to options only if it isn't present already
                if (!props.reactionRowInfo.koNumbers.includes(kNumber)) {
                    ecNumberOptions.push(kNumber)
                }
            }
        })
        setOptions(ecNumberOptions)

    }, [state.general.reactionAnnotationTableOptions, props.reactionRowInfo.koNumbers])

    return (
        <Autocomplete
            size={"small"}
            id={"kNumberSelector"}
            multiple
            options={options}
            value={props.reactionRowInfo.koNumbers}
            onChange={(event, value) => {
                // addition of selected ec number
                const newListOfReactions = props.listOfReactions
                newListOfReactions[props.index].koNumbers = [...value]

                dispatch({type: "SETLISTOFREACTIONS", payload: newListOfReactions})
            }}
            renderTags={(values) =>
                values.map((value) => (
                    <Chip
                        label={value}
                        onDelete={() => {
                            // deletion of ec number
                            const newListOfReactions = props.listOfReactions
                            const newEcNumbers = newListOfReactions[props.index].koNumbers
                            const arrIndex = props.listOfReactions[props.index].koNumbers.indexOf(value)

                            if (arrIndex > -1) {
                                newEcNumbers.splice(arrIndex, 1)
                                newListOfReactions[props.index].koNumbers = [...newEcNumbers]
                            }

                            dispatch({type: "SETLISTOFREACTIONS", payload: newListOfReactions})
                        }}
                    />
                ))
            }
            renderInput={params => (
                <TextField
                    // onChange={(event) => handleChange(event)}
                    value={props.reactionRowInfo.koNumbers}
                    {...params}
                    label="K Number Suggestions"
                    variant="outlined"
                />
            )}
        />
    )

}

export default KoSelector

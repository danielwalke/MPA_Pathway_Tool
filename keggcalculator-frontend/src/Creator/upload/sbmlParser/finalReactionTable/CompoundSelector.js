import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import TextField from "@material-ui/core/TextField";
import {Autocomplete} from "@material-ui/lab";
import Chip from "@material-ui/core/Chip";

export const getSpeciesObject = (listOfSpecies, compoundSbmlIds) => {
    return listOfSpecies.filter(compound => compoundSbmlIds.includes(compound.sbmlId))
}

const CompoundSelector = (props) => {
    /**
     * props.propName - substrate or product (has to be the prop name of either one thats in the listOfReactions)
     */
    const state = useSelector(state => state)
    const listOfSpecies = state.general.listOfSpecies

    const dispatch = useDispatch()

    const [options, setOptions] = useState([])
    const [compound, setCompounds] = useState([])

    useEffect(() => {
        // set compounds that are contained in the reaction
        const compoundIds = []
        props.listOfReactions[props.index][`${props.propName}`].forEach(compound => {
            compoundIds.push(compound.sbmlId)
        })
        setCompounds(compoundIds)

        // set compound options from listOfSpecies
        setOptions(listOfSpecies.map(compound => compound.sbmlId))

    }, [props.index, props.listOfReactions[props.index][`${props.propName}`]])

    return (
        <Autocomplete
            size={"small"}
            id={"substrateSelector"}
            multiple
            limitTags={4}
            options={options}
            value={compound}

            onChange={(event, value) => {
                const newListOfReactions = props.listOfReactions
                newListOfReactions[props.index][`${props.propName}`] = [...getSpeciesObject(listOfSpecies, value)]
                dispatch({type: "SETLISTOFREACTIONS", payload: newListOfReactions})
            }}

            renderTags={(values) =>
                values.map((value) => (
                    <Chip
                        size="small"
                        label={value}
                        onDelete={() => {
                            // deletion of compound
                            const newListOfReactions = props.listOfReactions
                            const newCompounds = newListOfReactions[props.index][`${props.propName}`]

                            const arrIndex = props.listOfReactions[props.index][`${props.propName}`].findIndex(
                                compound => compound.sbmlId === value)

                            if (arrIndex > -1) {
                                newCompounds.splice(arrIndex, 1)
                                newListOfReactions[props.index][`${props.propName}`] = [...newCompounds]
                            }

                            dispatch({type: "SETLISTOFREACTIONS", payload: newListOfReactions})
                        }}
                    />
                ))
            }

            renderInput={params => (
                <TextField
                    // onChange={(event) => handleChange(event)}
                    value={compound}
                    {...params}
                    label={props.label}
                    variant="outlined"
                />
            )}
        />
    )

}

export default CompoundSelector

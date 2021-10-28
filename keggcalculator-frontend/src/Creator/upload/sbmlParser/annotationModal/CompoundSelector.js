import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import TextField from "@material-ui/core/TextField";
import {Autocomplete} from "@material-ui/lab";
import Chip from "@material-ui/core/Chip";
import AddIcon from "@material-ui/icons/Add";

export const getSpeciesObject = (listOfSpecies, compoundSbmlId) => {
    return listOfSpecies.find(compound => compoundSbmlId === compound.sbmlId)
}

export const checkForCompound = (compoundList, compoundObj) => {
    /**
     * checks if the provided compound is already contained in the list of compounds
     * @type {boolean}
     */

    let hasCompound
    for (const compound of compoundList) {
        if (compound.sbmlId === compoundObj.sbmlId) {
            hasCompound = true
            break
        } else {
            hasCompound = false
        }
    }
    return hasCompound
}



const CompoundSelector = (props) => {
    /**
     * props.propName - substrate or product (has to be the prop name of either one thats in the listOfReactions)
     */
    const state = useSelector(state => state)
    const listOfSpecies = state.general.listOfSpecies

    const dispatch = useDispatch()

    const [options, setOptions] = useState([])
    const [compounds, setCompounds] = useState([])
    const [compoundSelection, setCompoundSelection] = useState("")
    const [stoichiometrySelection, setStoichiometrySelection] = useState(1.0)

    useEffect(() => {
        // set compounds that are contained in the reaction
        const compoundIds = []
        props.listOfReactions[props.index][`${props.propName}`].forEach(compound => {
            compoundIds.push(compound.stoichiometry + " " + compound.sbmlId + "  |  " + compound.sbmlName)
        })
        setCompounds(compoundIds)

        // set compounds options from listOfSpecies
        setOptions(listOfSpecies.map(compound => {
            return compound.sbmlId + "  |  " + compound.sbmlName
        }))

    }, [props.index, props.listOfReactions[props.index][`${props.propName}`]])

    const onAddCompound = (stoichiometry, compound) => {
        const newListOfReactions = props.listOfReactions
        const newCompoundList = newListOfReactions[props.index][`${props.propName}`]

        // test if selection was made and stoichiometry isn't 0
        if (compound && stoichiometry.toInteger !== 0) {
            const sbmlId = compound.split("  |  ")[0]
            const compoundObj = getSpeciesObject(listOfSpecies, sbmlId)

            // test if compound isn't included already
            if (!checkForCompound(newCompoundList, compoundObj)) {
                compoundObj["stoichiometry"] = stoichiometry.toString()

                newCompoundList.push(compoundObj)
                newListOfReactions[props.index][`${props.propName}`] = [...newCompoundList]

                dispatch({type: "SETLISTOFREACTIONS", payload: newListOfReactions})
            }
            // TODO: display popup or implement validator

            // reset states
            setStoichiometrySelection(1.0)
            setCompoundSelection("")
        } else {
            console.log("no input")
        }
    }

    return (
        <div >
            <div style={{display: "flex", flexDirection:"column", alignItems: "center"}}>
                <p className={"chip-container-label"}>{props.label}</p>
            </div>
            <div className={"chip-container"}>
                {compounds.map(
                    comp => {
                        return (
                            <Chip size="small"
                                  label={comp}
                                  onDelete={() => {
                                      // deletion of compounds
                                      const newListOfReactions = props.listOfReactions
                                      const newCompounds = newListOfReactions[props.index][`${props.propName}`]

                                      const arrIndex = props.listOfReactions[props.index][`${props.propName}`].findIndex(
                                          compound =>
                                              compound.stoichiometry +
                                              " " + compound.sbmlId +
                                              "  |  " + compound.sbmlName === comp)

                                      if (arrIndex > -1) {
                                          newCompounds.splice(arrIndex, 1)
                                          newListOfReactions[props.index][`${props.propName}`] = [...newCompounds]
                                      }

                                      dispatch({type: "SETLISTOFREACTIONS", payload: newListOfReactions})
                                  }}/>
                        )
                    }
                )}
            </div>
            <div className={"compound-adder"}>
                <div className={"compound-adder-fields"}>
                    <TextField
                        fullWidth={true}
                        size="small"
                        id="outlined-number"
                        label="stoich."
                        type="number"
                        variant="outlined"
                        value={stoichiometrySelection}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={(event) => {
                            setStoichiometrySelection(parseFloat(event.target.value))
                        }}
                />
                </div>
                <Autocomplete
                    className={"compound-adder-fields"}
                    size="small"
                    id={"substrateSelector"}
                    options={options}
                    value={compoundSelection}

                    onChange={(event, value) => {
                        setCompoundSelection(value)
                    }}
                    renderInput={params => (
                        <TextField
                            {...params}
                            label={props.label}
                            variant="outlined"
                        />
                    )}
                />
                <button className={"download-button circle-icon"}
                        style={{margin: "0"}}
                        onClick={() => onAddCompound(stoichiometrySelection, compoundSelection)}>
                    <AddIcon/>  Add Compound
                </button>
            </div>
        </div>

    )

}

export default CompoundSelector

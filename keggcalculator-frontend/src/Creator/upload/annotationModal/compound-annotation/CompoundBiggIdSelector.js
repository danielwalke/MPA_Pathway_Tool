import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {Autocomplete} from "@material-ui/lab";
import TextField from "@material-ui/core/TextField";
import {requestGenerator} from "../../../request/RequestGenerator";
import {endpoint_getFilteredBiggCompoundList} from "../../../../App Configurations/RequestURLCollection";

const CompoundBiggIdSelector = (props) => {
    const [options, setOptions] = useState([])
    const dispatch = useDispatch()

    useEffect(() => {
        if (props.listOfSpecies[props.index].biggId) {
            handleTyping(props.listOfSpecies[props.index].biggId)
        } else {
            setOptions(['Please enter a number or letter'])
        }

    },[])

    const handleTyping = (string) => {
        requestGenerator("GET", endpoint_getFilteredBiggCompoundList, {compoundString: string}, "", "").then( //endpoint: sends max. 100 taxonomic names
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
                id={"keggCompoundSelector"}
                options={options}
                noOptionsText={'I could\'t find this name'}
                getOptionDisabled={(option) =>
                    option === 'Please enter another number or letter' ||
                    option === 'Please enter a number or letter'
                }
                value={props.listOfSpecies[props.index].biggId}
                onChange={(event, value) => {
                    const newListOfSpecies = props.listOfSpecies
                    const setValue = value ? value.split("  |  ")[1] : ""
                    newListOfSpecies[props.index].biggId = setValue
                    dispatch({type: "SETLISTOFSPECIES", payload: newListOfSpecies})
                }}
                renderInput={params => (
                    <TextField
                        onChange={(event) => handleTyping(event.target.value)}
                        // value={props.listOfSpecies[props.index].biggId}
                        {...params}
                        label="BIGG Compound ID"
                        variant="outlined"
                    />
                )}
            />
        </div>
    )
}

export default CompoundBiggIdSelector

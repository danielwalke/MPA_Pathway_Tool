import {useDispatch} from "react-redux";
import React, {useState} from "react";
import {Autocomplete} from "@material-ui/lab";
import TextField from "@material-ui/core/TextField";
import {requestGenerator} from "../../request/RequestGenerator";
import {
    endpoint_getFilteredCompoundList
} from "../../../App Configurations/RequestURLCollection";

const CompoundKeggIdSelector = (props) => {
    const [options, setOptions] = useState([])

    const dispatch = useDispatch()

    const handleTyping = (string) => {
        requestGenerator("GET", endpoint_getFilteredCompoundList, {compoundString: string}, "", "").then( //endpoint: sends max. 100 taxonomic names
            resp => {
                setOptions(resp.data)
            })
    }

    return (
        <div>
            <Autocomplete
                size={"small"}
                id={"keggCompoundSelector"}
                options={options}
                value={props.listOfSpecies[props.index].keggId}
                onChange={(event, value) => {
                    const newListOfSpecies = props.listOfSpecies
                    value ? newListOfSpecies[props.index].keggId = value.substring(0, 6) : newListOfSpecies[props.index].keggId = ""
                    dispatch({type: "SETLISTOFSPECIES", payload: newListOfSpecies})
                }}
                renderInput={params => (
                    <TextField
                        onChange={(event) => handleTyping(event.target.value)}
                        value={props.listOfSpecies[props.index].keggId}
                        {...params}
                        label="KEGG Compound ID"
                        variant="outlined"
                    />
                )}
            />
        </div>
    )
}

export default CompoundKeggIdSelector

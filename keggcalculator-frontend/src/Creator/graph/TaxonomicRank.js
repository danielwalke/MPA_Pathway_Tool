import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {taxonomicRanks} from "../main/Main";

const TaxonomicRank = ()=>{
    const dispatch = useDispatch()
    const generalState = useSelector(state => state.general)
    return(
        <Autocomplete
            size={"small"}
            id="taxonomic rank"
            options={taxonomicRanks}
            className={"taxonomic rank"}
            onChange={(e, value) => dispatch({type:"SETTAXONOMICRANK", payload:value})}
            renderInput={params => (
                <TextField
                    name={"taxonomic rank"}
                    onChange={(e) => dispatch({type:"SETTAXONOMICRANK", payload:e.target.value})}
                    value={generalState.taxonomicRank}
                    {...params}
                    label="taxonomic rank"
                    variant="outlined"
                />)}/>
    )
}

export default TaxonomicRank
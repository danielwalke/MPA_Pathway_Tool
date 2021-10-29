import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {taxonomicRanks} from "../../main/Main";
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import {requestGenerator} from "../../request/RequestGenerator";
import {endpoint_getTaxonomicNames} from "../../../App Configurations/RequestURLCollection";

const useStyles = makeStyles((theme) => ({
    formControl: {
        width: "100%",
    }
}));

const submitTaxonomicRank = (e, dispatch) =>{
    e.preventDefault()
    dispatch({type:"SETTAXONOMICRANK", payload:e.target.value})
    dispatch({type:"SETLOADING", payload:true})
    requestGenerator("POST", endpoint_getTaxonomicNames, {rank: e.target.value}, "", "").then(resp=> { //endpoint: sends max. 100 taxonomic names
        dispatch({type: "SET_TAXONOMIC_NAMES", payload: resp.data})
        dispatch({type:"SETLOADING", payload:false})
    })
}

const TaxonomicRank = ()=>{
    const dispatch = useDispatch()
    const generalState = useSelector(state => state.general)
    const classes = useStyles()
    return(
        <FormControl style={{margin:"2px 0"}} size="small" variant="outlined" className={classes.formControl}>
            {generalState.taxonomicRank.length===0 && <InputLabel id="taxonomicRankInput">taxonomic rank</InputLabel>}
            <Select
                labelId="taxonomic rank"
                value={generalState.taxonomicRank}
                onChange={(e)=> submitTaxonomicRank(e, dispatch)}
            >
                {taxonomicRanks.map(rank => <MenuItem value={rank}>{rank}</MenuItem>
                    )}
            </Select>
        </FormControl>
    )
}

export default TaxonomicRank
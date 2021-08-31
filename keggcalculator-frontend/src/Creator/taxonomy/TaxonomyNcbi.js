import React, {useEffect, useState} from 'react';
import {Autocomplete} from "@material-ui/lab";
import {TextField} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {requestGenerator} from "../request/RequestGenerator";
import {endpoint_getFilteredTaxonomicNames} from "../../App Configurations/RequestURLCollection";
import {ToolTipBig} from "../main/user-interface/UserInterface";


const TaxonomyNcbi = (props) => {
    const [options, setOptions] = useState([])
    const state = useSelector(state => state)
    const dispatch = useDispatch()

    useEffect(()=>{
        if(state.general.taxonomicNames.length>100){
            state.general.taxonomicNames.push("Type another letter for more names")
        }
        setOptions(state.general.taxonomicNames)
    },[state.general.taxonomicRank, state.general.taxonomicNames])


    const handleChange = (e) =>{
        dispatch({type: props.dispatchTaxonomy, payload: e.target.value})
        requestGenerator("POST", endpoint_getFilteredTaxonomicNames, {rank: state.general.taxonomicRank, subName: e.target.value.toLowerCase()},"","").then( //endpoint: sends max. 100 taxonomic names
                resp => {
                    if(resp.data.length>100){
                        resp.data.push("Type another letter for more names")
                    }
                    setOptions(resp.data)
                }
        )
    }
    return (
        <div style={{margin:"2px 0"}}>
            <ToolTipBig title={"Search a taxonomic name"} placement={"left"}>
                <Autocomplete
                    size={"small"}
                    id={`taxonomySearch`}
                    options={options}
                    onChange={(event, value) => {
                        dispatch({type: props.dispatchTaxonomy, payload: value})
                    }}
                    renderInput={params => (
                        <TextField
                            onChange={(event) => handleChange(event)}
                            value={props.taxonomy}
                            {...params}
                            label="taxonomy"
                            variant="outlined"
                        />
                    )}
                />
            </ToolTipBig>
        </div>
    );
};

export default TaxonomyNcbi;

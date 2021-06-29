import React, {useEffect, useState} from 'react';
import {Autocomplete} from "@material-ui/lab";
import {TextField} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {requestGenerator} from "../request/RequestGenerator";
import {endpoint_getFilteredTaxonomicNames} from "../../App Configurations/RequestURLCollection";


const TaxonomyNcbi = (props) => {
    const [taxonomyListNcbiFiltered, setTaxonomyListNcbiFiltered] = useState([]);
    const [options, setOptions] = useState([])
    const state = useSelector(state => state)
    const dispatch = useDispatch()

    useEffect(()=>{
        const taxonomyNcbiList = state.taxonomy.taxonomyNcbiList
        const taxonomicRank = state.general.taxonomicRank
        const filteredTaxonomyListFiltered = taxonomyNcbiList.filter(taxonomy => taxonomy.taxonomicRank === taxonomicRank)
        setTaxonomyListNcbiFiltered(filteredTaxonomyListFiltered)
    },[state.taxonomy.taxonomyNcbiList, state.general.taxonomicRank])

    // const handleAutoChange = (e) => {
    //     const {value} = e.target
    //     dispatch({type: props.dispatchTaxonomy, payload: value})
    //      setTaxonomyListNcbiFiltered(taxonomyListNcbiFiltered.filter(taxonomy => taxonomy.taxonomicName.toLowerCase().indexOf(value.toLowerCase()) > -1))
    //     }

    useEffect(()=>{
        setOptions(state.general.taxonomicNames)
    },[state.general.taxonomicRank, state.general.taxonomicNames])


    const handleChange = (e) =>{
        dispatch({type: props.dispatchTaxonomy, payload: e.target.value})
        requestGenerator("POST", endpoint_getFilteredTaxonomicNames, {rank: state.general.taxonomicRank, subName: e.target.value},"","").then( //endpoint: sends max. 100 taxonomic names
                resp => {
                    setOptions(resp.data)
                }
        )
    }
    return (
        <div>
            {/*{state.general.taxonomicRank !== "species" || props.taxonomy.length>4?
                       :
                 <TextField type={"text"} onChange={(event) => handleAutoChange(event)} style={{width:"100%"}}
                //            value={props.taxonomy} label={"type in 5 letters of your species"}/>
            }*/}
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

        </div>
    );
};

export default TaxonomyNcbi;

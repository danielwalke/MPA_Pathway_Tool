import React, {useEffect, useState} from "react";
import {getTaxaList} from "../../Creator/graph/double click node/StuctureModalBody";
import {useDispatch, useSelector} from "react-redux";
import TaxonomySelector from "../../Creator/graph/configurations/taxonomy/TaxonomySelector";

export default function AutopacmenConfiguration() {

    const generalState = useSelector(state => state.general)
    const fluxState = useSelector(state => state.fluxAnalysis)
    const [networkTaxa, setNetworkTaxa] = useState([])
    const dispatch = useDispatch()

    useEffect(() => {
        const pathwayTaxonomySet = new Set()
        generalState.reactionsInSelectArray.forEach(
            reaction => getTaxaList(reaction.taxa).forEach(taxon => pathwayTaxonomySet.add(taxon)))
        setNetworkTaxa(Array.from(pathwayTaxonomySet))
    },[generalState.reactionsInSelectArray])

    const setConfigurations = (prop, value) => {
        const newConfig = {...fluxState.sMomentConfigurations}
        newConfig.prop = value
        dispatch({type: "SET_AUTOPACMEN_CONFIGURATIONS", payload: newConfig})
    }

    return (
        <div className={'modal-content'}>
            <h5 className={"modal-header"}>sMOMENT Configuration</h5>
            <TaxonomySelector taxaList={networkTaxa}/>
            <div>Total Protein Content</div>
            <div>Unmeasured Protein Fraction</div>
            <div>Average Saturation Level</div>
        </div>
    )
}

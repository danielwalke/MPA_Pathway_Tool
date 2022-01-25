import React, {useEffect, useState} from "react";
import {getTaxaList} from "../../Creator/graph/double click node/StuctureModalBody";
import {useDispatch, useSelector} from "react-redux";
import TaxonomySelector from "../../Creator/graph/configurations/taxonomy/TaxonomySelector";
import {TextField} from "@material-ui/core";
import ConfigurationFormElement from "./ConfigurationFromElement";
import {ToolTipBig} from "../../Creator/main/user-interface/UserInterface";

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
        newConfig[prop] = parseFloat(value)
        dispatch({type: "SET_AUTOPACMEN_CONFIGURATIONS", payload: newConfig})
    }

    return (
        <div className={'configuration-content'}>
            <h5 className={"modal-header"}>sMOMENT Configuration</h5>
            <TaxonomySelector taxaList={networkTaxa}/>
            <ConfigurationFormElement
                label={'Total Protein Content'} prop={'proteinContent'}
                configuration={fluxState.sMomentConfigurations.proteinContent}
                setConfigurations={setConfigurations} min={0.0} max={undefined}
                tooltip={'define the total protein content in g per g dry weight'}
            />
            <ConfigurationFormElement
                label={'Unmeasured Protein Fraction'} prop={'unmeasuredProteinFraction'}
                configuration={fluxState.sMomentConfigurations.unmeasuredProteinFraction}
                setConfigurations={setConfigurations} min={0.0} max={1.0}
                tooltip={'define the mass fraction of model enzymes that were not measured'}
            />
            <ConfigurationFormElement
                label={'Average Saturation Level'} prop={'averageSaturationLevel'}
                configuration={fluxState.sMomentConfigurations.averageSaturationLevel}
                setConfigurations={setConfigurations} min={0.0} max={1.0}
                tooltip={'define the average level of enzyme saturation'}
            />
        </div>
    )
}

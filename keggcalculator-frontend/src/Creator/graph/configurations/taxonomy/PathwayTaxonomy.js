import React, {useEffect, useState} from "react";
import TaxonomySelector from "./TaxonomySelector";
import {useSelector} from "react-redux";
import "./TaxonomySelector.css"
import {getTaxaList} from "../../double click node/StuctureModalBody";

export default function PathwayTaxonomy() {

    const generalState = useSelector(state => state.general)
    const [networkTaxa, setNetworkTaxa] = useState([])

    useEffect(() => {
        const pathwayTaxonomySet = new Set()
        generalState.reactionsInSelectArray.forEach(
            reaction => getTaxaList(reaction.taxa).forEach(taxon => pathwayTaxonomySet.add(taxon)))
        setNetworkTaxa(Array.from(pathwayTaxonomySet))
    },[generalState.reactionsInSelectArray])

    return (
        <div className={"modal-content"}>
            <h5 className={"modal-header"}>Configure Taxonomic Requirements</h5>
            <div className={"taxonomy-column"}>
                <TaxonomySelector taxaList={networkTaxa}/>
                {generalState.reactionsInSelectArray.map(
                    reaction =>
                        <TaxonomySelector
                            key={reaction.reactionId}
                            reaction={reaction}
                            taxaList={getTaxaList(reaction.taxa)}/>
                )}
            </div>
        </div>
    )
}

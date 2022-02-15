import React from "react";
import {saveAs} from "file-saver";
import {useDispatch} from "react-redux";
import {addOutput} from "../DownloadFunctions";
import clonedeep from "lodash/cloneDeep";
import {ToolTipBig} from "../../main/user-interface/UserInterface";

export const createCsvBlob = (generalState) => {

    const reactions = clonedeep(generalState.reactionsInSelectArray)

    let output = "stepId;ReactionNumberId;koNumberIds;ecNumberIds;stochCoeff;compoundId;typeOfCompound;reversible;"+
        "taxonomy;reactionX;reactionY;CompoundX;CompoundY;reactionAbbr;compoundAbbr;keyComp;compoundBiggId;"+
        "reactionBiggId;compoundCompartment;reactionLowerBound;reactionupperBound;reactionObjectiveCoefficient;"+
        "reactionExchangeReaction;reactionGeneRule\n"

    let reactionCounter = 0
    const compoundTypeSubstrate = "substrate"
    const compoundTypeProduct = "product"
    for (const reaction of reactions) {
        for (const substrate of reaction.substrates) {
            output = addOutput(
                output, reaction, substrate, reactionCounter, compoundTypeSubstrate, reaction.reversible,
                generalState.listOfGeneProducts)
        }
        for (const product of reaction.products) {
            output = addOutput(output, reaction, product, reactionCounter, compoundTypeProduct, reaction.reversible,
                generalState.listOfGeneProducts)
        }
        if (reaction.substrates.length === 0 && reaction.products.length === 0) {
            output = addOutput(output, reaction, {
                stiochiometry: "",
                name: "",
                x: "",
                y: "",
                opacity: "",
                abbreviation: ""
            }, reactionCounter, "", reaction.reversible, generalState.listOfGeneProducts)
        }
        reactionCounter++;
    }

    return new Blob(new Array(output.trim()), {type: "text/plain;charset=utf-8"});
}

const CsvDownLoader = (props) => {
    const dispatch = useDispatch()

    const handleDownloadCsv = () => {

        try {
            const {generalState, graphState} = clonedeep(props)
            const blob = createCsvBlob(generalState)
            saveAs(blob, "ModuleGraph.csv")
            dispatch({type: "ADD_CSV_DOWNLOAD_TO_AUDIT_TRAIL"})
        } catch (e) {
            window.alert("make a change")
        }

    }

    return (
        <div>
            <ToolTipBig title={"Click for downloading the pathway as CSV"} placement={"right"}>
                <button disabled={props.graphState.data.nodes.length < 1} className={"download-button"}
                        onClick={handleDownloadCsv}>Download Csv
                </button>
            </ToolTipBig>
        </div>
    )
}

export default CsvDownLoader

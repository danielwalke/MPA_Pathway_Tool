import React, {useState} from "react";
import TextField from "@material-ui/core/TextField";
import {CustomButton} from "../../../../Components/Home/Home";
import {useDispatch, useSelector} from "react-redux";
import {cloneDeep} from "lodash";
import {generateGeneProduct} from "./generateGeneProduct";
import {ToolTipBig} from "../../../main/user-interface/UserInterface";

export default function GeneAdder() {

    const [newGeneId, setNewGeneId] = useState("")
    const [uniprotId, setUniprotId] = useState("")

    const generalState = useSelector(state => state.general)

    const dispatch = useDispatch()

    const handleGeneAddition = () => {

        let lowestFreeIndex = 0
        const listIndices = generalState.listOfGeneProducts.map(gene => gene.index)
        while (listIndices.includes(lowestFreeIndex)) {
            lowestFreeIndex++
        }

        const newListOfGeneProducts = cloneDeep(generalState.listOfGeneProducts)
        newListOfGeneProducts.push(generateGeneProduct(newGeneId, uniprotId, lowestFreeIndex))

        dispatch({type: "SET_LIST_OF_GENE_PRODUCTS", payload: newListOfGeneProducts})
    }

    return(
        <div className={"detail-view"}>
            <p className={"gene-adder-header"}> Add new Gene Product </p>
            <TextField label="new Gene Id"
                       variant={"outlined"}
                       size={"small"}
                       value={newGeneId}
                       onChange={(e) => {
                           setNewGeneId(e.target.value)
                       }}/>
            <TextField label="Uniprot Accession"
                       variant={"outlined"}
                       size={"small"}
                       value={uniprotId}
                       onChange={(e) => {
                           setUniprotId(e.target.value)
                       }}/>
            <div >
                <ToolTipBig title={"Create a new gene and add it to the list of gene products. This can be included for gene protein reaction rules in the next step."}
                            placement={"right"}>
                    <span className={'button-bar button-center'} style={{padding: '0'}}>
                        <CustomButton
                            style={{fontSize: "1rem"}}
                            onClick={handleGeneAddition}>
                        Add new Gene to List
                        </CustomButton>
                    </span>
                </ToolTipBig>
            </div>
        </div>
    )
}

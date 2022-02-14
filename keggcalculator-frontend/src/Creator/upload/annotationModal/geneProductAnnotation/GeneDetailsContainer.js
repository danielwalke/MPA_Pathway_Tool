import React from "react";
import {useDispatch} from "react-redux";
import RestoreIcon from "@material-ui/icons/Restore";
import TextField from "@material-ui/core/TextField";

const GeneNameChanger = (props) => {

    const dispatch = useDispatch()

    return (
        <TextField label="Uniprot Accession"
                   variant={"outlined"}
                   size={"small"}
                   value={props.listOfGenes[props.index].uniprotAccession}
                   onChange={(e) => {
                       const newListOfGenes = props.listOfGenes
                       newListOfGenes[props.index].uniprotAccession = e.target.value

                       dispatch({type: "SET_LIST_OF_GENE_PRODUCTS", payload: newListOfGenes})
                   }}/>
    );
};

export default function GeneDetailsContainer(props) {

    const dispatch = useDispatch()

    const handleRestore = (defaultGene) => {

        const newListOfGeneProducts = [...props.listOfGenes]
        newListOfGeneProducts[props.listOfGenesIndex].uniprotAccession = defaultGene.uniprotAccession

        dispatch({type: "SET_LIST_OF_GENE_PRODUCTS", payload: newListOfGeneProducts})
    }

    return (
        <div className={"detail-view"}>
            {props.listOfGenes[props.listOfGenesIndex] &&
                <GeneNameChanger listOfGenes={props.listOfGenes} index={props.listOfGenesIndex}/>}
            <div className={"button-bar button-center"}>
                <button className={"download-button circle-icon"}
                        onClick={() => handleRestore(props.defaultGene)}
                >
                    Restore Gene Settings <RestoreIcon/>
                </button>
            </div>
        </div>
    )

}

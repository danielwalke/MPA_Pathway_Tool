import React from "react";
import {useSelector} from "react-redux";
import {FormControl, InputLabel, NativeSelect} from "@material-ui/core";


const CystolInfo = (nodeId) =>{

    const state = {
        general: useSelector(state => state.general),
        graph: useSelector(state => state.graph),
        keggReaction: useSelector(state => state.keggReaction),
        specificReaction: useSelector(state => state.specificReaction),
        mpaProteins: useSelector(state => state.mpaProteins),
    }

    var cytosolInfo = "";
    var external = ""
    var no = nodeId.node;
    var kafi = ""
    console.log(no)
    if(state.general.cystolInformation.length >0){
        state.general.cystolInformation.forEach(reaction => {
            if(reaction.compoundId === no){
                if(reaction.compartment === "cytosol"){
                    cytosolInfo = reaction.compartment;

                }
                else{
                    external = reaction.compartment;
                }

            }
            else{
                kafi = "None";
            }
        })

    }

    console.log(cytosolInfo);
    console.log(external);

    return(
        <div>
            <FormControl fullWidth>
                <InputLabel variant="standard" htmlFor="uncontrolled-native">
                    Location
                </InputLabel>
                <br/>
                <br/>
                <NativeSelect
                    defaultValue={(cytosolInfo === "") ? external : cytosolInfo}

                >
                    <option value={cytosolInfo}>Cytosol</option>
                    <option value={external}>External</option>

                </NativeSelect>
            </FormControl>
        </div>
    )
}
export default CystolInfo
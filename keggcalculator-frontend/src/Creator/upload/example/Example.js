import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {onModuleFileChange} from "../json upload/ModuleJSONInput";
import {onFileChange} from "../csv upload/experimental data/MpaInput";
import PathwayJson from "../../../exampleData/WoodLjungdahlpathway.json";
import {ToolTipBig} from "../../main/user-interface/UserInterface";

const getFileContent = () => {
    return "id\tkoNumber\tecNumber\tsuperkingdom\tkingdom\tphylum\tclass\torder\tfamily\tgenus\tspecies\tdescription\tsample1\tsample2\n" +
        "protein1\tK01938|K00002\t3.5.4.9|1.5.1.20\tBacteria\tUnknown\tProteobacteria\tGammaproteobacteria\tEnterobacteriales\tEnterobacteriaceae\tEscherichia\tEscherichia coli\tprotein desription\t1\t1000"
}

const Example = () => {
    const dispatch = useDispatch()
    const state = {
        graph: useSelector(state => state.graph)
    }

    const handleExample = () => {
        dispatch({type: "SETLOADING", payload: true})
        const pathwayBlob = new Blob(new Array(JSON.stringify(PathwayJson, null, 2)), {type: "text/plain;charset=utf-8"})
        const pathwayFile = new File([pathwayBlob], "examplePathway.json")
        onModuleFileChange(pathwayFile, dispatch, state)
        const dataBlob = new Blob(new Array(getFileContent()), {type: "text/plain;charset=utf-8"})
        const dataFile = new File([dataBlob], "exampleData.csv")
        onFileChange([dataFile], dispatch)
        dispatch({type: "SETLOADING", payload: false})
    }

    return (
        <div>
            <ToolTipBig title={"Click for seeing an example pathway with example data"} placement={"right"}>
                <button className={"download-button"} style={{width: "70%", fontSize: "0.8em"}}
                        onClick={handleExample}>Example pathway with data
                </button>
            </ToolTipBig>
        </div>
    );
};

export default Example;

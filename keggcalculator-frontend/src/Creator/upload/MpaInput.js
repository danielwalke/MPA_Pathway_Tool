import React from "react";
import {useDispatch, useSelector} from "react-redux";
import UploadIcon from "../icons/uploadIconWhite.svg";
import "./Upload.css"
import {getMax, getMin} from "../usefulFunctions/Math";
import {taxonomicRanks} from "../main/Main";

const MpaInput = () => {
    const dispatch = useDispatch()
    const state = {
        general: useSelector(state => state.general),
        graph: useSelector(state => state.graph),
        keggReaction: useSelector(state => state.keggReaction),
        specificReaction: useSelector(state => state.specificReaction),
        mpaProteins: useSelector(state => state.mpaProteins),
    }
    const onFileChange = async (event, dispatch) => {
        try {
            let files = await event.target.files;
            let reader = new FileReader()
            const allQuants = []
            reader.readAsText(files[0])
            console.log("start")
            reader.onload = e => {
                const result = e.target.result

                const lines = result.split("\n")
                const header = lines[0]
                const headerEntries = header.split(";")
                const sampleNames = []
                if (headerEntries[11].includes(",")) {
                    const sampleNameEntries = headerEntries[11].split(",")
                    sampleNameEntries.map(entry => sampleNames.push(entry))
                }
                lines.shift();//ignore header
                const proteinSet = new Set()
                lines.map((line) => {
                    const entries = line.split(";")
                    let koAndEcSet = new Set()
                    let quantArray = []
                    let taxonomyArray = []
                    if (entries[1].length > 0) {
                        if (entries[1].includes(",")) {
                            const kos = entries[1].split(",")
                            kos.map(ko => koAndEcSet.add(ko))
                        } else {
                            koAndEcSet.add(entries[1])
                        }
                    }
                    if (entries[2].length > 2) {
                        if (entries[2].includes(",")) {
                            const ecs = entries[2].split(",")
                            ecs.map(ec => koAndEcSet.add(ec))
                        } else {
                            koAndEcSet.add(entries[2])
                        }
                    }
                    const taxa = {}
                    taxonomicRanks.map((taxonomicRank,index) =>{
                        const taxon = entries[3+index]
                        taxa[`${taxonomicRank}`] = taxon
                    })
                    // if (entries[3].includes(",")) {
                    //     const taxonomies = entries[3].split(",")
                    //     taxonomies.map(taxonomy => {
                    //         taxonomyArray.push(taxonomy)
                    //         return null
                    //     })
                    // } else {
                    //     if (entries[3].length > 0) {
                    //         taxonomyArray.push(entries[3])
                    //     }
                    // }
                    if (entries[11].includes(",")) {
                        const quants = entries[11].split(",")
                        quants.map(quant => {
                            if (quant.includes("/")) {
                                const quantRatios = quant.split("/")
                                const calcQuant = +quantRatios[0] / +quantRatios[1]
                                quantArray.push(+calcQuant)
                                allQuants.push(+calcQuant)
                            } else {
                                quantArray.push(+quant)
                                allQuants.push(+quant)
                            }
                            return null
                        })
                    } else {
                        quantArray.push(+entries[11])
                        allQuants.push(+entries[11])
                    }
                    const protein = {
                        name: entries[0],
                        koAndEcSet: koAndEcSet,
                        //taxonomies: taxonomyArray,
                        taxa: taxa,
                        quants: quantArray
                    }
                    proteinSet.add(protein)
                    return null
                })
                const minQuant = getMin(allQuants)
                const maxQuant = getMax(allQuants)
                dispatch({type: "SETPROTEINSET", payload: proteinSet})
                dispatch({type: "SETMAXQUANTUSERREACTION3", payload: +maxQuant})
                dispatch({type: "SETMINQUANTUSERREACTION3", payload: +minQuant})
                dispatch({type: "SETMIDQUANTUSERREACTION3", payload: +(+minQuant + (+maxQuant - +minQuant) / 2)})
                dispatch({type: "SETMAXQUANTUSER3", payload: maxQuant})
                dispatch({type: "SETMINQUANTUSER3", payload: minQuant})
                dispatch({type: "SETMIDQUANTUSER3", payload: (+minQuant + (+maxQuant - +minQuant) / 2)})
                dispatch({type: "SETSAMPLENAMES", payload: sampleNames})
                dispatch({type: "SETMPAFILENAME", payload: files[0].name})
            }
        } catch(e) {
            window.alert("Your file format is wrong.")
            console.error(e)
        }


        dispatch({type: "SWITCHLOADING"})
    }

    return (
        <div>
            <label className={"uploadLabel"} htmlFor={"mpa-file"}>Upload experimental data <img src={UploadIcon} style={{
                width: `clamp(6px, 1.7vw, 12px)`,
                transform: "translate(0,0.2vw)"
            }} alt={""}/></label>
            <input style={{display: "none"}} className={"mpaInput"} id={"mpa-file"}
                   onClick={() => dispatch({type: "SWITCHLOADING"})} type={"file"} name={"mpa-file"}
                   onChange={(event) => onFileChange(event, dispatch)}/>
            <br/>
            <div
                className={"fileName"}>{state.mpaProteins.mpaFileName.length > 0 ? state.mpaProteins.mpaFileName : "No file selected"}</div>
            <br/>
        </div>
    )
}

export default MpaInput
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import UploadIcon from "../../../icons/uploadIconWhite.svg";
import "../../main/Upload.css"
import {getMax, getMin} from "../../../usefulFunctions/Math";
import {taxonomicRanks} from "../../../main/Main";
import {ToolTipBig} from "../../../main/user-interface/UserInterface";

export function trimQuotes(string) {
    return string.replace(/^"(.+(?="$))"$/, '$1').replace(/\r$/, '')
}

function splitAndAddIdsToSet(entry, idSet) {
    if (entry.length > 0) { //ko numbers
        if (entry.includes("|")) {
            const kos = entry.split("|")
            kos.forEach(ko => idSet.add(ko))
        } else {
            idSet.add(entry)
        }
    }
}

//import the experimental data
export const onFileChange = (files, dispatch) => {
    // event.preventDefault()
    // const files = event.target.files;
    // const file = getFile(files)
    // const fileSize = getFileSize(file)
    // const chunks = []
    // if(needChunks(fileSize)){
    //     getChunks(file, 0, chunks)
    //     chunks.forEach(chunk =>{
    //         const reader = new FileReader()
    //         reader.onload = e => {
    //             let blob = new Blob(new Array(reader.result.trim()), {type: "text/plain;charset=utf-8"});
    //             saveAs(blob, "ModuleGraph.csv")
    //         }
    //         reader.readAsText(chunk)
    //
    //     })
    // }else{
    //     const reader = new FileReader()
    //     reader.onload = e => console.log(reader.result.length)
    //     reader.readAsText(file)
    // }

    // try {
        dispatch({type: "SETLOADING", payload: true})
        let reader = new FileReader()
        const allQuants = []
        reader.readAsText(files[0])
        reader.onload = e => {
            e.preventDefault()

            const lines = reader.result.trim().split("\n")
            const headerEntries = trimQuotes(lines[0]).split("\t")
            const sampleNames = []

            let columnIterator = 12
            let entryIndexShift = 0

            if(headerEntries.includes("molecular Mass")) {
                entryIndexShift += 2
                columnIterator += entryIndexShift
            }

            for (let sampleIterator = columnIterator; sampleIterator < headerEntries.length; sampleIterator++) {
                const sampleName = headerEntries[sampleIterator]
                sampleNames.push(sampleName)
            }

            lines.shift(); //ignore header

            const proteinSet = new Set()

            lines.forEach((line) => {
                const entries = trimQuotes(line.trim()).split("\t")
                let koAndEcSet = new Set()
                let quantArray = []
                let molecularMass
                let uniprotAccession

                splitAndAddIdsToSet(entries[1], koAndEcSet)
                splitAndAddIdsToSet(entries[2], koAndEcSet)

                if(entryIndexShift === 2) {
                    uniprotAccession = entries[3]
                    molecularMass = parseFloat(entries[4])
                }

                const taxa = {}
                taxonomicRanks.map((taxonomicRank, index) => {
                    const taxon = entries[3 + entryIndexShift + index]
                    taxa[`${taxonomicRank}`] = taxon
                })

                for (let sampleIterator = columnIterator; sampleIterator < entries.length; sampleIterator++) {
                    const quant = entries[sampleIterator]

                    if (quant.includes("/")) {
                        const quantRatios = quant.split("/")
                        const calcQuant = +quantRatios[0] / +quantRatios[1]
                        quantArray.push(+calcQuant)
                        allQuants.push(+calcQuant)
                    } else {
                        quantArray.push(+quant)
                        allQuants.push(+quant)
                    }
                }

                const protein = {
                    name: entries[0],
                    koAndEcSet: koAndEcSet,
                    uniprotAccession: uniprotAccession,
                    molecularMass: molecularMass,
                    taxa: taxa,
                    quants: quantArray
                }

                proteinSet.add(protein)
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
            dispatch({type: "ADD_EXPERIMENTAL_DATA_TO_AUDIT_TRAIL", payload: files[0].name})
            dispatch({type: "SET_EXPERIMENTAL_DATA_FILE", payload: files[0]})
        }
    // } catch (e) {
    //     window.alert("Your file format is wrong.")
    //     console.error(e)
    // }
    dispatch({type: "SETLOADING", payload: false})
}

const MpaInput = () => {
    const dispatch = useDispatch()
    const state = {
        general: useSelector(state => state.general),
        graph: useSelector(state => state.graph),
        keggReaction: useSelector(state => state.keggReaction),
        specificReaction: useSelector(state => state.specificReaction),
        mpaProteins: useSelector(state => state.mpaProteins),
    }

    const getFileSize = file => file.size
    const getChunks = (file, start, chunks) => {
        const chunk = file.slice(start, start + 500000000)
        chunks.push(chunk)
        start += 500000000
        if (start < getFileSize(file)) {
            getChunks(file, start, chunks)
        }

    }

    const onFileClick = (files, dispatch) => {
        onFileChange(files, dispatch)
        // props.setOpen(false)//closes the drawer menu
    }

    return (
        <div>
            <ToolTipBig title={"Click for uploading experimental data"} placement={"right"}>
                <label className={"uploadLabel"} htmlFor={"mpa-file"}>Upload experimental data
                    <img src={UploadIcon} style={{width: `clamp(6px, 1.7vw, 12px)`, transform: "translate(0,0.2vw)"}}
                         alt={""}/>
                </label>
            </ToolTipBig>
            <input style={{display: "none"}} className={"mpaInput"} id={"mpa-file"}
                   onClick={() => dispatch({type: "SWITCHLOADING"})} type={"file"} name={"mpa-file"}
                   onChange={(event) => onFileClick(event.target.files, dispatch)}/>

            <br/>
            <div
                className={"fileName"}>{state.mpaProteins.mpaFileName.length > 0 ? state.mpaProteins.mpaFileName : "No file selected"}</div>
            <hr/>
        </div>
    )
}

export default MpaInput

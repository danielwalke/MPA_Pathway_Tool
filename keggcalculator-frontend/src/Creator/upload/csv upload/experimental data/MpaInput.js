import React from "react";
import {useDispatch, useSelector} from "react-redux";
import UploadIcon from "../../../icons/uploadIconWhite.svg";
import "../../main/Upload.css"
import {getMax, getMin} from "../../../usefulFunctions/Math";
import {taxonomicRanks} from "../../../main/Main";
import {ToolTipBig} from "../../../main/user-interface/UserInterface";


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

    try {
        dispatch({type:"SETLOADING", payload:true})
        let reader = new FileReader()
        const allQuants = []
        reader.readAsText(files[0])
        reader.onload = e => {
            e.preventDefault()
            try {
                const result = reader.result.trim()
                const lines = result.split("\n")
                const header = lines[0]
                const headerEntries = header.split("\t")
                const sampleNames = []
                for (let columnIterator = 12; columnIterator < headerEntries.length; columnIterator++) {
                    const sampleName = headerEntries[columnIterator]
                    sampleNames.push(sampleName)
                }
                lines.shift();//ignore header
                const proteinSet = new Set()
                lines.map((line) => {
                    const entries = line.trim().split("\t")
                    let koAndEcSet = new Set()
                    let quantArray = []
                    if (entries[1].length > 0) { //ko numbers
                        if (entries[1].includes("|")) {
                            const kos = entries[1].split("|")
                            kos.map(ko => koAndEcSet.add(ko))
                        } else {
                            koAndEcSet.add(entries[1])
                        }
                    }
                    if (entries[2].length > 2) { // ec numbers
                        if (entries[2].includes("|")) {
                            const ecs = entries[2].split("|")
                            ecs.map(ec => koAndEcSet.add(ec))
                        } else {
                            koAndEcSet.add(entries[2])
                        }
                    }
                    const taxa = {}
                    taxonomicRanks.map((taxonomicRank, index) => {
                        const taxon = entries[3 + index]
                        taxa[`${taxonomicRank}`] = taxon
                    })
                    for (let columnIterator = 12; columnIterator < entries.length; columnIterator++) {
                        const quant = entries[columnIterator]
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
                dispatch({type:"ADD_EXPERIMENTAL_DATA_TO_AUDIT_TRAIL", payload: files[0].name})
                dispatch({type:"SET_EXPERIMENTAL_DATA_FILE", payload: files[0]})
            }catch (e){
                window.alert("Your file format is wrong.")
                console.error(e)
            }
        }
    } catch(e) {
        window.alert("Your file format is wrong.")
        console.error(e)
    }
    dispatch({type:"SETLOADING", payload:false})
}

const MpaInput = (props) => {
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
        const chunk = file.slice(start,start+500000000)
        chunks.push(chunk)
        start += 500000000
        if(start < getFileSize(file)){
            getChunks(file, start, chunks)
        }

    }

    const onFileClick = (files, dispatch)=>{
        onFileChange(files, dispatch)
        props.setOpen(false)//closes the drawer menu
    }
    return (
        <div>
            <ToolTipBig title={"Click for uploading experimental data"}  placement={"right"}>
            <label className={"uploadLabel"} htmlFor={"mpa-file"}>Upload experimental data <img src={UploadIcon} style={{
                width: `clamp(6px, 1.7vw, 12px)`,
                transform: "translate(0,0.2vw)"
            }} alt={""}/></label>
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

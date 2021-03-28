import CloseIcon from '@material-ui/icons/Close';
import React, {useRef, useEffect, useState} from "react";
import * as d3 from "d3"
import "./ReactionInfo.css"
import {useDispatch, useSelector} from "react-redux";
import Modal from "@material-ui/core/Modal";
import {makeStyles} from "@material-ui/core";
import ReactionCaption from "./ReactionCaption";
import KoAndEcLists from "./KoAndEcLists";
import HeatMap from "./HeatMap";

//TODO: Find error shows heatmaps with unmatched kos -> without EC- number the protein matches automatically
//critic case: two matching proteins for one enzyme for example by same ec- number -> show two heatlines?
const ReactionInfo = () => {
    const dispatch = useDispatch()
    const state = {
        general: useSelector(state => state.general),
        graph: useSelector(state => state.graph),
        keggReaction: useSelector(state => state.keggReaction),
        specificReaction: useSelector(state => state.specificReaction),
        mpaProteins: useSelector(state => state.mpaProteins),
    }
    // const svgContainer = useRef(null)
    // const [matchedProteins, setMatchedProteins] = useState([])
    // const clickedNodeR = state.graph.chosenNode;

    // useEffect(() => {
    //     const proteins = state.mpaProteins.proteinSet;
    //     let newProteins = new Set();
    //     //Rnum to Ko and EcNum
    //     state.general.reactionsInSelectArray.map((r) => {
    //         if (r.reactionId === clickedNodeR) { //if reaction id equals clicked reaction node id
    //             const clickedKoAndEcSet = new Set();
    //             r.koNumbersString && r.koNumbersString.map(ko => {
    //                 clickedKoAndEcSet.add(ko)
    //                 return null
    //             })
    //             r.ecNumbersString && r.ecNumbersString.map(ec => {
    //                 clickedKoAndEcSet.add(ec)
    //                 return null
    //             })
    //             if (proteins.size > 0) {
    //                 const proteinArray = Array.from(proteins)
    //                 proteinArray.map(protein => {
    //                     const proteinKoEcArray = Array.from(protein.koAndEcSet)
    //                     for(let iterator =0; iterator<proteinKoEcArray.length; iterator++){
    //                         const proteinKoAndEc = proteinKoEcArray[iterator]
    //                         if((protein.taxonomies.includes(r.taxonomies[r.taxonomies.length])&& clickedKoAndEcSet.has(proteinKoAndEc))
    //                             || ((protein.taxonomies.length===0 || r.taxonomies.length===0) && clickedKoAndEcSet.has(proteinKoAndEc))){
    //                             newProteins.add(protein)
    //                             break;
    //                         }
    //                     }
    //                     return null
    //                 })
    //             }
    //         }
    //         return null
    //     })
    //     setMatchedProteins(Array.from(newProteins))
    // }, [])
    //
    // useEffect(() => {
    //     //implement colorscale
    //     if (svgContainer.current != null) {
    //         const svg = d3.select(svgContainer.current).attr("height", window.innerHeight * 0.4 + (matchedProteins.length - 2) * window.innerHeight * 0.1).attr("width", "auto")
    //         svg.attr("overflow", "auto")
    //         matchedProteins.map((protein, index) => {
    //             svg.selectAll("circle")
    //                 .data(protein.quants)
    //                 .enter()
    //                 .append("rect")
    //                 .attr("x", (d, i) => window.innerWidth * 0.1 + i * window.innerWidth / 25)
    //                 .attr("y", window.innerHeight * 0.15 + index * window.innerWidth / 25)
    //                 .attr("height", window.innerWidth / 25)
    //                 .attr("width", window.innerWidth / 25)
    //                 .attr("fill", (d, i) => {
    //                     const b = 255 - ((+d - state.mpaProteins.minQuant) / (state.mpaProteins.maxQuant - state.mpaProteins.minQuant)) * 255
    //                     const r = ((+d - state.mpaProteins.minQuant) / (state.mpaProteins.maxQuant - state.mpaProteins.minQuant)) * 255
    //                     return `rgb(${r},0,${b})`
    //                 })
    //
    //
    //             //add quant numbers to rects
    //             svg.selectAll("circle")
    //                 .data(protein.quants)
    //                 .enter()
    //                 .append("text")
    //                 .attr("dx", (d, i) => window.innerWidth * 0.11 + i * window.innerWidth / 25)
    //                 .attr("dy", window.innerHeight * 0.2 + index * window.innerWidth / 25)
    //                 .text(d => d)
    //
    //             //add protein names to row
    //             svg.selectAll("circle")
    //                 .data(matchedProteins)
    //                 .enter()
    //                 .append("div")
    //                 .attr("class", "metaProteinNameContainer")
    //                 .attr("height","2vh")
    //                 .attr("width", "auto")
    //                 .attr("overflow", "scroll")
    //                 .attr("white-space", "nowrap")
    //                 .text(protein.name)
    //
    //             return null
    //         })
    //         //add sample names as header
    //         if (matchedProteins.length > 0) {
    //             svg.selectAll("circle")
    //                 .data(matchedProteins[0].quants)
    //                 .enter()
    //                 .append("text")
    //                 .attr("dx", (d, i) => window.innerWidth * 0.06 + i * window.innerWidth / 25)
    //                 .attr("dy", window.innerHeight * 0.13)
    //                 .attr("transform", (d, i) => `rotate(315,${window.innerWidth * 0.1 + i * window.innerWidth / 25}, ${window.innerHeight * 0.02})`)
    //                 .text((d, i) => state.mpaProteins.sampleNames[i])
    //             // .attr("id", (d,i, index) => `${i.toString()}_${index.toString()}`)
    //         }
    //     }
    //
    // }, [matchedProteins, state.mpaProteins])
    //
    const handleClose = (event, dispatch) => {
        event.preventDefault()
        dispatch({type: "SETSHOWINFO", payload: false})
    }

    const useStyles = makeStyles((theme) => ({
        modal: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        paper: {
            backgroundColor: theme.palette.background.paper,
            fontFamily: "Roboto",
            border: '2px solid rgb(150, 25, 130)',
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3),
        }
    }));

    const classes = useStyles()

    const body = (<div className={"infoWrapper"}>
        <button className={"closeInfo"} onClick={(event) => handleClose(event, dispatch)}><CloseIcon/></button>
        <h4 className={"headerInfo"} style={{top: 0, left: 0}}>You clicked on node {state.graph.chosenNode}!</h4>
        <div className={"svgInfo"} >
            <HeatMap/>
        </div>
        <div className={"koAndEcListContainer"}>
            <KoAndEcLists/>
        </div>
        <ReactionCaption className={"captionReaction"}/>
    </div>)
    return (
        <Modal className={classes.modal} open={state.graph.showInfo}
               onClose={() => dispatch({type: "SETSHOWINFO", payload: false})}>
            {body}
        </Modal>

    )
}

export default ReactionInfo
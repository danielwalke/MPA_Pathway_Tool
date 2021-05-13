import React, {useState} from "react";
import Modal from "@material-ui/core/Modal";
import {useStylesList} from "../../Creator/upload/sbmlParser/KeggCompoundAutoCompleteList";
import {useStyles} from "../../Creator/ModalStyles/ModalStyles";

const Start = () => {
    const titleLists = []
    const [showVideos, setShowVideos] = useState(false)
    const classes = useStyles()
    const firstRowTitles = ["getting an overview", "upload pathway", "add KEGG reaction"]
    const secondRowTitles = ["deleting nodes", "add user-defined reaction", "import KEGG MODULE"]
    const thirdRowTitles = ["import multiple reactions", "download pathway", "reverting reactions"]
    const fourthRowTitles = ["enabling force", "setting abbreviations", "splitting nodes with multiple links"]
    const fifthRowTitles = ["add taxonomy", "change node coordinates", "deemphasizing nodes"]
    const sixthRowTitles = ["mapping experimental data", "download mapped data", "Calculator"]
    titleLists.push(firstRowTitles)
    titleLists.push(secondRowTitles)
    titleLists.push(thirdRowTitles)
    titleLists.push(fourthRowTitles)
    titleLists.push(fifthRowTitles)
    titleLists.push(sixthRowTitles)
    const idLists = []
    const firstRowIds = ["W4U9IxhQSTc", "wNv4l_YwsKQ", "wNv4l_YwsKQ"]
    const secondRowIds = ["wNv4l_YwsKQ", "wNv4l_YwsKQ", "wNv4l_YwsKQ"]
    idLists.push(firstRowIds)
    idLists.push(secondRowIds)
    idLists.push(secondRowIds)
    idLists.push(secondRowIds)
    idLists.push(secondRowIds)
    idLists.push(secondRowIds)

    const videos = (
        <div className={classes.paper} style={{width:"90vw",height:"80vh", overflow:"auto"}}>
            <TutorialRows titleLists={titleLists} idLists={idLists}/>
        </div>
    )

    return (<div style={{ backgroundColor: "rgb(150, 25, 130)", margin: 0}}>
            <div style={{padding:"5px", width: "80vw", marginLeft: "10vw", backgroundColor: "white", zIndex: 1000, height: "100%", textAlign:"justify", hyphens:"auto"}}>
                <h1 style={{marginLeft:"30vw"}}>Getting started</h1>
                <h3>Overview</h3>
                <p>The MPA_Pathway_Tool a new add-on for the <a
                    href={"http://www.mpa.ovgu.de/"}>MetaProteomeAnalyzer</a>. The MPA_Pathway_Tool consists of the
                    Creator,
                    providing creation of user-defined pathways, and the Calculator, providing mapping of data on the
                    created
                    pathways. </p>
                <h3>Creator</h3>
                <p>The "Creator" enables the creation of user-defined pathways by adding reactions iteratively. The left
                    side of
                    the creator contains a list of buttons for uploading experimental data, and pathways (as CSV, JSON
                    and SBML), adding new reactions from KEGG, adding user-defined reactions, importing multiple
                    reactions and downloading created pathways (as CSV, SBML, JSON and SVG) and mapped data (as CSV).
                    Users can also receive help for handling the Creator. The right side contains a graph for
                    visualising the created pathway. Circular shaped nodes are metabolites (in KEGG referred as
                    compounds) and diamond shaped nodes are reactions. Nodes are connected by edges, which display the
                    direction of a reaction.</p>
                <h3>Calculator</h3>
                <p>The "Calculator" consists of two upload zones, one for experimental data and another for
                    multiple pathway files (as CSV, JSON or SBML). The Calculator performs mapping of experimental data
                    on multiple uploaded pathways.</p>
                <h3>Tutorial</h3>
                <p>You can find a detailed Tutorial on <a href={"https://www.youtube.com/"}>Youtube</a>.</p>
                <Modal className={classes.modal} open={showVideos} onClose={() => setShowVideos(false)}>
                    {videos}
                </Modal>
                <button className={"downloadButton"} style={{width:"30vw"}} onClick={()=> setShowVideos(true)}>Tutorial</button>
            </div>
        </div>
    )
}

export default Start

const Tutorial = (props) => {
    const {title, videoId} = props
    return (
        <div style={{
            margin: "5px",
            display: "grid",
            gridTemplateRows: "1fr 19fr",
            width: "25vw",
            minHeight: "250px",
            height: "20vw",
            border: "1px solid black",
            padding:"5px"
        }}>
            <div><h4>{title}</h4></div>
            <div>
                <iframe
                    allowFullScreen="allowfullscreen"
                    width={"95%"} height={"75%"} title={title} src={`http://www.youtube.com/embed/${videoId}?autoplay=0`}/>
            </div>
        </div>
    )
}

const TutorialRow = (props) => {
    const {titles, ids} = props
    return (
        <div style={{display: "grid", gridTemplateColumns: "repeat(3,1fr)"}}>
            {titles.map((title, index) => {
                return (
                    <Tutorial title={title} videoId={ids[index]}/>
                )
            })}
        </div>
    )
}

const TutorialRows = (props) => {
    const {titleLists, idLists} = props
    return (
        <div>
            {titleLists.map((titleList, index) => {
                return (
                    <TutorialRow titles={titleList} ids={idLists[index]}/>
                )
            })}
        </div>
    )
}
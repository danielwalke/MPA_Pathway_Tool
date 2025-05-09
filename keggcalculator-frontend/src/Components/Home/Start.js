import React, {useState} from "react";
import Modal from "@material-ui/core/Modal";
import {useStyles} from "../../Creator/ModalStyles/ModalStyles";
import FaqContainer from "./FAQ/FAQContainer";
import StartCard from "./StartCards/StartCard";
import {Card, CardActionArea, CardContent} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Logo from "../../images/Logo.svg"
import TutorialPdf from "../../tutorial/Tutorial MPA_Pathway_Tool.pdf"
import {Link} from "react-router-dom";
import ExampleData from "./exampleData/ExampleData";
import VIDEOS from "./StartCards/videos.js"

const getVideoRowFeatures = (videos, featureName) => {
    const videoRowFeatures = []
    const features = videos.map(video => video[featureName])
    let videoRow = []
    features.forEach((feature, index) => {
        // push feature to row
        videoRow.push(feature)
        // if row is completed push row to list of rows and reset row
        if ((index + 1) % 3 === 0) {
            videoRowFeatures.push(videoRow)
            videoRow = []
        }
        // if row is not completed, but its the last feature push incomplete row to list of rows
        if ((index + 1) % 3 !== 0 && index === features.length - 1) {
            videoRowFeatures.push(videoRow)
        }
    })
    return videoRowFeatures
}

const Start = (props) => {
    const [showVideos, setShowVideos] = useState(false)
    const classes = useStyles()

    //titleLists
    const videos = (
        <div className={classes.paper} style={{width: "80vw", height: "80vh", overflow: "auto"}}>
            <Link style={{
                textDecoration: "none", color: "white", width: "80%",
                backgroundColor: "rgb(150, 25, 130)",
                borderRadius: "1.5vw",
                transition: "all 400ms ease-in-out",
                textTransform: "uppercase",
                fontSize: "clamp(12px, 1vw, 22px)",
                fontFamily: "Arial" ,
                margin: "5",
                padding: "8px"
            }} to={TutorialPdf} target={"_blank"} download>Download pdf</Link>
            <TutorialRows titleLists={getVideoRowFeatures(VIDEOS, "title")}
                          idLists={getVideoRowFeatures(VIDEOS, "id")}/>
        </div>
    )

    return (<div style={{backgroundColor: "rgb(150, 25, 130)", margin: 0, minHeight: "80vh"}}>
            <div style={{
                padding: "5px",
                width: "80vw",
                marginLeft: "10vw",
                backgroundColor: "white",
                zIndex: 1000,
                height: "100%",
                textAlign: "justify",
                hyphens: "auto"
            }}>
                {/*<Typography style={{ textAlign: "center", color:"rgb(150, 25, 130)"}} variant="h3" component="h2">Getting started</Typography>*/}
                <Card style={{margin: "10px 0"}}>
                    <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                        <div style={{
                            backgroundColor: "#E6E6E6",
                            padding: "2px",
                            margin: "5px",
                            display: "flex",
                            alignItems: "center",
                            width: "50%",
                            height: "10vh",
                            borderRadius: "0.8vw",
                            justifyContent: "center",
                            color: "rgb(150, 25, 130)"
                        }}>
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                height: "8vh"
                            }}><img style={{height: "100%", borderRadius: "0.8vw", border: "0.5px solid black"}}
                                    src={Logo} alt={"Logo"}/></div>
                            <div><Typography variant="h4" component="h3">Getting started</Typography></div>
                        </div>
                    </div>
                </Card>

                <StartCard title={"Overview"}
                           text={"The MPA_Pathway_Tool a new user-friendly, stand-alone web application, the MPA_Pathway_Tool. It\n" +
                           "                    consists of two parts, called “Pathway-Creator” and “Pathway-Calculator”. The “Pathway-Creator”\n" +
                           "                    enables an easy setup of user-defined pathways with specific taxonomic constraints. The\n" +
                           "                    “Pathway-Calculator” automatically maps microbial community data from multiple measurements on\n" +
                           "                    selected pathways and visualizes the results."}/>
                <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px", margin: "5px 0"}}>
                    <div>
                        <StartCard
                            text={"The \"Pathway-Creator\" enables the creation of user-defined pathways by adding reactions iteratively. The left\n" +
                            "                    side of\n" +
                            "                    the creator contains a list of buttons for uploading experimental data, and pathways (as CSV, JSON\n" +
                            "                    and SBML), adding new reactions from KEGG, adding user-defined reactions, importing multiple\n" +
                            "                    reactions and downloading created pathways (as CSV, SBML, JSON and SVG) and mapped data (as CSV).\n" +
                            "                    Users can also receive help for handling the Creator. The right side contains a graph for\n" +
                            "                    visualising the created pathway. Circular shaped nodes are metabolites (in KEGG referred as\n" +
                            "                    compounds) and diamond shaped nodes are reactions. Nodes are connected by edges, which display the\n" +
                            "                    direction of a reaction."} title={"Pathway-Creator"} link={"/creator"}
                            changeState={props.changeState}/>
                    </div>
                    <div>
                        <StartCard
                            text={"The \"Pathway-Calculator\" consists of two upload zones, one for experimental data and another for\n" +
                            "                    multiple pathway files (as CSV, JSON or SBML). The Calculator performs mapping of experimental data\n" +
                            "                    on multiple uploaded pathways."} title={"Pathway-Calculator"}
                            link={"/calculator"} changeState={props.changeState}/>
                    </div>
                </div>
                <FaqContainer/>
                <Card style={{margin: "5px 0"}}><CardContent> <Typography variant="h5" component="h3">
                    Tutorial
                </Typography>
                    <Typography variant="body2" component="p">
                        You can find more details in the following tutorial.
                    </Typography></CardContent><CardActionArea>
                    <button className={"downloadButton"} style={{width: "30vw"}}
                            onClick={() => setShowVideos(true)}>Tutorial
                    </button>
                </CardActionArea></Card>
                <ExampleData/>
                <Modal className={classes.modal} open={showVideos} onClose={() => setShowVideos(false)}>
                    {videos}
                </Modal>

                <Card style={{marginTop:"8px",backgroundColor:"rgb(230,230,230)"}}>
                    <Typography variant="h4" component="h3" style={{textAlign: "center"}}>Site notice</Typography>
                    <CardContent >
                        <div style={{display:"flex", justifyContent: "space-around"}}>
                        <div>
                            <p style={{textAlign: "center"}}>Otto-von-Guericke University Magdeburg</p>
                            <p style={{textAlign: "center"}}>Building 28</p>
                            <p style={{textAlign: "center"}}>Universitätsplatz 2</p>
                            <p style={{textAlign: "center"}}>39106 Magdeburg, Germany</p>
                        </div>
                        <div>
                            <h4 style={{textAlign: "center"}}>
                                Contributors:
                            </h4>
                            <ul style={{textAlign: "left", listStyleType:"none"}}>
                                <li style={{margin:"2px"}}>Daniel Walke - daniel.walke@ovgu.de</li>
                                <li style={{margin:"2px"}}>Kay Schallert - kay.schallert@ovgu.de</li>
                                <li style={{margin:"2px"}}>Prasanna Ramesh - prasanna.ramesh@ovgu.de</li>
                                <li style={{margin:"2px"}}>Emanuel Lange - emanuel.lange@ovgu.de</li>
                                <li style={{margin:"2px"}}>Dr. Dirk Benndorf - benndorf@mpi-magdeburg.mpg.de</li>
                                <li style={{margin:"2px"}}>Prof. Udo Reichl - ureichl@mpi-magdeburg.mpg.de</li>
                                <li style={{margin:"2px"}}>Dr. Robert Heyer - heyer@mpi-magdeburg.mpg.de</li>
                            </ul>
                        </div>
                        </div>

                    </CardContent>
                </Card>
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
            padding: "5px"
        }}>
            <div><h3>{title}</h3></div>
            <div>
                <iframe
                    allowFullScreen="allowfullscreen"
                    width={"95%"} height={"75%"} title={title}
                    src={`http://www.youtube.com/embed/${videoId}?autoplay=0`}/>
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

import React from "react";
import objectToXML from "object-to-xml"
import {saveAs} from "file-saver";
import clonedeep from "lodash/cloneDeep";
import MakeSpeciesList from "./MakeSpeciesList";
import MakeReactionList from "./MakeReactionList";
import MakeReactionObjList from "./MakeReactionObjList";
import MakeSpeciesObjList from "./MakeSpeciesObjList";
import MakeReactionGlyphObjList from "./MakeReactionGlyphObjList";
import MakeSpeciesGlyphObjList from "./MakeSpeciesGlyphObjList";
import MakeCompartmentObjList from "./MakeCompartmentObjList";
import {requestGenerator} from "../../request/RequestGenerator";
import MakeRenderInformationObj from "./MakeRenderInformationObj";
import {endpoint_getTaxonomyIdList} from "../../../App Configurations/RequestURLCollection";
import {useDispatch} from "react-redux";
import {ToolTipBig} from "../../main/user-interface/UserInterface";

const SBMLDownloader = (props) => {
    const dispatch = useDispatch()

    const HandleSBMLDownload = () => {
        const {generalState, graphState} = clonedeep(props)
        const pathwayName = "pathway" //TODO add user interface for text input

        const [reactionsRaw, requestList] = MakeReactionList(generalState, graphState)
        const [speciesRaw, speciesPosRaw, compartmentsRaw] = MakeSpeciesList(reactionsRaw)


        console.log(speciesRaw)
        console.log(reactionsRaw)
        console.log(speciesPosRaw)
        // console.log(requestList)


        const taxonomyUrl = endpoint_getTaxonomyIdList

        requestGenerator("POST", taxonomyUrl, {
            taxonomyList: {"taxonomyList": requestList}
        }, "").then(response => {

            const reaction = MakeReactionObjList(reactionsRaw, response.data)
            const species = MakeSpeciesObjList(speciesRaw)
            const compartments = MakeCompartmentObjList(compartmentsRaw)

            const reactionGlyphObj = MakeReactionGlyphObjList(reactionsRaw)
            const speciesGlyphObj = MakeSpeciesGlyphObjList(speciesPosRaw)

            const renderInformationObj = MakeRenderInformationObj

            const obj = {
                "?xml version=\"1.0\" encoding=\"UTF-8\"?": null,
                sbml: {
                    '@': {
                        xmlns: "http://www.sbml.org/sbml/level3/version2/core",
                        level: "3",
                        version: "2",
                        'xmlns:layout': "http://www.sbml.org/sbml/level3/version2/layout/version1",
                        'layout:required': "false",
                        'xmlns:render': "http://www.sbml.org/sbml/level3/version1/render/version1",
                        'render:required': "false"
                    },
                    model: {
                        '@': {id: pathwayName},
                        '#': {
                            listOfSpecies: {species},
                            listOfReactions: {reaction},
                            listOfCompartments: {compartment: compartments},
                            'layout:listOfLayouts': {
                                '@': {
                                    'xmlns:xsi': "http://www.w3.org/2001/XMLSchema-instance",
                                    'xmlns:layout': "http://www.sbml.org/sbml/level3/version2/layout/version1"
                                },
                                '#': {
                                    'layout:layout': {
                                        '@': {'layout:id': "Layout1"},
                                        '#': {
                                            'layout:dimensions': {
                                                '@': {
                                                    'layout:width': 0.95 * window.innerWidth,
                                                    'layout:height': 0.75 * window.innerHeight
                                                }
                                            },
                                            'layout:listOfReactionGlyphs': {reactionGlyph: reactionGlyphObj},
                                            'layout:listOfSpeciesGlyphs': {speciesGlyph: speciesGlyphObj},
                                            'render:listOfRenderInformation': renderInformationObj
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            console.log(objectToXML(obj))
            dispatch({type: "ADD_SBML_DOWNLOAD_TO_AUDIT_TRAIL"})
            let blob = new Blob(new Array(objectToXML(obj).trim()), {type: "text/plain;charset=utf-8"});
            saveAs(blob, "ModuleGraph.xml")
        })
    }

    return (
        <div>
            <ToolTipBig title={"Click for downloading the pathway as SBML"} placement={"right"}>
                <button disabled={!props.graphState.data.nodes.length > 0} className={"downloadButton"}
                        onClick={HandleSBMLDownload}>Download SBML
                </button>
            </ToolTipBig>
        </div>)

}

export default SBMLDownloader

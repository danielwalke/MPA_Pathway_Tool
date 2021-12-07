import React from "react";
import objectToXML from "object-to-xml"
import {saveAs} from "file-saver";
import clonedeep from "lodash/cloneDeep";
import makeSpeciesList from "./MakeSpeciesList";
import makeReactionList from "./MakeReactionList";
import makeReactionObjList from "./MakeReactionObjList";
import makeSpeciesObjList from "./MakeSpeciesObjList";
import makeReactionGlyphObjList from "./MakeReactionGlyphObjList";
import makeSpeciesGlyphObjList from "./MakeSpeciesGlyphObjList";
import makeCompartmentObjList from "./MakeCompartmentObjList";
import MakeRenderInformationObj from "./MakeRenderInformationObj";
import {useDispatch} from "react-redux";
import {ToolTipBig} from "../../main/user-interface/UserInterface";
import {requestTaxonomiesForReactions} from "./RequestTaxonomiesForReactions";
import {makeObjectiveObjList} from "./makeObjectiveObjList";

const SBMLDownloader = (props) => {

    const dispatch = useDispatch()
    const state = clonedeep(props)

    const handleSbmlDownload = async () => {

        const pathwayName = "mpapathway"

        const reactionTaxonomies = await requestTaxonomiesForReactions(state.generalState.reactionsInSelectArray)
        const {reactionList, listOfObjectives} = makeReactionList(
            state.generalState.reactionsInSelectArray, reactionTaxonomies)
        const [speciesObjArray, compartmentObjArray] = makeSpeciesList(reactionList)

        const reactionXmlList = makeReactionObjList(reactionList)
        const speciesXmlList = makeSpeciesObjList(speciesObjArray)
        const compartmentXmlList = makeCompartmentObjList(compartmentObjArray)
        let objectivesXmlList
        if (listOfObjectives.length > 0) {
            objectivesXmlList = makeObjectiveObjList(listOfObjectives)
        }

        console.log(objectivesXmlList)

        const reactionGlyphXmlList = makeReactionGlyphObjList(reactionList)
        const speciesGlyphXmlList = makeSpeciesGlyphObjList(speciesObjArray)

        const renderInformationXml = MakeRenderInformationObj

        const sbml = {
            "?xml version=\"1.0\" encoding=\"UTF-8\"?": null,
            sbml: {
                '@': {
                    xmlns: "http://www.sbml.org/sbml/level3/version2/core",
                    level: "3",
                    version: "2",
                    'xmlns:layout': "http://www.sbml.org/sbml/level3/version2/layout/version1",
                    'layout:required': "false",
                    'xmlns:render': "http://www.sbml.org/sbml/level3/version1/render/version1",
                    'render:required': "false",
                    'xmlns:fbc': "http://www.sbml.org/sbml/level3/version1/fbc/version2",
                    'fbc:required':"false"
                },
                model: {
                    '@': {id: pathwayName, 'fbc:strict': "true"},
                    '#': {
                        'fbc:listOfObjectives': objectivesXmlList,
                        listOfSpecies: {species: speciesXmlList},
                        listOfReactions: {reaction: reactionXmlList},
                        listOfCompartments: {compartment: compartmentXmlList},
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
                                        'layout:listOfReactionGlyphs': {reactionGlyph: reactionGlyphXmlList},
                                        'layout:listOfSpeciesGlyphs': {speciesGlyph: speciesGlyphXmlList},
                                        'render:listOfRenderInformation': renderInformationXml
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        console.log(objectToXML(sbml))
        dispatch({type: "ADD_SBML_DOWNLOAD_TO_AUDIT_TRAIL"})
        let blob = new Blob(new Array(objectToXML(sbml).trim()), {type: "text/plain;charset=utf-8"});
        // saveAs(blob, "ModuleGraph.xml")
    }

    return (
        <div>
            <ToolTipBig title={"Click for downloading the pathway as SBML"} placement={"right"}>
                <button disabled={!props.graphState.data.nodes.length > 0} className={"download-button"}
                        onClick={handleSbmlDownload}>Download SBML
                </button>
            </ToolTipBig>
        </div>)

}

export default SBMLDownloader

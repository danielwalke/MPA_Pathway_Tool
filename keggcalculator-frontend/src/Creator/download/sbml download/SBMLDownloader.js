import React from "react";
import objectToXML from "object-to-xml"
import {saveAs} from "file-saver";
import clonedeep from "lodash/cloneDeep";
import makeSpeciesList from "./makeSpeciesList";
import makeReactionList from "./makeReactionList";
import makeReactionObjList from "./makeReactionObjList";
import makeSpeciesObjList from "./makeSpeciesObjList";
import makeReactionGlyphObjList from "./makeReactionGlyphObjList";
import makeSpeciesGlyphObjList from "./makeSpeciesGlyphObjList";
import makeCompartmentObjList from "./makeCompartmentObjList";
import MakeRenderInformationObj from "./makeRenderInformationObj";
import {useDispatch} from "react-redux";
import {ToolTipBig} from "../../main/user-interface/UserInterface";
import {requestTaxonomiesForReactions} from "./requestTaxonomiesForReactions";
import {makeObjectiveObjList} from "./makeObjectiveObjList";
import {makeParameterObjList} from "./makeParameterObjList";
import {makeGeneProductList} from "./makeGeneProductList";

const SBMLDownloader = (props) => {

    const dispatch = useDispatch()
    const state = clonedeep(props)

    const handleSbmlDownload = async () => {

        const pathwayName = "mpapathway"

        const reactionTaxonomies = await requestTaxonomiesForReactions(state.generalState.reactionsInSelectArray)
        const {reactionList, listOfObjectives, reactionToParameterMap, parametersMap} = makeReactionList(
            state.generalState.reactionsInSelectArray, reactionTaxonomies)
        const [speciesObjArray, compartmentObjArray] = makeSpeciesList(reactionList)

        const {reactionXmlList, genesInReactions} = makeReactionObjList(reactionList, reactionToParameterMap)
        const geneProductXmlList = makeGeneProductList(genesInReactions, state.generalState.listOfGeneProducts)
        const speciesXmlList = makeSpeciesObjList(speciesObjArray)
        const compartmentXmlList = makeCompartmentObjList(compartmentObjArray)

        let objectivesXmlList
        if (listOfObjectives.length > 0) {
            objectivesXmlList = makeObjectiveObjList(listOfObjectives)
        }

        const parametersXmlList = makeParameterObjList(parametersMap)

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
                    'xmlns:render': "http://www.sbml.org/sbml/level3/version2/render/version1",
                    'render:required': "false",
                    'xmlns:fbc': "http://www.sbml.org/sbml/level3/version2/fbc/version2",
                    'fbc:required':"false"
                },
                model: {
                    '@': {id: pathwayName, 'fbc:strict': "true"},
                    '#': {
                        'fbc:listOfObjectives': objectivesXmlList,
                        'listOfParameters': parametersXmlList,
                        listOfSpecies: {species: speciesXmlList},
                        listOfReactions: {reaction: reactionXmlList},
                        listOfCompartments: {compartment: compartmentXmlList},
                        'fbc:listOfGeneProducts': geneProductXmlList,
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

        dispatch({type: "ADD_SBML_DOWNLOAD_TO_AUDIT_TRAIL"})
        let blob = new Blob(new Array(objectToXML(sbml).trim()), {type: "text/plain;charset=utf-8"});
        saveAs(blob, "ModuleGraph.xml")
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

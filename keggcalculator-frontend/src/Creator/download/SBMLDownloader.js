import React from "react";
import {useDispatch, useSelector} from "react-redux";
import ReactDomServer from "react-dom/server"
import objectToXML from "object-to-xml"
import {saveAs} from "file-saver";
import {getReactions} from "./DownloadFunctions";
import clonedeep from "lodash/cloneDeep";
import {getNodePosition} from "./NodePosition";
import {graphReducer} from "../reducers/Graph";
import MakeSpeciesList from "./MakeSpeciesList";
import MakeReactionList from "./MakeReactionList";
import MakeReactionObjList from "./MakeReactionObjList";
import MakeSpeciesObjList from "./MakeSpeciesObjList";
import MakeReactionGlyphObjList from "./MakeReactionGlyphObjList";
import MakeSpeciesGlyphObjList from "./MakeSpeciesGlyphObjList";
import MakeCompartmentObjList from "./MakeCompartmentObjList";

const SBMLDownloader = () => {
    const state = clonedeep(useSelector(state => state))

    const HandleSBMLDownload = () => {

        const pathwayName = "pathway" //TODO add user interface for text input

        const reactionsRaw = MakeReactionList(state)
        const [speciesRaw, speciesPosRaw ,compartmentsRaw] = MakeSpeciesList(reactionsRaw)

        console.log(speciesRaw)
        console.log(speciesPosRaw)
        console.log(compartmentsRaw)
        console.log(reactionsRaw)

        const reaction = MakeReactionObjList(reactionsRaw)
        const species = MakeSpeciesObjList(speciesRaw)
        const compartments = MakeCompartmentObjList(compartmentsRaw)

        const reactionGlyphObj = MakeReactionGlyphObjList(reactionsRaw)
        const speciesGlyphObj = MakeSpeciesGlyphObjList(speciesRaw)


        const obj = {
            "?xml version=\"1.0\" encoding=\"UTF-8\"?": null,
            sbml: {
                '@': {
                    xmlns: "http://www.sbml.org/sbml/level3/version2/core",
                    'xmlns:layout': "http://www.sbml.org/sbml/level3/version1/layout/version1",
                    'layout:required': "false",
                    level: "3",
                    version: "2"
                    //    Optional: metaID, SBOterm (sysbio semantics declaring type of model elements), package namespaces and
                    //    required attribute
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
                                'xmlns:layout':"http://www.sbml.org/sbml/level3/version1/layout/version1"
                            },
                            '#': {
                                'layout:layout': {
                                    '@': {'layout:id': "Layout1"},
                                    '#': {
                                        'layout:dimensions': {'@': {'layout:width':"400", 'layout:height':"230"}},
                                        'layout:listOfReactionGlyphs': {reactionGlyph: reactionGlyphObj},
                                        'layout:listOfSpeciesGlyphs': {speciesGlyph: speciesGlyphObj}
                                    }
                                }
                            }
                        }
                    }
                }
            }

        }

        console.log(objectToXML(obj))
        let blob = new Blob(new Array(objectToXML(obj).trim()), {type: "text/plain;charset=utf-8"});
        saveAs(blob, "ModuleGraph.xml")
    }

    return (
        <div>
            <button className={"downloadButton"} onClick={HandleSBMLDownload}>Download SBML
            </button>
        </div>
    )
}

export default SBMLDownloader
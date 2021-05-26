import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import ReactDomServer from "react-dom/server"
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
import {compoundUrl} from "../../request/RequestHandling";

const SBMLDownloader = () => {

    const generalState = clonedeep(useSelector(state => state.general))
    const graphState = clonedeep(useSelector(state => state.graph))

    const HandleSBMLDownload = () => {

        const pathwayName = "pathway" //TODO add user interface for text input

        const [reactionsRaw, requestList] = MakeReactionList(generalState, graphState)
        const [speciesRaw, speciesPosRaw, compartmentsRaw] = MakeSpeciesList(reactionsRaw)

        console.log(reactionsRaw)
        console.log(requestList)

        const taxonomyUrl = "http://127.0.0.1/keggcreator/taxonomyIdList"

        requestGenerator("POST", taxonomyUrl, {
            taxonomyList: {"taxonomyList": requestList}}, "").then(response => {

                const taxonomyIdArray = response.data

            console.log(taxonomyIdArray)

                const reaction = MakeReactionObjList(reactionsRaw, response.data)
                const species = MakeSpeciesObjList(speciesRaw)
                const compartments = MakeCompartmentObjList(compartmentsRaw)

                const reactionGlyphObj = MakeReactionGlyphObjList(reactionsRaw)
                const speciesGlyphObj = MakeSpeciesGlyphObjList(speciesPosRaw)

                    const obj = {
                        "?xml version=\"1.0\" encoding=\"UTF-8\"?": null,
                            sbml: {
                                '@': {
                                    xmlns: "http://www.sbml.org/sbml/level3/version2/core",
                                    'xmlns:layout': "http://www.sbml.org/sbml/level3/version2/layout/version1",
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
                                                'xmlns:layout':"http://www.sbml.org/sbml/level3/version2/layout/version1"
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
                            }}

        console.log(objectToXML(obj))

        // let blob = new Blob(new Array(objectToXML(obj).trim()), {type: "text/plain;charset=utf-8"});
        // saveAs(blob, "ModuleGraph.xml"))
        })}

        return (
        <div>
            <button className={"downloadButton"} onClick={HandleSBMLDownload}>Download SBML
            </button>
        </div>)

    }

export default SBMLDownloader
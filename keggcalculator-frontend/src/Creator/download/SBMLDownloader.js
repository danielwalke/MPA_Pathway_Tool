import React from "react";
import {useDispatch, useSelector} from "react-redux";
import ReactDomServer from "react-dom/server"
import objectToXML from "object-to-xml"
import {saveAs} from "file-saver";

const handleSBMLDownload = (state, dispatch) => {
    // const element = React.createElement("animal", {type: "guinea pig", name: "Sparkles"})
    // console.log(element)
    // const elementXML = ReactDomServer.renderToStaticMarkup(element)
    // console.log(elementXML)

    console.log(state.general.reactionsInSelectArray)
    const pathwayName = "pathway" //TODO add user interface for text input
    const listOfReactionsObject = []
    for(const reactionObject of state.general.reactionsInSelectArray){
        const reaction = {}
        reaction[`@`] = {id: reactionObject.reactionId, name: reactionObject.reactionName}
        reaction['#'] = {}
        reaction['#']['listOfReactants'] = {}
        reaction['#']['listOfReactants']['#'] = {}
        reaction['#']['listOfReactants']['#']['speciesReference'] = {"@": {species:"lol"}}
        listOfReactionsObject.push(reaction)
    }
    const reaction = listOfReactionsObject
    const obj = {
        '?xml version=\"1.0\" encoding=\"UTF-8\"?': null,
        sbml: {
            '@': {
                xmlns: 'http://www.sbml.org/sbml/level2',
                level: "2",
                metaid: "metaid_0000001",
                version: "1"
            },
            '#': {
                model: {
                    '@': {
                        id: pathwayName, metaid: "metaid_0000002", name: pathwayName
                    },
                    '#': {
                        notes: {body: ""},
                        annotation: "annotation",
                        listOfReactions: {
                            '#': {reaction}
                        }
                    }
                }
            }
        }
    };
    console.log(objectToXML(obj))
    // let blob = new Blob(new Array(objectToXML(obj).trim()), {type: "text/plain;charset=utf-8"});
    // saveAs(blob, "ModuleGraph.xml")
}

const SBMLDownloader = () => {
    const state = useSelector(state => state)
    const dispatch = useDispatch()
    return (
        <div>
            <button className={"downloadButton"} onClick={() => handleSBMLDownload(state, dispatch)}>Download SBML
            </button>
        </div>
    )
}

export default SBMLDownloader
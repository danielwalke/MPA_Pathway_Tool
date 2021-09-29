import React from 'react';


import {makeStyles} from "@material-ui/core";
import Modal from "@material-ui/core/Modal";
import {useDispatch, useSelector} from "react-redux";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import DeleteIcon from "@material-ui/icons/Delete";
import {requestGenerator} from "../request/RequestGenerator";
import {handleDrawGraph} from "../../Creator/keggReaction/multiple reactions/EcReactions";
import {readReactions} from "../upload/sbmlParser/SbmlReader/ReaderFunctions";
import clonedeep from "lodash/cloneDeep"

import {endpoint_TaxonomyById} from "../../App Configurations/RequestURLCollection";
import {endpoint_getFbaSolution} from "../../App Configurations/RequestURLCollection";
import {forEach} from "lodash/fp/_util";


const fbaSolution = endpoint_getFbaSolution
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



const FbaSolution = () =>{

    const state = useSelector(state => state.keggReaction)
    const classes = useStyles();
    const dispatch = useDispatch();
    const graphState = useSelector(state => state.graph)
    const generalState = useSelector(state => state.general)



    const getReaction = (reactions) =>{
        reactions.forEach(reaction => {
            const fbaSolution = clonedeep(reaction.fbaSolution)
            const minFlux = clonedeep(reaction.minFlux)
            const maxFlux = clonedeep(reaction.maxFlux)
            reaction.fbaSolution = fbaSolution
            reaction.minFlux = minFlux
            reaction.maxFlux = maxFlux
        })
        return reactions
    }



    const getfbaflux = (reaction) => {
        const requestPromise = requestGenerator("POST", fbaSolution, {FBA: JSON.stringify(reaction)}, "", "")
            .then(response => {
                console.log(response.data);
                const reactionList = []
                const reactionsMap = new Map();
                response.data.forEach(object => {
                    const reactions = getReaction(object)
                    reactionsMap.set(object.reactionId, reactions)
                    reactionList.push(object.reactionId)
                })
                return (
                    {reactionList, reactionsMap}
                )
            })
        return (
            requestPromise
        )

    }

    const solution = (selection) =>{

        var metabolites = {};
        for (var i in selection.substrates){
            var item = selection.substrates[i];

            metabolites.push({
            ["m_"+i]: {
                    "metabolitesId" : item.name.slice(item.name.length - 6),
                    "stoichiometry": parseFloat(- item.stoichiometry)
                }
            })
        }
        for(var i in selection.products){
            var item = selection.products[i];

            metabolites.push({
                ["m_"+ i]:{
                    "metabolitesId": item.name.slice(item.name.length - 6),
                    "stoichiometry": parseFloat(item.stoichiometry)
                }
            })
        }
        var json = Object.assign({}, metabolites);;
        return json;
    }

    var data = {
        reactions: [],
        metabolites: []
    };



    for (var i in generalState.reactionsInSelectArray) {
        var item = generalState.reactionsInSelectArray[i];

            data.reactions.push({
                "reactionId": item.reactionId,
                "reactionName": item.reactionName,
                "lowerBound": Math.floor(Math.random() * 100),
                "upperBound": Math.floor(Math.random() * 1000),
                "objectiveCoefficient": 0,
                "exchangeReaction": item.reversible,
                "metabolites" : solution(item)
                // "metabolites": {
                //
                //     ["m_" + item.substrates.forEach((i) => {it = item.substrates[i]})]: {
                //         "metabolitieId": it.id,
                //         "stoichiometry": it.stoichiometry
                //     }
                // }
            })
        for(var j in item.substrates){
            var mal_item = item.substrates[j];
            data.metabolites.push({
                "metaboliteId" : mal_item.name.slice(mal_item.name.length - 6),
                "metaboliteName" : mal_item.name,
                "compartment" : "cystol"
            })
        }
        for(var j in item.products){
            var mal_item = item.products[j];
            data.metabolites.push({
                "metaboliteId" : mal_item.name.slice(mal_item.name.length - 6),
                "metaboliteName" : mal_item.name,
                "compartment" : "external"
            })
        }




    }

    //var reaction_test = "{\"reactions\":[{\"reactionId\":\"R00001\",\"reactionName\":\"Reaction1\",\"lowerBound\":0.0,\"upperBound\":1000.0,\"objectiveCoefficient\":0,\"exchangeReaction\":false,\"metabolites\":{\"m_1\":{\"metaboliteId\":\"C00001\",\"stoichiometry\":1.0},\"m_2\":{\"metaboliteId\":\"C00002\",\"stoichiometry\":1.0},\"m_3\":{\"metaboliteId\":\"C00004\",\"stoichiometry\":-1.0}}},{\"reactionId\":\"R00002\",\"reactionName\":\"Reaction2\",\"lowerBound\":0.0,\"upperBound\":1000.0,\"objectiveCoefficient\":1,\"exchangeReaction\":false,\"metabolites\":{\"m_1\":{\"metaboliteId\":\"C00001\",\"stoichiometry\":-1.0},\"m_2\":{\"metaboliteId\":\"C00002\",\"stoichiometry\":-1.0},\"m_3\":{\"metaboliteId\":\"C00005\",\"stoichiometry\":1.0}}},{\"reactionId\":\"R00003\",\"reactionName\":\"Reaction3\",\"lowerBound\":-500.0,\"upperBound\":500.0,\"objectiveCoefficient\":0,\"exchangeReaction\":true,\"metabolites\":{\"m_1\":{\"metaboliteId\":\"C00004\",\"stoichiometry\":1.0}}},{\"reactionId\":\"R00004\",\"reactionName\":\"Reaction4\",\"lowerBound\":-500.0,\"upperBound\":500.0,\"objectiveCoefficient\":0,\"exchangeReaction\":true,\"metabolites\":{\"m_1\":{\"metaboliteId\":\"C00005\",\"stoichiometry\":1.0}}}],\"metabolites\":[{\"metaboliteId\":\"C00001\",\"metaboliteName\":\"Metabolite1\",\"compartment\":\"cytosol\"},{\"metaboliteId\":\"C00002\",\"metaboliteName\":\"Metabolite2\",\"compartment\":\"cytosol\"},{\"metaboliteId\":\"C00004\",\"metaboliteName\":\"Metabolite4\",\"compartment\":\"external\"},{\"metaboliteId\":\"C00005\",\"metaboliteName\":\"Metabolite5\",\"compartment\":\"external\"}]}"

    var reaction_array = {
        reactions : [],
        metabolites: []
    };

    reaction_array.reactions.push(
        {"reactionId":"R00001",
            "reactionName":"Reaction1",
            "lowerBound":0.0,
            "upperBound":1000.0,
            "objectiveCoefficient":0,
            "exchangeReaction":false,
            "metabolites":{
                "m_1":{
                    "metaboliteId":"C00001",
                    "stoichiometry":1.0
                },
                "m_2":{
                    "metaboliteId":"C00002",
                    "stoichiometry":1.0
                },
                "m_3":{
                    "metaboliteId":"C00004",
                    "stoichiometry":-1.0}
            }
        },
        {"reactionId":"R00002",
            "reactionName":"Reaction2",
            "lowerBound":0.0,
            "upperBound":1000.0,
            "objectiveCoefficient":1,
            "exchangeReaction":false,
            "metabolites":{
                "m_1":{"metaboliteId":"C00001",
                    "stoichiometry":-1.0},
                "m_2":{"metaboliteId":"C00002",
                    "stoichiometry":-1.0},
                "m_3":{"metaboliteId":"C00005",
                    "stoichiometry":1.0}
            }
        },
        {"reactionId":"R00003",
            "reactionName":"Reaction3",
            "lowerBound":-500.0,
            "upperBound":500.0,
            "objectiveCoefficient":0,
            "exchangeReaction":true,
            "metabolites":{
                "m_1":{"metaboliteId":"C00004",
                    "stoichiometry":1.0}
            }
        },
        {"reactionId":"R00004",
            "reactionName":"Reaction4",
            "lowerBound":-500.0,
            "upperBound":500.0,
            "objectiveCoefficient":0,
            "exchangeReaction":true,
            "metabolites":{
                "m_1":{"metaboliteId":"C00005",
                    "stoichiometry":1.0}
            }
        }
    )
    reaction_array.metabolites.push(
    {"metaboliteId":"C00001",
        "metaboliteName":"Metabolite1",
        "compartment":"cytosol"},
    {"metaboliteId":"C00002",
        "metaboliteName":"Metabolite2",
        "compartment":"cytosol"},
    {"metaboliteId":"C00004",
        "metaboliteName":"Metabolite4",
        "compartment":"external"},
    {"metaboliteId":"C00005",
        "metaboliteName":"Metabolite5",
        "compartment":"external"}
    )


   // getfbaflux(reaction_test);

    console.log("DUMMY DATA");
    console.log(JSON.stringify(reaction_array));

    console.log("Real DATA");
    console.log(JSON.stringify(data));

    console.log(getfbaflux(data));
    //console.log(getfbaflux(data));






    return (

        <button onClick={()=> getfbaflux(data)}>ADD FLUX </button>

        // <button name={"FLUX ANA"}
        //         className={"addKo"}
        //         onClick={(e) => {
        //             e.preventDefault()
        //             getfbaflux(data)
        //             dispatch({type: "SETFBAANDFLUX", payload: generalState.fbaSolution})
        //         }}> Add FLUX </button>
    )


}

export default FbaSolution;
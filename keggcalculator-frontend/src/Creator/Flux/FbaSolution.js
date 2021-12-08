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
import {Button} from "react-bootstrap";


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
            const reaction = {};
            const fbaSolution = clonedeep(reactions.fbaSolution)
            const minFlux = clonedeep(reactions.minFlux)
            const maxFlux = clonedeep(reactions.maxFlux)
            reaction.fbaSolution = fbaSolution
            reaction.minFlux = minFlux
            reaction.maxFlux = maxFlux

        return reaction
    }


    const reactionMap = new Map();
    const reaction_sOd = {};

    const reaction_dummy = {
        'R00955' : {
            "fbaSolution" : 500,
            "minFlux": 500,
            "maxFlux": 500
        },
        'R06057' : {
            "fbaSolution" : 100,
            "minFlux": 100,
            "maxFlux": 100
        },
        'R06044' : {
            "fbaSolution" : 700,
            "minFlux": 700,
            "maxFlux": 700
        }

    };

    const getfbaflux = (reaction) => {
        dispatch({type: "SWITCHLOADING"})
        const requestPromise = requestGenerator("POST", fbaSolution,  "", "", reaction)
            .then(response => {
                var data_reply = response.data;

                const reactionList = []
                const reactionsMap = new Map();
                for(var i in response.data){
                    var data_item =  response.data[i];

                    for(var key in data_item){
                        var item_data = data_item[key];


                            reactionList[key] = {
                                "fbaSolution" : item_data.fbaSolution,
                                "minFlux": item_data.minFlux,
                                "maxFlux": item_data.maxFlux
                            }



                        console.log(key);
                        console.log(item_data.minFlux);
                    }


                    // data_item.forEach(object=>{
                    //     const reaction_details = getReaction(object);
                    //     reactionMap.set(object, reaction_details);
                    //     reactionList.push(object);
                    // })
                }
                console.log(reactionList);
                dispatch({type: "SETFBAANDFLUX", payload: reactionList});
                dispatch({type: "SWITCHLOADING", payload: false});
                dispatch({type: "SETFBAVALUES", payload: reactionList});
                return (

                    reactionList
                )


            })
        return (
            requestPromise
        )

    }

    const solution = (selection) =>{
        //havar met = {};
        var metabolites = {};
        var i = 0;
        for (i in selection.substrates){
            var item = selection.substrates[i];

            // metabolites.push(
            //     "kafi" : {
            //         "metabolitesId": item.name.slice(item.name.length - 6),
            //         "stoichiometry": parseFloat(-item.stoichiometry)
            //     }
            // )

            metabolites["m_"+i] = {
                "metaboliteId": item.name.slice(item.name.length - 6),
                "stoichiometry": parseFloat(-item.stochiometry)
            }
            i++;
        }
        for(var j in selection.products){
            var item = selection.products[j];

            metabolites["m_"+i] = {
                "metaboliteId": item.name.slice(item.name.length - 6),
                "stoichiometry": parseFloat(item.stochiometry)
            }
            i++;
        }

        var json = Object.assign({}, metabolites);;
        return metabolites;
    }

    var data = {
        reactions: [],
        metabolites: []
    };

    var objectiveCo = 0;
    var exchange_value = false;
    var cystol_info = "";
    for (var i in generalState.reactionsInSelectArray) {
        var item = generalState.reactionsInSelectArray[i];
            generalState.exchangeReaction.forEach(reaction =>{
                if(reaction.reactionId == item.reactionId){
                    exchange_value = reaction.exchangeInfo;
                }
            });
            generalState.objectiveCoeffecient.forEach(reaction =>{
            if(reaction.reactionId == item.reactionId){
                objectiveCo = reaction.objectiveCoefficient;
            }
             });
            data.reactions.push({
                "reactionId": item.reactionId,
                "reactionName": item.reactionName,
                "lowerBound": Math.floor(-100),
                "upperBound": Math.floor(100),
                "objectiveCoefficient": parseInt(objectiveCo),
                "exchangeReaction": JSON.parse(exchange_value),
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

                const found = data.metabolites.some(el => el.metaboliteName === mal_item.name);
                console.log(found);
                if(!found){
                    generalState.cystolInformation.forEach(reaction =>{
                        if(reaction.compoundId == mal_item.name.slice(mal_item.name.length -6)){
                            cystol_info = reaction.compartment;
                        }
                    });
                    data.metabolites.push({
                        "metaboliteId" : mal_item.name.slice(mal_item.name.length - 6),
                        "metaboliteName" : mal_item.name,
                        "compartment" : cystol_info
                    })
                }

        }
        for(var j in item.products){

            var mal_item = item.products[j];

            const found2 = data.metabolites.some(el => el.metaboliteName === mal_item.name);
            if(!found2){
                generalState.cystolInformation.forEach(reaction => {
                    if (reaction.compoundId == mal_item.name.slice(mal_item.name.length - 6)) {
                        cystol_info = reaction.compartment;
                    }
                });
                data.metabolites.push({
                    "metaboliteId": mal_item.name.slice(mal_item.name.length - 6),
                    "metaboliteName": mal_item.name,
                    "compartment": cystol_info
                })
            }



        }




    }

    //var reaction_test = "{\"reactions\":[{\"reactionId\":\"R00001\",\"reactionName\":\"Reaction1\",\"lowerBound\":0.0,\"upperBound\":1000.0,\"objectiveCoefficient\":0,\"exchangeReaction\":false,\"metabolites\":{\"m_1\":{\"metaboliteId\":\"C00001\",\"stoichiometry\":1.0},\"m_2\":{\"metaboliteId\":\"C00002\",\"stoichiometry\":1.0},\"m_3\":{\"metaboliteId\":\"C00004\",\"stoichiometry\":-1.0}}},{\"reactionId\":\"R00002\",\"reactionName\":\"Reaction2\",\"lowerBound\":0.0,\"upperBound\":1000.0,\"objectiveCoefficient\":1,\"exchangeReaction\":false,\"metabolites\":{\"m_1\":{\"metaboliteId\":\"C00001\",\"stoichiometry\":-1.0},\"m_2\":{\"metaboliteId\":\"C00002\",\"stoichiometry\":-1.0},\"m_3\":{\"metaboliteId\":\"C00005\",\"stoichiometry\":1.0}}},{\"reactionId\":\"R00003\",\"reactionName\":\"Reaction3\",\"lowerBound\":-500.0,\"upperBound\":500.0,\"objectiveCoefficient\":0,\"exchangeReaction\":true,\"metabolites\":{\"m_1\":{\"metaboliteId\":\"C00004\",\"stoichiometry\":1.0}}},{\"reactionId\":\"R00004\",\"reactionName\":\"Reaction4\",\"lowerBound\":-500.0,\"upperBound\":500.0,\"objectiveCoefficient\":0,\"exchangeReaction\":true,\"metabolites\":{\"m_1\":{\"metaboliteId\":\"C00005\",\"stoichiometry\":1.0}}}],\"metabolites\":[{\"metaboliteId\":\"C00001\",\"metaboliteName\":\"Metabolite1\",\"compartment\":\"cytosol\"},{\"metaboliteId\":\"C00002\",\"metaboliteName\":\"Metabolite2\",\"compartment\":\"cytosol\"},{\"metaboliteId\":\"C00004\",\"metaboliteName\":\"Metabolite4\",\"compartment\":\"external\"},{\"metaboliteId\":\"C00005\",\"metaboliteName\":\"Metabolite5\",\"compartment\":\"external\"}]}"

    var reaction_array = {
        reactions : [],
        metabolites: []
    };

    reaction_array.reactions.push(
                {
                    "reactionId": "R00955",
                    "reactionName": "UDP-glucose:alpha-D-galactose-1-phosphate uridylyltransferase; UDP-glucose + alpha-D-Galactose 1-phosphate <=> D-Glucose 1-phosphate + UDP-alpha-D-galactose R00955",
                    "lowerBound": -100,
                    "upperBound": 100,
                    "objectiveCoefficient": 0,
                    "exchangeReaction": false,
                    "metabolites": {
                        "m_0": {
                            "metaboliteId": "C00103",
                            "stoichiometry": -1
                        },
                        "m_1": {
                            "metaboliteId": "C00446",
                            "stoichiometry": 1
                        }
                    }
                },
                {
                    "reactionId": "R06057",
                    "reactionName": "beta-D-galactopyranosyl-(1->3)-N-acetyl-D-hexosamine:phosphate galactosyltransferase; Lacto-N-biose + Orthophosphate <=> alpha-D-Galactose 1-phosphate + N-Acetyl-D-glucosamine R06057",
                    "lowerBound": -100,
                    "upperBound": 100,
                    "objectiveCoefficient": 0,
                    "exchangeReaction": false,
                    "metabolites": {
                        "m_0": {
                            "metaboliteId": "C00446",
                            "stoichiometry": -1
                        },
                        "m_1": {
                            "metaboliteId": "C00009",
                            "stoichiometry": 1
                        }
                    }
                },
                {
                    "reactionId": "R06044",
                    "reactionName": "trehalose 6-phosphate:phosphate beta-D-glucosyltransferase; Trehalose 6-phosphate + Orthophosphate <=> D-Glucose 6-phosphate + beta-D-Glucose 1-phosphate R06044",
                    "lowerBound": -100,
                    "upperBound": 100,
                    "objectiveCoefficient": 1,
                    "exchangeReaction": false,
                    "metabolites": {
                        "m_0": {
                            "metaboliteId": "C00009",
                            "stoichiometry": -1
                        },
                        "m_1": {
                            "metaboliteId": "C00092",
                            "stoichiometry": 1
                        }
                    }
                },
                {
                    "reactionId": "U00003",
                    "reactionName": "exchange1 U00003",
                    "lowerBound": -100,
                    "upperBound": 100,
                    "objectiveCoefficient": 0,
                    "exchangeReaction": true,
                    "metabolites": {
                        "m_0": {
                            "metaboliteId": "C00103",
                            "stoichiometry": -1
                        },
                        "m_1": {
                            "metaboliteId": "C00103",
                            "stoichiometry": null
                        }
                    }
                },
                {
                    "reactionId": "U00004",
                    "reactionName": "exchange2 U00004",
                    "lowerBound": -100,
                    "upperBound": 100,
                    "objectiveCoefficient": 0,
                    "exchangeReaction": true,
                    "metabolites": {
                        "m_0": {
                            "metaboliteId": "C00092",
                            "stoichiometry": 1
                        },
                        "m_1": {
                            "metaboliteId": "C00092",
                            "stoichiometry": 1
                        }
                    }
                }


    )
    reaction_array.metabolites.push(
        {
            "metaboliteId": "C00103",
            "metaboliteName": "D-Glucose 1-phosphate; alpha-D-Glucose 1-phosphate; Cori ester; D-Glucose alpha-1-phosphate C00103",
            "compartment": "external"
        },
        {
            "metaboliteId": "C00446",
            "metaboliteName": "alpha-D-Galactose 1-phosphate; alpha-D-Galactopyranose 1-phosphate C00446",
            "compartment": "cytosol"
        },
        {
            "metaboliteId": "C00009",
            "metaboliteName": "Orthophosphate; Phosphate; Phosphoric acid; Orthophosphoric acid C00009",
            "compartment": "cytosol"
        },
        {
            "metaboliteId": "C00092",
            "metaboliteName": "D-Glucose 6-phosphate; Glucose 6-phosphate; Robison ester C00092",
            "compartment": "external"
        }
    )


   // getfbaflux(reaction_test);

    console.log("DUMMY DATA");
    console.log(JSON.stringify(reaction_array));

    console.log("Real DATA");
    console.log(JSON.stringify(data));

    console.log("AFTER CREATION")
    console.log(generalState);

    for(var key in generalState.fbaSolution){
        if(generalState.fbaSolution.hasOwnProperty(key)){
            console.log(key);
            var fluz = generalState.fbaSolution[key].fbaSolution;
            console.log(fluz);
        }
    }
    console.log(generalState.fbaSolution)
    //console.log(getfbaflux(reaction_array));
    //console.log(getfbaflux(data));
    //var result = getfbaflux(reaction_array);
    //dispatch({type: "SETFBAANDFLUX", payload: result})
    //console.log(generalState);





    return (
        <div onClick={()=> getfbaflux(data)}>ADD FLUX</div>
        // <Button onClick={()=> getfbaflux(data)}>ADD FLUX</Button>

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
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {Box, Checkbox, FormControlLabel, Slider} from "@material-ui/core";
import {Typography} from "@material-ui/core";
import {Button} from "@material-ui/core";
import {Stack} from "react-bootstrap";


import "./slider.css"
import {handleSubmit} from "../../../../../Creator/keggReaction/substrate and products/SubmitHandler";
import {reaction} from "mobx";

const handleSubmitKnockout = (nodeId, generalState, dispatch) =>{
    //console.log(generalState.new_data_gen.nodes);
    var node = "";
    generalState.new_data_gen.nodes.forEach(reaction => {
        if (nodeId == reaction.id.slice(reaction.id.length - 6)) {
            node = reaction.id;
            console.log(node);
        }
    });
    generalState.new_data_gen.links.forEach(reaction1 => {

        if(reaction1.source == node || reaction1.target == node){

            reaction1.color = "black";
            reaction1.strokeWidth = 4.5;
        }
    });

    console.log(generalState);

    //dispatch({type: "SETSHOWKNOCKOUT", payload: true})
}

const GetFluxID = (nodeId) => {
    const graphState = useSelector(state => state.graph)
    const generalState = useSelector(state => state.general)
    const dispatch = useDispatch()
    var name = "";
    var flux = 0;
    var minflux = 0;
    var maxflux = 0;
    var valuetext = "Flux Info"
    var defaultChecked = false;
    generalState.reactionsInSelectArray.forEach(reaction => {
        name = nodeId.node;
        if (name == reaction.reactionId) {
            var stateOfgraph = generalState.fbaSolution[name];
            flux = generalState.fbaSolution[name].fbaSolution;
            minflux = generalState.fbaSolution[name].minFlux;
            maxflux = generalState.fbaSolution[name].maxFlux;
            if (generalState.exchangeReaction.length > 0) {

                generalState.exchangeReaction.forEach(rea => {
                    if (rea.reactionId == name) {
                        defaultChecked = Boolean(rea.exchangeInfo);
                    } else {
                        defaultChecked = false;
                    }
                })

            } else {
                defaultChecked = false;
            }

        } else {

        }
    });

    var m = "MinFlux " + minflux;
    var n = "MaxFlux " + maxflux;
    var l = "Min and Max Flux " + minflux;
    const marks = [];
    if (minflux == maxflux) {
        marks.push(
            {
                value: minflux,
                label: l,

            }
        );
    } else {
        marks.push({
                value: minflux,
                label: m,
            },
            {
                value: maxflux,
                label: n
            });


    }


    const handleSubmitMaximize = () => {

    }

    const handleSubmitReset = () => {

    }
    const handleSubmitMinimize = () => {

    }

    return (
        <div>
            <div className={"custom_box"}>
                <br/>

                Flux: {flux}

                <br/>

                MinFlux: {minflux}

                <br/>

                MaxFlux : {maxflux}
                <br/>


            </div>

            <div className={"slider_custom"}>
                <FormControlLabel control={<Checkbox checked={defaultChecked}/>} label="Exchange Reaction"/>

                <Typography id="track-inverted-slider" gutterBottom>
                    Flux information
                </Typography>
                <Slider
                    track="inverted"
                    defaultValue={flux}
                    aria-label="Custom marks"
                    valueLabelDisplay="on"
                    min={minflux}
                    max={maxflux}
                    marks={marks}
                    color="secondary"
                />
            </div>
            <div className={"button_custom"}>
                <Stack direction="horizontal" gap={4}>
                    <Button variant="contained" onClick={handleSubmitKnockout(name, generalState, dispatch)}>Knockout</Button>
                    <Button variant="contained" onClick={handleSubmitReset}>Reset</Button>
                    <Button variant="contained" onClick={handleSubmitMinimize}>Minimize</Button>
                    <Button variant="contained" onClick={handleSubmitMaximize}>Maximize</Button>
                </Stack>
            </div>


        </div>
    )
}

export default GetFluxID
import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Box, Checkbox, FormControlLabel} from "@material-ui/core";
import Slider from '@mui/material/Slider';
import {Typography} from "@material-ui/core";
import { styled } from '@mui/material/styles';
import {Button} from "@material-ui/core";
import {Stack} from "react-bootstrap";
import MuiInput from '@mui/material/Input';
import "./slider.css"
import {handleSubmit} from "../../../../../Creator/keggReaction/substrate and products/SubmitHandler";
import {reaction} from "mobx";
import {ToggleButton, ToggleButtonGroup} from "@material-ui/lab";
import {makeStyles} from "@material-ui/core/styles";

import { ThemeProvider, createMuiTheme } from "@material-ui/styles";


const Input = styled(MuiInput)`
  width: 60px;
  border: #941680;
  margin: 4px;
`;

const useStyles = makeStyles((theme) => ({
    buttonToggle: {
        color: 'black',

    },
    toggleGroup: {
        color: 'lightgrey',
    }
}));

const SliderRanger = styled(Slider)(({theme}) =>({
    '& .MuiSlider-mark': {
        backgroundColor: '#bfbfbf',
        height: 8,
        width: 1,
        '&.MuiSlider-markActive': {
            opacity: 1,
            backgroundColor: 'black',
        },
    },
}))

const minDistance = 5;
const GetFluxID = (nodeId) => {
    //const graphState = useSelector(state => state.graph)
    const generalState = useSelector(state => state.general)
    const fbaState = useSelector(state => state.fba)
    const dispatch = useDispatch()
    const classes = useStyles()
    var name = "";
    var fluxValue = 0;
    var minflux = 0;
    var maxflux = 0;
    var valuetext = "Flux Info"
    var defaultChecked = false;

    generalState.reactionsInSelectArray.forEach(reaction => {
        name = nodeId.node;
        if (name == reaction.reactionId) {
            var stateOfgraph = generalState.fbaSolution[name];
            fluxValue = generalState.fbaSolution[name].fbaSolution;
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


    const [flux, setFlux] = React.useState([minflux, maxflux]);
    console.log("Change happening" + flux);

    const handleChange = (event, newValue, activeThumb) =>{
        if (!Array.isArray(newValue)) {
            return;
        }

        console.log(activeThumb)
        if (activeThumb === 0) {
            setFlux([Math.min(newValue[0], flux[1] - minDistance), flux[1]]);
        } else {
            setFlux([flux[0], Math.max(newValue[1], flux[0] + minDistance)]);
        }
    };


    //Textfield Functions

    const handleInputChange = (event) => {
        setFlux([
            event.target.value === "" ? "" : Number(event.target.value),
            flux[1]
        ]);
    };
    const handleBlur = () => {
        if (flux[0] < -1000) {
            setFlux([-1000, flux[1]]);
        } else if (flux[0] > flux[1]) {
            setFlux([flux[1], flux[1]]);
        }
    };

    const handleInputChange1 = (event) => {
        setFlux([
            flux[0],
            event.target.value === "" ? "" : Number(event.target.value)
        ]);
    };
    const handleBlur1 = () => {
        if (flux[1] < 0) {
            setFlux([flux[0], flux[0]]);
        } else if (flux[1] > 1000) {
            setFlux([flux[0], 1000]);
        }
    };

    const marks = [
        {
            value : fluxValue,
            label : "Current Flux " + fluxValue,
        }
    ];

    const [minValuetoggle, setMinValuetoggle] = React.useState(false);

    const [maxValuetoggle, setMaxValuetoggle] = React.useState(false);


    //Button Configurations
    const handleSubmitKnockout = (nodeId, generalState, fbaState, dispatch) =>{

        var node = "";
        generalState.new_data_gen.nodes.forEach(reaction => {
            if (nodeId == reaction.id.slice(reaction.id.length - 6)) {
                node = reaction.id;
                console.log(node);
            }
        });
        generalState.new_data_gen.links.forEach(reaction1 => {

            if(reaction1.source == node || reaction1.target == node){

                reaction1.color = "grey";
                reaction1.strokeWidth = 1;
            }
        });

        //console.log(fbaState);
        console.log("Clicked the button KnockOut")

        //dispatch({type: "SETSHOWKNOCKOUT", payload: true})
    }

    const handleSubmitReset = (nodeId, generalState, fbaState) => {
        console.log("Clicked the button Reset")
        var node = ""
        generalState.new_data_gen.nodes.forEach(reaction => {
            if (nodeId == reaction.id.slice(reaction.id.length - 6)) {
                node = reaction.id;
                console.log(node);
            }
        });
        generalState.new_data_gen.links.forEach(reaction1 => {

            if(reaction1.source == node || reaction1.target == node){
                fbaState.new_data_backup.links.forEach(reaction =>{
                    if(reaction.source == node || reaction.target){
                        reaction1.color = reaction.color;
                        reaction1.strokeWidth = reaction.strokeWidth;

                    }
                })


            }
        });


        //console.log(fbaState.new_data_backup);
    }

    const newObjectiveCoeffecient = [];

    const handleSubmitMinimize = (nodeId, selected) => {
        //console.log("Clicked the button Minimize")
        setMinValuetoggle(selected)
        //console.log(nodeId)
        const found = fbaState.objectiveCoeffecientUpdated.some(el => el.reactionId === nodeId);

        if(!found){
            if(selected == true){
                newObjectiveCoeffecient.push({
                    'reactionId' : nodeId,
                    'objectiveCoefficient' : -1
                });
            }
            else{
                newObjectiveCoeffecient.push({
                    'reactionId' : nodeId,
                    'objectiveCoefficient' : 0
                });
            }
            dispatch({type: "SETOBJECTIVECOEFFECIENTUPDATE", payload: newObjectiveCoeffecient})
        }
        else{
            fbaState.objectiveCoeffecientUpdated.forEach(reaction =>{
                if(selected == true) {
                    if (reaction.reactionId == nodeId) {
                        reaction.objectiveCoefficient = -1;
                    }
                }
                else{
                    if(reaction.reactionId == nodeId){
                        reaction.objectiveCoefficient = 0;
                    }
                }

            });
        }

       // console.log(fbaState.objectiveCoeffecientUpdated);
    }

    const handleSubmitMaximize = (nodeId, selected) => {
        //console.log("Clicked the button Maximize")
        setMaxValuetoggle(selected)
        const found = fbaState.objectiveCoeffecientUpdated.some(el => el.reactionId === nodeId);

        if(!found){
            if(selected == true){
                newObjectiveCoeffecient.push({
                    'reactionId' : nodeId,
                    'objectiveCoefficient' : 1
                });
            }
            else{
                newObjectiveCoeffecient.push({
                    'reactionId' : nodeId,
                    'objectiveCoefficient' : 0
                });
            }
            dispatch({type: "SETOBJECTIVECOEFFECIENTUPDATE", payload: newObjectiveCoeffecient})
        }
        else{
            fbaState.objectiveCoeffecientUpdated.forEach(reaction =>{
                if(selected == true) {
                    if (reaction.reactionId == nodeId) {
                        reaction.objectiveCoefficient = 1;
                    }
                }
                else{
                    if(reaction.reactionId == nodeId){
                        reaction.objectiveCoefficient = 0;
                    }
                }

            });
        }
        //console.log(fbaState.objectiveCoeffecientUpdated);
    }






    return (
        <div>
            <div className={"slider_custom"}>
                <FormControlLabel control={<Checkbox checked={defaultChecked}/>} label="Exchange Reaction"/>

                <Typography id="track-inverted-slider" gutterBottom>
                    Flux information
                </Typography>
                <SliderRanger
                    value={flux}
                    onChange={handleChange}
                    aria-labelledby="input-slider"
                    valueLabelDisplay="on"
                    min={-1000}
                    max={1000}
                    marks={marks}
                />
                <Stack direction={"horizontal"} gap={14}>
                    <Typography id="track-inverted-slider" gutterBottom>Lower Bound :
                    </Typography>
                    <Input
                        aria-label={"Minimum"}
                        value={flux[0]}
                        size="large"
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        inputProps={{
                            step: 10,
                            min: -1100,
                            max: 1000,
                            type: "number",
                            "aria-labelledby": "input-slider"
                        }}
                    />

                    <Typography id="track-inverted-slider" gutterBottom>UpperBound :
                    </Typography>

                    <Input
                        value={flux[1]}
                        //size="small"
                        onChange={handleInputChange1}
                        onBlur={handleBlur1}
                        inputProps={{
                            step: 10,
                            min: 0,
                            max: 1000,
                            type: "number",
                            "aria-labelledby": "input-slider"
                        }}
                    />
                </Stack>




            </div>
            <br/>

            <div className={"button_custom"}>
                <Stack direction="horizontal" gap={4}>
                    <Button variant="contained" onClick={() => handleSubmitKnockout(name, generalState, fbaState, dispatch)}>Knockout</Button>
                    <Button variant="contained" onClick={() => handleSubmitReset(name, generalState, fbaState)}>Reset</Button>
                    <ToggleButton
                        value="min"
                        selected={minValuetoggle}
                        onChange={() =>
                            handleSubmitMinimize(name, !minValuetoggle)
                        }
                    >
                        Minimize
                    </ToggleButton>

                    <ToggleButton
                        value="max"
                        selected={maxValuetoggle}
                        color = 'primary'
                        onChange={() =>
                            handleSubmitMaximize(name, !maxValuetoggle)
                        }
                        >
                        Maximize
                        </ToggleButton>

                </Stack>
            </div>


        </div>
    )
}

export default GetFluxID
import React from 'react';
import "./circular.css"
import {Box, Button, Container} from "@mui/material";
import Circle from "./Circle";
import ExternalGraph from "./ExternalGraph";
import DeleteNode from "./DeleteNode";

function ExternalSpecies(){
    const [value, setValue] = React.useState(0);
    var buttonClick = 0

    const handleButtonClick = () => {
        buttonClick = buttonClick + 1;
        console.log("Button clicked");
        var box1 = document.getElementById("box1");
        var box2 = document.getElementById("box2");
        var box3 = document.getElementById("box3");
        var box4 = document.getElementById("box4");
        var box5 = document.getElementById("box5");
        var box6 = document.getElementById("box6");
        var box7 = document.getElementById("box7");
        if(buttonClick ==1){
            box7.style.display = "block";
        }
        else if(buttonClick ==2){
            box4.style.display = "block";
        }
        else if(buttonClick ==3){
            box6.style.display = "block";
        }
        else if(buttonClick ==4){
            box3.style.display = "block";
        }
        else if(buttonClick ==5){
            box5.style.display = "block";
        }
        else if(buttonClick ==6){
            box2.style.display = "block";
        }
        else if(buttonClick ==7){
            box1.style.display = "block";
        }




    };
  return (
    <div>
        <div className="main">
            <DeleteNode/>
            <ExternalGraph/>
        </div>
    </div>

  );

};
export default ExternalSpecies;


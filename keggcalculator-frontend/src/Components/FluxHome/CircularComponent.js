import React from 'react';
import "./circular.css"
import {Box, Button, Container} from "@mui/material";
import Circle from "./Circle";

const CircularComponent = () => {
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
        <div className="container_circular">
            <Box
                sx={{
                    width: 600,
                    height: 600,
                    backgroundColor: 'transparent',
                    border: '1px solid #000',
                    position: 'relative',
                    padding: '5px',
                }}
            >
                <div className="center_div" id="div_center">

                </div>

                <div className="circle">
                    <div className= 'circle_box' id="box1" style={{display:"none"}}>
                    </div>
                    <div className= 'circle_box' id="box2" style={{display:"none"}}>
                    </div>
                    <div className= 'circle_box' id="box3" style={{display:"none"}}>
                    </div>
                    <div className= 'circle_box' id="box4" style={{display:"none"}}>
                    </div>
                    <div className= 'circle_box' id="box5" style={{display:"none"}}>
                    </div>
                    <div className= 'circle_box' id="box6" style={{display:"none"}}>
                    </div>
                    <div className= 'circle_box' id="box7" style={{display:"none"}}>
                    </div>

                </div>




                <div className="button_add">
                    <Button onClick={handleButtonClick}>Add</Button>
                </div>
                <div className="text_content">
                    <h5>External species</h5>
                </div>


            </Box>
        </div>

    </div>
  );
};
export default CircularComponent;


import React from "react";
import {Card} from "react-bootstrap";

export const handleClick = (flux, st, name) =>{
    var fluxrate = "FluxRate " + flux
    var minflux = st.minFlux;
    var maxflux = st.maxFlux;


    return(
        <div>
            <Card style={{ width: '18rem' }}>
                <Card.Img variant="top" src="holder.js/100px180" />
                <Card.Body>
                    <Card.Title>You clicked on the Reaction {name}</Card.Title>
                    <Card.Text>
                        Flux Rate of the reaction is {fluxrate}
                        <br/>
                        Minimum fluxrate : {minflux}
                        <br/>
                        Maximum Fluxrate : {maxflux}
                    </Card.Text>

                </Card.Body>
            </Card>
        </div>
    );
}
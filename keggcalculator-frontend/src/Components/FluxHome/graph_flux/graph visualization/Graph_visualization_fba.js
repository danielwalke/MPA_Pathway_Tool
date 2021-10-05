import React from "react";
import {Graph} from "react-d3-graph";
import {useSelector} from "react-redux";
import {Card, Table} from "react-bootstrap";


const Graph_visualization_fba = () =>{

    const graphState = useSelector(state => state.graph)
    const generalState = useSelector(state => state.general)
    const myConfig = {
        height: 0.75*window.innerHeight,
        width:  0.95*window.innerWidth,
        nodeHighlightBehavior: true,

        directed: true,
        node: {
            size: graphState.nodeSize,

            highlightStrokeColor: "yellow",

        },
        link: {

            //color: "red",
            //strokeWidth:1, //this will change accordingly to flux rate
            linkStrength: 5,
            renderLabel: true,



        },
        d3: {
            gravity: -80,
            linkStrength: 5.0,
            disableLinkForce: graphState.isForceDisabled
        }
    };
    if (generalState.new_data_gen.nodes.length > 0) {
        return (
            <div>
                <div>
                    <Graph
                        bottom={0}
                        id="graph"
                        data={generalState.new_data_gen}
                        config={myConfig}
                    />
                </div>
                <div>

                    <Card border="dark" style={{ width: '18rem' }}>
                        <Card.Header>Color Information</Card.Header>
                        <Card.Body>
                            <Card.Title>Flux and Informations</Card.Title>
                            <Card.Text>

                                <Table>
                                    <thead>
                                    <tr>
                                        <th>FluxRate</th>
                                        <th>Color</th>
                                        <th>Stroke Width</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td>Flux 0-100</td>
                                        <td>Red</td>
                                        <td>@mdo</td>
                                    </tr>
                                    <tr>
                                        <td>Flux 100-200</td>
                                        <td>Yellow</td>
                                        <td>@fat</td>
                                    </tr>
                                    <tr>
                                        <td>Flux 200-500</td>
                                        <td>Green</td>
                                        <td>@twitter</td>
                                    </tr>
                                    <tr>
                                        <td>Flux 500-700</td>
                                        <td>Blue</td>
                                        <td>@twitter</td>
                                    </tr>
                                    <tr>
                                        <td>Flux 700-100</td>
                                        <td>Purple</td>
                                        <td>@twitter</td>
                                    </tr>
                                    <tr>
                                        <td>Flux -0</td>
                                        <td>Black</td>
                                        <td>@twitter</td>
                                    </tr>
                                    </tbody>
                                </Table>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                    <br />
                </div>

            </div>


        )
    }
    else {
        return (
            <div><p>problemo</p></div>
        )
    }
}

export default Graph_visualization_fba
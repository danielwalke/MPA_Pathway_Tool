import React from "react";
import {Paper} from "@material-ui/core";
import {Table} from "react-bootstrap";
import "./infostyle.css"
import {Box} from "@mui/material";
const Information = () =>{

    return(
        <div className={"custom_box"}>
            <Paper variant="outlined" elevation={3}>
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
                        <td>Flux 0</td>
                        <td><div className={"custom_boxes"} style={{background: 'grey'}}></div></td>
                        <td>1</td>
                    </tr>
                    <tr>
                        <td>Flux 1-100</td>
                        <td><div className={"custom_boxes"} style={{background: 'red'}}></div></td>
                        <td>1.5</td>
                    </tr>
                    <tr>
                        <td>Flux 101-200</td>
                        <td><div className={"custom_boxes"} style={{background: "gold"}}></div></td>
                        <td>2.0</td>
                    </tr>
                    <tr>
                        <td>Flux 201-500</td>
                        <td><div className={"custom_boxes"} style={{background: 'green'}}></div></td>
                        <td>2.5</td>
                    </tr>
                    <tr>
                        <td>Flux 501-1000</td>
                        <td><div className={"custom_boxes"} style={{background: 'purple'}}></div></td>
                        <td>3.0</td>
                    </tr>
                    <tr>
                        <td>Flux 0 - -100</td>
                        <td><div className={"custom_boxes"} style={{background: 'orange'}}></div></td>
                        <td>3.5</td>
                    </tr>
                    <tr>
                        <td>Flux -100 - -200</td>
                        <td><div className={"custom_boxes"} style={{background: 'black'}}></div></td>
                        <td>4.0</td>
                    </tr>
                    <tr>
                        <td>Flux -201 - -500</td>
                        <td><div className={"custom_boxes"} style={{background: 'cyan'}}></div></td>
                        <td>4.5</td>
                    </tr>
                    <tr>
                        <td>Flux -500 - -1000</td>
                        <td><div className={"custom_boxes"} style={{background: 'blue'}}></div></td>
                        <td>5</td>
                    </tr>
                    </tbody>
                </Table>
            </Paper>
        </div>
    )
}
export default Information
import React from "react";
import {Paper} from "@material-ui/core";
import {Table} from "react-bootstrap";

const Information = () =>{

    return(
        <div>
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
                        <td>Flux 0-100</td>
                        <td>Red</td>
                        <td>1</td>
                    </tr>
                    <tr>
                        <td>Flux 100-200</td>
                        <td>Yellow</td>
                        <td>2</td>
                    </tr>
                    <tr>
                        <td>Flux 200-500</td>
                        <td>Green</td>
                        <td>2.5</td>
                    </tr>
                    <tr>
                        <td>Flux 500-700</td>
                        <td>Blue</td>
                        <td>3.5</td>
                    </tr>
                    <tr>
                        <td>Flux 700-100</td>
                        <td>Purple</td>
                        <td>4.0</td>
                    </tr>
                    <tr>
                        <td>Flux &lt;0</td>
                        <td>Black</td>
                        <td>4.5</td>
                    </tr>
                    </tbody>
                </Table>
            </Paper>
        </div>
    )
}
export default Information
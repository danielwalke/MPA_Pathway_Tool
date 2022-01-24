import React from "react";
import {TableCell, TableRow} from "@material-ui/core";
import {annotationIndicator} from "../../Creator/upload/annotationModal/AnnotationIndicator";


export default function ResultTableRow(props) {

    return(
        <React.Fragment>
            <TableRow
                // onClick={() => {
                //     props.handleRowClick(props.index, props.row.index)
                // }}
                // sx={{'& > *': {borderBottom: 'unset'}}}
                // hover
                // selected={props.selectedRow === props.index}
                >
                <TableCell style={{'borderRight': '1px solid rgba(224, 224, 224, 1)'}}>
                    {props.row.reactionId}
                </TableCell>
                <TableCell style={{'borderRight': '2px solid rgba(224, 224, 224, 1)'}}>
                    {props.row.reactionAbbreviation}
                </TableCell>
                <TableCell align={'right'} style={{'borderRight': '1px solid rgba(224, 224, 224, 1)'}}>
                    {props.row.fbaFlux.toFixed(2)}
                </TableCell>
                <TableCell align={'right'} style={{'borderRight': '2px solid rgba(224, 224, 224, 1)'}}>
                    {props.row.fbaFluxSmoment !== null ? props.row.fbaFluxSmoment.toFixed(2) : "-"}
                </TableCell>
                <TableCell align={'right'} style={{'borderRight': '1px solid rgba(224, 224, 224, 1)'}}>
                    {props.row.fvaMin.toFixed(2)}
                </TableCell>
                <TableCell align={'right'} style={{'borderRight': '2px solid rgba(224, 224, 224, 1)'}}>
                    {props.row.fvaMinSmoment !== null ? props.row.fvaMinSmoment.toFixed(2) : "-"}
                </TableCell>
                <TableCell align={'right'} style={{'borderRight': '1px solid rgba(224, 224, 224, 1)'}}>
                    {props.row.fvaMax.toFixed(2)}
                </TableCell>
                <TableCell align={'right'} >
                    {props.row.fvaMaxSmoment !== null ? props.row.fvaMaxSmoment.toFixed(2) : "-"}
                </TableCell>
            </TableRow>
        </React.Fragment>
    )
}

import React from 'react';
import ReactDropZone from "react-dropzone";
import Button from "@material-ui/core/Button";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";

const DropZone = (props) => {

    const {uploadPathway, files} = props

    return (
        <div>
            <ReactDropZone onDrop={files => uploadPathway(files)}
                           accept={"application/vnd.ms-excel,application/json,text/xml,text/comma-separated-values,text/plain"}>
                {({getRootProps, getInputProps, isDragActive, isDragReject, isDragAccept}) => (
                    <div {...getRootProps({className: "dropZone"})}>
                        <input {...getInputProps()} accept={".CSV,.JSON,.XML,.TXT"}/>
                        {isDragReject && "Unsupported file format"}
                        {isDragAccept && "Drop here...."}
                        {!isDragActive &&
                        <Button variant={"contained"} color={"primary"}>Upload</Button>}
                    </div>
                )}
            </ReactDropZone>
            <Accordion style={{padding: "5px", margin: "10px 0 0 0"}}>
                <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                    <Typography variant={"h6"}
                                style={{flexBasis: "33.33%"}}>{"pathway file"}</Typography>
                    <Typography variant={"h6"} style={{
                        flexBasis: "33.33%",
                        color: "#bdbdbd"
                    }}>{files.length>0 && files[0].size}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <List style={{width: "100%"}}>
                        {
                            files.map((uploadedFile, index) => {
                                return (
                                    <ListItem key={uploadedFile.name + "_" + index}>
                                        <ListItemAvatar>
                                            <Avatar>
                                                <AttachFileIcon/>
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={<Typography
                                                variant={"subtitle2"}>{uploadedFile.name + "_" + index}</Typography>}
                                        />
                                        <ListItemSecondaryAction>
                                            <IconButton value={index} edge={"end"}
                                                        onClick={() => files.splice(index, 1)}
                                            >
                                                <DeleteIcon/>
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                );
                            })
                        }
                    </List>
                </AccordionDetails>
            </Accordion>
        </div>
    );
};

export default DropZone;

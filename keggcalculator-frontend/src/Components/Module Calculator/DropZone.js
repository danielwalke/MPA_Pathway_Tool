import React, {Component} from "react";
import ReactDropZone from "react-dropzone";
import {inject, observer} from "mobx-react";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import AttachFileIcon from '@material-ui/icons/AttachFile';
import DeleteIcon from '@material-ui/icons/Delete';
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';


const customStyle = {
    dropZone: {
        flex: "1", display: "flex", flexDirection: "column", height: "140px",
        alignItems: "center", borderWidth: "2px",
        borderRadius: "2px", borderColor: "#eeeeee", borderStyle: "dashed",
        backgroundColor: "#fafafa", color: "#bdbdbd", outline: "none",
        transition: "border .24s ease-in-out",
        padding: "2%",
        justifyContent: "center"
    }
}

class DropZone extends Component {

    // eslint-disable-next-line no-useless-constructor
    constructor(props) {
        super(props);
        this.convertFileSize = this.convertFileSize.bind(this)
        console.log(this.props.uploadFileButton)
    }

    uploadedFiles(collection) {
        if (collection.length !== 0) {
            if (this.props.fileType === "MPAFile") {
                this.props.CalculatorStore.setUploadedFiles("MPAFile", new Array(collection[0]))
            } else {
                collection.map(file => this.props.CalculatorStore.setUploadedFiles("moduleFiles", file))
            }
        }
    }

    convertFileSize(size) {
        if (size >= 1048576) {
            return (size / 1048576).toFixed(2) + " MB";
        } else if (size >= 1024) {
            return (size / 1024).toFixed(2) + " KB";
        }
    }

    render() {
        let file = this.props.fileType === "MPAFile" ? this.props.CalculatorStore.getMPAFile : this.props.CalculatorStore.getModuleFiles;
        return (
            <div>
                <ReactDropZone onDrop={files => this.uploadedFiles(files)}
                               accept={"application/vnd.ms-excel,application/json,text/xml,text/comma-separated-values,text/plain"}>
                    {({getRootProps, getInputProps, isDragActive, isDragReject, isDragAccept}) => (
                        <div {...getRootProps({style: customStyle.dropZone})}>
                            <input {...getInputProps()} accept={".CSV,.JSON,.XML,.TXT"}/>
                            {!isDragActive && <div style={{padding: "10px"}}>{this.props.message}</div>}
                            {isDragReject && "Unsupported file format"}
                            {isDragAccept && "Drop here...."}
                            {!isDragActive &&
                            <Button variant={"contained"} color={"primary"}>{this.props.uploadFileButton}</Button>}
                        </div>
                    )}
                </ReactDropZone>
                <Accordion style={{padding: "5px", margin: "10px 0 0 0"}}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                        <Typography variant={"h6"}
                                    style={{flexBasis: "33.33%"}}>{this.props.fileType === "MPAFile" ? "experimental data" : "pathway files"}</Typography>
                        <Typography variant={"h6"} style={{
                            flexBasis: "33.33%",
                            color: "#bdbdbd"
                        }}>{this.props.CalculatorStore.getSize(this.props.fileType)}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <List style={{width: "100%"}}>
                            {
                                file.map((uploadedFile, index) => {
                                    // console.log(uploadedFile)
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
                                                secondary={this.convertFileSize(Number(uploadedFile.size))}
                                            />
                                            <ListItemSecondaryAction>
                                                <IconButton value={index} edge={"end"}
                                                            onClick={event => this.props.CalculatorStore.removeFiles(this.props.fileType, event.currentTarget.value)}
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
    }
}

export default inject('CalculatorStore')(observer(DropZone))

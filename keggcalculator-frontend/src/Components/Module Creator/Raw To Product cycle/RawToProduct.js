import React, {Component} from "react";
import "./RawToProduct.css"
import circle from "../SVG Elements/circle.svg";
import rightArrow from "../SVG Elements/right arrow.svg";
import diamond from "../SVG Elements/diamond.svg";
import leftArrow from "../SVG Elements/left arrow.svg";
import rightElbowArrow from "../SVG Elements/right elbow arrow.svg";
import rightElbowArrowReverse from "../SVG Elements/right elbow arrow reverse.svg";
import leftElbowArrow from "../SVG Elements/left elbow arrow.svg";
import leftElbowArrowReverse from "../SVG Elements/left elbow arrow reverse.svg";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Autocomplete_forResponse from "../AutoComplete/Autocomplete_forResponse";
import Chip from "@material-ui/core/Chip";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Tooltip from "@material-ui/core/Tooltip";
import Popover from "@material-ui/core/Popover";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import UpdateIcon from '@material-ui/icons/Update';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import ListItemIcon from "@material-ui/core/ListItemIcon";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";


class RawToProduct extends Component {

    // eslint-disable-next-line no-useless-constructor
    constructor(props) {
        super(props);
        this.state = {
            showDialog: true,
            anchorElement: null
        }
        this.changeState = this.changeState.bind(this)
        this.rawToProduct = this.rawToProduct.bind(this)
    }

    changeState(stateField, value) {
        this.setState({[stateField]: value})
    };

    rawToProduct() {
        return (
            <div className={"raw-to-product"}>
                {/*for first circle*/}
                <div className={"relativePosition"}>
                    {(((!(this.props.reactionNumber % 2) || this.props.reactionNumber === 0) && this.props.reactionEntity.rawEntity !== "")
                        ||
                        ((this.props.reactionNumber % 2) && this.props.reactionEntity.productEntity !== "")
                    )
                        ?
                        <Tooltip
                            title={((!(this.props.reactionNumber % 2) || this.props.reactionNumber === 0) && this.props.reactionEntity.rawEntity !== "")
                                ?
                                `${this.props.reactionEntity.rawEntity.compoundName} (${this.props.reactionEntity.rawEntity.compoundId})`
                                :
                                `${this.props.reactionEntity.productEntity.compoundName} (${this.props.reactionEntity.productEntity.compoundId})`
                            }>
                            <Chip color={"primary"}
                                  className={((this.props.reactionNumber % 2) || this.props.reactionNumber === 0) ? "floatingDivCompoundForNormal cursor" : "floatingDivCompoundForBig cursor"}
                                  label={((!(this.props.reactionNumber % 2) || this.props.reactionNumber === 0) && this.props.reactionEntity.rawEntity !== "")
                                      ?
                                      `${this.props.reactionEntity.rawEntity.compoundId}`
                                      :
                                      `$${this.props.reactionEntity.productEntity.compoundId}`
                                  }
                            />
                        </Tooltip>
                        :
                        ""
                    }
                    <img
                        src={((this.props.reactionNumber % 2) || this.props.reactionNumber === 0) ? circle : (this.props.reactionEntity.reversible ? rightElbowArrowReverse : rightElbowArrow)}
                        className={((this.props.reactionNumber % 2) || this.props.reactionNumber === 0) ? "mediumIcons" : "bigIcons"}
                    />
                </div>
                {/*For arrow*/}
                {((!this.props.reactionNumber) || (this.props.reactionNumber % 2)) ?
                    <div className={"relativePosition"}>
                        <img
                            src={!(this.props.reactionNumber % 2) ? (this.props.reactionEntity.reversible ? leftArrow : rightArrow) : leftArrow}
                            className={"mediumIcons"}
                        />
                    </div> : ""}
                {/*For reaction*/}
                <div className={"relativePosition"}>
                    {this.props.reactionEntity.reaction !== "" &&
                    <Tooltip
                        title={`${this.props.reactionEntity.reaction.reactionName} (${this.props.reactionEntity.reaction.reactionId})`}>
                        <Chip color={"primary"} className={"floatingDivReaction cursor"}
                              label={this.props.reactionEntity.reaction.reactionId}/>
                    </Tooltip>}
                    <img src={diamond} className={"mediumIcons"}/>
                </div>
                {/*For arrow*/}
                {!(this.props.reactionNumber % 2) &&
                <div className={"relativePosition"}>
                    <img src={rightArrow} className={"mediumIcons"}/>
                </div>}
                {/*for last circle*/}
                <div className={"relativePosition"}>
                    {((this.props.reactionEntity.productEntity !== "" && !(this.props.reactionNumber % 2)) ||
                        (this.props.reactionEntity.rawEntity !== "" && (this.props.reactionNumber % 2)))
                        ?
                        <Tooltip
                            title={(this.props.reactionEntity.productEntity !== "" && !(this.props.reactionNumber % 2))
                                ?
                                `${this.props.reactionEntity.productEntity.compoundName} (${this.props.reactionEntity.productEntity.compoundId})`
                                :
                                `${this.props.reactionEntity.rawEntity.compoundName} (${this.props.reactionEntity.rawEntity.compoundId})`
                            }>
                            <Chip onClick={() => alert("hey")} color={"primary"}
                                  className={!(this.props.reactionNumber % 2) ? "floatingDivCompoundForNormal cursor" : "floatingDivCompoundForBig cursor"}
                                  label={(this.props.reactionEntity.productEntity !== "" && !(this.props.reactionNumber % 2))
                                      ?
                                      `${this.props.reactionEntity.productEntity.compoundId}`
                                      :
                                      `${this.props.reactionEntity.rawEntity.compoundId}`
                                  }
                            />
                        </Tooltip>
                        :
                        ""
                    }
                    <img
                        src={!(this.props.reactionNumber % 2) ? circle : (this.props.reactionEntity.reversible ? leftElbowArrowReverse : leftElbowArrow)}
                        className={!(this.props.reactionNumber % 2) ? "mediumIcons" : "bigIcons"}/>
                </div>
                {/*For options*/}
                <div className={"relativePosition"}>
                    <IconButton onClick={(e) => this.changeState("anchorElement", e.target)} color={"primary"}>
                        <MoreVertIcon/>
                    </IconButton>
                </div>
                <Popover open={this.state.anchorElement !== null}
                         onClose={() => this.changeState("anchorElement", null)}
                         anchorEl={this.state.anchorElement}
                         anchorOrigin={{
                             vertical: 'bottom',
                             horizontal: 'center',
                         }}
                         transformOrigin={{
                             vertical: 'top',
                             horizontal: 'right',
                         }}
                >
                    <List style={{width: "250px"}}>
                        <ListItem button onClick={(e) => {
                            this.changeState("showDialog", !this.state.showDialog);
                            this.changeState("anchorElement", null)
                        }}>
                            <ListItemIcon>
                                <UpdateIcon color={"primary"}/>
                            </ListItemIcon>
                            <ListItemText primary={"Update Reaction details"}/>
                        </ListItem>
                        <Divider variant={"middle"}/>
                        <ListItem button disabled={this.props.reactionEntity.productEntity === ""} onClick={(e) => {
                            this.props.addReaction(this.props.reactionNumber);
                            this.changeState("anchorElement", null)
                        }}>
                            <ListItemIcon>
                                <AddCircleOutlineIcon color={"primary"}/>
                            </ListItemIcon>
                            <ListItemText primary={"Use the product as substrate (Get reaction from server)"}/>
                        </ListItem>
                        <Divider variant={"middle"}/>
                        <ListItem button disabled={this.props.reactionEntity.productEntity === ""}
                                  onClick={() => alert("under development")}>
                            <ListItemIcon>
                                <AddCircleOutlineIcon color={"primary"}/>
                            </ListItemIcon>
                            <ListItemText primary={"Use the product as substrate (Create your own reaction)"}/>
                        </ListItem>
                    </List>
                </Popover>
            </div>
        )
    };

    render() {
        return (
            <div>
                {this.rawToProduct()}
                {this.state.showDialog && <Dialog open={this.state.showDialog}
                                                  onClose={() => this.changeState("showDialog", !this.state.showDialog)}
                                                  fullWidth maxWidth={"md"}>
                    <DialogTitle style={{alignSelf: "center"}}>Reaction Details </DialogTitle>
                    <DialogContent>
                        <Autocomplete_forResponse compound={true} disabled={false} label={"Substrate"}
                                                  reactionIndex={this.props.reactionNumber}
                                                  loadingText={"Enter at least three characters..."}
                                                  attribute={"rawEntity"} data={this.props.reactionEntity.rawEntity}/>
                        {this.props.reactionEntity.reactionWithProduct !== "" && <div>
                            <Autocomplete_forResponse compound={false} reaction={true} disabled={false}
                                                      label={"Reaction"}
                                                      chosenPair={this.props.reactionEntity.productEntity === "" ? "" : this.props.reactionEntity.productEntity.compoundId}
                                                      reactionIndex={this.props.reactionNumber}
                                                      loadingText={"Fetching..."} attribute={"reaction"}
                                                      data={this.props.reactionEntity.reaction}/>
                            <Autocomplete_forResponse compound={false} reaction={false} disabled={false}
                                                      label={"Product"}
                                                      chosenPair={this.props.reactionEntity.reaction === "" ? "" : this.props.reactionEntity.reaction.reactionId}
                                                      reactionIndex={this.props.reactionNumber}
                                                      loadingText={"Fetching..."} attribute={"productEntity"}
                                                      data={this.props.reactionEntity.productEntity}/>
                        </div>}
                    </DialogContent>
                    <DialogActions>
                        <Button style={{margin: "0 20px 0 0"}}
                                onClick={() => this.changeState("showDialog", !this.state.showDialog)} color={"primary"}
                                variant={"contained"}>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>}
            </div>
        );
    }
}

export default RawToProduct;

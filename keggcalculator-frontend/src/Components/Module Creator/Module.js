import React, {Component} from "react";
import "./Module.css"

import RawToProduct from "./Raw To Product cycle/RawToProduct"
import {inject, observer} from "mobx-react";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import PublishIcon from '@material-ui/icons/Publish';
import {requestGenerator} from "../../Request Generator/RequestGenerator";
import {endpoint_getCompoundList} from "../../App Configurations/RequestURLCollection";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";

class Module extends Component{

    constructor(props) {
        super(props);
        this.moduleRef = React.createRef();
        this.state = {
            moduleCreator: false,
        }
    };

    changeState = (stateName) => {
      this.setState({[stateName]: !this.state[stateName]})
    };

    render() {
        return(
            <div style={{display: "flex", justifyContent: "center", flexDirection: "column"}} ref={this.moduleRef}>
                {!this.state.moduleCreator && <div style={{display: "flex", padding: "10% 20%", justifyContent: "space-evenly"}}>
                    <Card className={"card-module"} onClick={() => this.changeState("moduleCreator")}>
                        <CardMedia style={{display: "flex", alignItems: "center", height: "70%", justifyContent: "center"}}>
                            <AddCircleOutlineIcon style={{fontSize: "50px"}}/>
                        </CardMedia>
                        <CardContent style={{fontSize: "1.5rem"}}>
                            New
                        </CardContent>
                    </Card>
                    <Card className={"card-module"}>
                        <CardMedia style={{display: "flex", alignItems: "center", height: "70%", justifyContent: "center"}}>
                            <PublishIcon style={{fontSize: "50px"}}/>
                        </CardMedia>
                        <CardContent style={{fontSize: "1.5rem"}}>
                            Load
                        </CardContent>
                    </Card>
                </div>}
                {this.state.moduleCreator && this.props.ModuleStore.reactions.map((reaction, index) => {
                    console.log(index);
                    return <RawToProduct key={index} reactionEntity={reaction} reactionNumber={index}
                                         addReaction={(currentIndex) =>  this.props.ModuleStore.addReaction(currentIndex)}
                                         getReactionAndProduct={(reactionIndex, type, searchEntry) => this.props.ModuleStore.getData(reactionIndex, type, searchEntry)}
                    />
                })}
                {this.props.ModuleStore.backdropStatus &&
                    <Backdrop open={this.props.ModuleStore.backdropStatus} style={{zIndex: 1400, background: "rgba(200,200,200,0.75)"}}>
                       Fetching reactions and products for chosen substrate... &nbsp;<CircularProgress/>
                    </Backdrop>
                }
            </div>
        );
    }

}

export default inject("ModuleStore")(observer(Module))
// export default Module;
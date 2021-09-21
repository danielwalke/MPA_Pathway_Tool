import React, {Component} from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import grey from "@material-ui/core/colors/grey";
import {inject, observer} from "mobx-react";
import "./Autocomplete_forResponse.css"
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";

class Autocomplete_forResponse extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: this.props.compound,
            options: this.props.compound ? [] : this.props.ModuleStore.getData(this.props.reactionIndex, this.props.attribute, this.props.data),
            displayText: this.props.loadingText,
            value: this.props.ModuleStore.getValueTag(this.props.reactionIndex, this.props.attribute),
        };
        this.routeFunctionCall = this.routeFunctionCall.bind(this)
        this.checkName = this.checkName.bind(this)
        this.addAttribute = this.addAttribute.bind(this)
        this.getOptionLabel = this.getOptionLabel.bind(this)
    };

    routeFunctionCall(event) {
        if (this.props.compound) {
            this.checkName(event);
        } else {
            //write code here
        }
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!this.props.compound && (prevProps.chosenPair !== this.props.chosenPair)) {
            this.setState({options: this.props.ModuleStore.getData(this.props.reactionIndex, this.props.attribute, "")});
        }
    }


    checkName(e) {
        this.setState({value: (e === null || e.target.value === undefined) ? "" : e.target.value}, () => {
            if (this.state.value !== "" && this.state.value.length >= 3) {
                let filteredData = [];
                this.props.ModuleStore.CompoundList.map(compound => {
                    if (compound.compoundId.toLowerCase().includes(this.state.value.toLowerCase()) || compound.compoundName.toLowerCase().includes(this.state.value.toLowerCase()))
                        filteredData.push(compound)
                });
                this.setState({options: filteredData});
                if (filteredData.length === 0) {
                    this.setState({displayText: "No Compound found"})
                }
            }
            if (this.state.value === "" || this.state.value.length <= 2) {
                this.setState({options: [], displayText: this.props.loadingText});
            }
            // if(this.state.value === "") {
            //     this.addAttribute("");
            // }
        });
    };

    addAttribute(chosenValue) {
        if (chosenValue !== undefined) {
            this.props.ModuleStore.addToReactionStack(this.props.reactionIndex, this.props.attribute, chosenValue);
            if (this.props.compound) {
                this.props.ModuleStore.switchBackdrop(true);
                this.props.ModuleStore.getReactionWithProduct(chosenValue.compoundId).then(response => {
                    if (response.status === 201) {
                        this.props.ModuleStore.addReactionWithProduct(response.data, this.props.reactionIndex);
                        this.props.ModuleStore.switchBackdrop(false);
                    }
                });
            }
        } else {
            if (this.props.attribute !== "rawEntity") {
                this.setState({options: this.props.ModuleStore.getData(this.props.reactionIndex, this.props.attribute, "")})
            }
            this.props.ModuleStore.removeFromReactionStack(this.props.reactionIndex, this.props.attribute);
        }
    };

    getOptionLabel(option) {
        if (this.props.compound || !this.props.reaction) {
            return `${option.compoundName} (${option.compoundId})`
        } else {
            return `${option.reactionName} (${option.reactionId})`
        }
    };

    render() {
        return (
            <div>
                {this.props.data === "" && <Autocomplete
                    disabled={this.props.disabled}
                    options={this.state.options}
                    getOptionLabel={option => this.getOptionLabel(option)}
                    loading={this.state.loading}
                    loadingText={this.state.displayText}
                    onInputChange={(e) => this.routeFunctionCall(e)}
                    // value={this.state.value}
                    onChange={(e, value) => (e.target.value === undefined) ? this.routeFunctionCall(e) : this.addAttribute(value)}
                    renderInput={prop => (
                        <TextField
                            {...prop}
                            label={this.props.label}
                            fullWidth
                            multiline={true}
                            margin={"normal"}
                            variant={"outlined"}
                            InputProps={{
                                ...prop.InputProps,
                                style: {
                                    input: {color: grey}
                                },
                            }}
                        />
                    )}/>}
                {
                    this.props.data !== "" &&
                    <TextField
                        disabled={this.props.reactionIndex !== 0 && this.props.compound}
                        variant={"outlined"} fullWidth
                        color={"primary"} label={this.props.label} margin={"normal"}
                        value={this.props.ModuleStore.getValueTag(this.props.reactionIndex, this.props.attribute)}
                        InputProps={{
                            endAdornment:
                                !(this.props.reactionIndex !== 0 && this.props.compound)
                                    ?
                                    <InputAdornment position={"end"}>
                                        <IconButton onClick={() => this.addAttribute(undefined)}>
                                            <HighlightOffIcon/>
                                        </IconButton>
                                    </InputAdornment>
                                    :
                                    null
                        }}
                    />
                }
            </div>
        )
    }


}

export default (inject("ModuleStore"))(observer(Autocomplete_forResponse));

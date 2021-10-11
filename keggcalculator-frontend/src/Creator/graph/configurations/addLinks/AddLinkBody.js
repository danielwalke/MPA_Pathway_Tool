import React, {useState} from 'react';
import {useStyles} from "../../../ModalStyles/ModalStyles";
import {useDispatch, useSelector} from "react-redux";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import {Checkbox} from "@material-ui/core";

const AddLinkBody = () => {
    const classes = useStyles()
    const graphState = useSelector(state => state.graph)
    const dispatch = useDispatch()

    const [source, setSource] = useState("")
    const [target, setTarget] = useState("")
    const [isReversible, setIsReversible] = useState(false)
    const [isKeyLink, setIsKeyLink] = useState(true)

    const handleAddLink = () => {
        const newLink = {
            source: source,
            target: target,
            opacity: isKeyLink ? 1 : 0.4,
            isReversibleLink: false
        }
        const newLinkReverse = {
            source: target,
            target: source,
            opacity: isKeyLink ? 1 : 0.4,
            isReversibleLink: true
        }
        if (isReversible) {
            graphState.data.links.push(newLink)
            graphState.data.links.push(newLinkReverse)
        } else {
            graphState.data.links.push(newLink)
        }
        dispatch({type: "SETDATA", payload: graphState.data})
    }

    return (
        <div className={classes.paper} style={{width: "60vw", display: "grid", gridAutoRows: "auto", gap: "5px"}}>
            <div style={{display: "grid", gridTemplateColumns: "1fr 5fr"}}>
                <div>source:</div>
                <Autocomplete
                    size={"small"}
                    options={graphState.data.nodes.map(node => node.id)}
                    onChange={(event, value) => setSource(value)}
                    renderInput={params => (
                        <TextField
                            onChange={(e) => setSource(e.target.value)}
                            value={source}
                            {...params}
                            label="source"
                            variant="outlined"
                        />
                    )}
                />
            </div>
            <div style={{display: "grid", gridTemplateColumns: "1fr 5fr"}}>
                <div>target:</div>
                <Autocomplete
                    size={"small"}
                    options={graphState.data.nodes.map(node => node.id)}
                    onChange={(event, value) => setTarget(value)}
                    renderInput={params => (
                        <TextField
                            onChange={(e) => setTarget(e.target.value)}
                            value={target}
                            {...params}
                            label="target"
                            variant="outlined"
                        />
                    )}
                />
            </div>
            <div style={{display: "grid", gridTemplateColumns: "1fr 5fr"}}>
                <div>keyLink:</div>
                <Checkbox checked={isKeyLink} onClick={() => setIsKeyLink(!isKeyLink)}/>
            </div>
            <div style={{display: "grid", gridTemplateColumns: "1fr 5fr"}}>
                <div>reversible:</div>
                <Checkbox checked={isReversible} onClick={() => setIsReversible(!isReversible)}/>
            </div>
            <div>
                <button className={"download-button"} style={{width: "20vw"}} onClick={() => handleAddLink()}>submit
                    link
                </button>
            </div>
        </div>
    );
};

export default AddLinkBody;

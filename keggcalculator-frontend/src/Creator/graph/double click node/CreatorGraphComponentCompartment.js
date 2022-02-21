import React, {useEffect, useState} from "react";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import {useStyles} from "../../ModalStyles/ModalStyles";
import {useDispatch, useSelector} from "react-redux";
import {updateCompoundInAdjacentReactions} from "../click node/leftClick/AddExchangeReaction";

export default function CreatorGraphComponentCompartment({compoundId}) {

    const generalState = useSelector(state => state.general)
    const graphState = useSelector(state => state.graph)
    const dispatch = useDispatch()
    const [compartment, setCompartment] = useState('cytosol')
    const classes = useStyles()

    useEffect(() => {
        let match = false
        for (const reaction of generalState.reactionsInSelectArray) {

            for (const component of [...reaction.substrates, ...reaction.products]) {
                if(component.name === compoundId && component.compartment ) {
                    setCompartment(component.compartment)
                    match = true
                    break
                }
            }

            if (match) {
                break
            }
        }
    },[])

    useEffect(() => {
        const newReactionArray = updateCompoundInAdjacentReactions(compoundId, graphState, generalState, "compartment", compartment)
        dispatch({type: "SETREACTIONSINARRAY", payload: newReactionArray})

    },[compartment])

    return(
        <div>
            <FormControl style={{margin: "2px 0"}} size="small" variant="outlined" className={classes.formControl}>
                <InputLabel id="taxonomicRankInput">compartment</InputLabel>
                <Select
                    labelId="compound compartment"
                    value={compartment}
                    onChange={(e) => {
                        setCompartment(e.target.value)}
                    }
                >
                    <MenuItem value={'cytosol'}> cytosol </MenuItem>
                    <MenuItem value={'external'}> external </MenuItem>
                </Select>
            </FormControl>
        </div>
    )
}

import React, {useEffect, useState} from "react";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import {useStyles} from "../../ModalStyles/ModalStyles";
import {useSelector} from "react-redux";

export default function CreatorGraphComponentCompartment({compoundId}) {

    const generalState = useSelector(state => state.general)
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

            if (match) {break}
        }
    },[])

    useEffect(() => {
        generalState.reactionsInSelectArray.forEach(
            reaction => {
                reaction.substrates.forEach(
                    substrate => {
                        if(substrate.name === compoundId) {
                            substrate.compartment = compartment
                        }
                    }
                )

                reaction.products.forEach(
                    product => {
                        if (product.name === compoundId) {
                            product.compartment = compartment
                        }
                    }
                )
            }
        )
    },[compartment])

    return(
        <div>
            <FormControl style={{margin: "2px 0"}} size="small" variant="outlined" className={classes.formControl}>
                <InputLabel id="taxonomicRankInput">compartment</InputLabel>
                <Select
                    labelId="compound compartment"
                    value={compartment}
                    onChange={(e) => {
                        console.log("Changed")
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
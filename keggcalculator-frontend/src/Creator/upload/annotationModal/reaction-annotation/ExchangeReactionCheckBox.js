import {Checkbox} from "@material-ui/core";
import React from "react";
import {useDispatch} from "react-redux";

const changeComponentCompartment = (components, isExchangeReaction) => {
    components.forEach((component) => {
        component.compartment = isExchangeReaction ? "external" : "cytosol"
    })
}

const updateAllReactions = (components, listOfReactions) => {
    components.forEach(component => {
        listOfReactions.forEach(reaction => {
            reaction.substrates.forEach(substrate => {
                if (substrate.name === component.name) {
                    substrate.compartment = component.compartment
                }
            })
            reaction.products.forEach(product => {
                if (product.name === component.name) {
                    product.compartment = component.compartment
                }
            })
        })
    })
}

export default function ExchangeReactionCheckBox(props) {

    const dispatch = useDispatch()

    const handleClick = () => {
        const newListOfReactions = props.listOfReactions
        const isExchangeReaction = !newListOfReactions[props.index].exchangeReaction
        newListOfReactions[props.index].exchangeReaction = isExchangeReaction
        changeComponentCompartment(newListOfReactions[props.index].substrates, isExchangeReaction)
        updateAllReactions(newListOfReactions[props.index].substrates, newListOfReactions)
        dispatch({type: "SETLISTOFREACTIONS", payload: newListOfReactions})
    }

    return(
        <div>
            <Checkbox
                disabled={props.listOfReactions[props.index].products.length !== 0}
                checked={props.listOfReactions[props.index].exchangeReaction}
                onClick={(event) => handleClick()}
            />
            exchange reaction
        </div>
    )
}

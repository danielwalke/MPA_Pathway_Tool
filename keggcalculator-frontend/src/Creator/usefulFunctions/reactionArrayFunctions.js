export function changePropsInListEl(array, name, propsToBeChanged) {

    return array.map(el => {
        for (const prop of Object.keys(propsToBeChanged)) {
            if (el.name === name && prop in el) {
                el[prop] = propsToBeChanged[prop]
            }
        }
        return el
    })
}

export function updateElementsInReactionArray(nodeName, propsToBeChanged, reactionArray, dispatch) {

//    prop to be changed: {propKey: propValue}

    const newReactionArray = reactionArray.map(reaction => {
        const newReaction = {...reaction}

        for (const prop of Object.keys(propsToBeChanged)) {
            if (reaction.reactionName === nodeName && prop in reaction) {
                newReaction[prop] = propsToBeChanged[prop]
            }
        }

        newReaction.products = changePropsInListEl(reaction.products, nodeName, propsToBeChanged)
        newReaction.substrates = changePropsInListEl(reaction.substrates, nodeName, propsToBeChanged)

        return newReaction
    })

    dispatch({type: "SETREACTIONSINARRAY", payload: newReactionArray})

}

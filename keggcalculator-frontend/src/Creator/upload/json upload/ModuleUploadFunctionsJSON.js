export const handleJSONGraphUpload = (reactions, dispatch, graphState) => { //handle upload of JSON for graph visualisation
    const nodes = []
    const links = []
    reactions.map(reaction => {
        const reactionNode = {
            id: reaction.reactionName,
            color: "black",
            symbolType: "diamond",
            opacity: reaction.opacity,
            x: +reaction.x,
            y: +reaction.y,
            reversible: reaction.reversible ==="reversible"
        }
        nodes.push(reactionNode)
        reaction.substrates.map(substrate => {
            const compoundNode = {
                id: substrate.name,
                color: "darkgreen",
                symbolType: "circle",
                opacity: substrate.opacity,
                x: +substrate.x,
                y: +substrate.y
            }
            const compoundLink = {
                source: substrate.name,
                target: reaction.reactionName,
                opacity: substrate.opacity
            }
            if(reactionNode.reversible){
                links.push({
                    source: reaction.reactionName,
                    target: substrate.name,
                    opacity: substrate.opacity,
                    isReversibleLink: true
                })
            }
            nodes.push(compoundNode)
            links.push(compoundLink)
            graphState.abbreviationsObject[`${reaction.reactionName}`] = reaction.abbreviation
            graphState.abbreviationsObject[`${substrate.name}`] = substrate.abbreviation
            return null
        })

        reaction.products.map(product => {
            const compoundNode = {
                id: product.name,
                color: "darkgreen",
                symbolType: "circle",
                opacity: product.opacity,
                x: +product.x,
                y: +product.y
            }
            const compoundLink = {
                source: reaction.reactionName,
                target: product.name,
                opacity: product.opacity
            }
            if(reactionNode.reversible){
                links.push({
                    source: product.name,
                    target: reaction.reactionName,
                    opacity: product.opacity,
                    isReversibleLink: true
                })
            }
            nodes.push(compoundNode)
            links.push(compoundLink)
            graphState.abbreviationsObject[`${reaction.reactionName}`] = reaction.abbreviation
            graphState.abbreviationsObject[`${product.name}`] = product.abbreviation
            return null
        })
        dispatch({type: "SETABBREVIATIONOBJECT", payload: graphState.abbreviationsObject})
        return null;
    })
    return {nodes, links}
}
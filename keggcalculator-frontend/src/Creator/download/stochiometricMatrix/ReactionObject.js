

export const getReactionObjects = (forwardReactions, backwardReactions,compoundSet, graphState) =>{
    //adds compound names to stoichiometric coefficients in each reactions
    console.log(forwardReactions)
    console.log(backwardReactions)
    const reactionObjects = forwardReactions.map(reaction => { // correct direction
        const reactionSubstrateLinks = graphState.data.links.filter(link => link.target.includes(reaction.reactionId) && !link.isReversibleLink)
        const reactionSubstrates = reactionSubstrateLinks.map(link => link.source)
        reaction.metabolites = []
        reaction.reactionSubstrates = reactionSubstrates.map(substrate => {
            const id = substrate.substring(substrate.length-6, substrate.length)
            const stoichiometry = reaction.stochiometrySubstratesString[id]
            compoundSet.add(substrate)
            reaction.metabolites.push({
                id: substrate,
                stoichiometry:  `${-stoichiometry}`
            })
            return(
                {
                    id: substrate,
                    stoichiometry: stoichiometry
                }
            )
        })
        const reactionProductLinks = graphState.data.links.filter(link => link.source.includes(reaction.reactionId) && !link.isReversibleLink)
        const reactionProducts = reactionProductLinks.map(link => link.target)
        reaction.reactionProducts = reactionProducts.map(product => {
            const id = product.substring(product.length-6, product.length)
            const stoichiometry = reaction.stochiometryProductsString[id]
            compoundSet.add(product)
            reaction.metabolites.push({
                id: product,
                stoichiometry: stoichiometry
            })
            return(
                {
                    id: product,
                    stoichiometry: stoichiometry
                }
            )
        })
        return reaction
    })

    //adds compound names to stoichiometric coefficients in each reactions
    backwardReactions.map(reaction => { // reversed direction -> user changed the directions of arrows
        const reactionSubstrateLinks = graphState.data.links.filter(link => link.target.includes(reaction.reactionId) && !link.isReversibleLink)
        const reactionSubstrates = reactionSubstrateLinks.map(link => link.source)
        reaction.metabolites = []
        reaction.reactionSubstrates = reactionSubstrates.map(substrate => {
            const id = substrate.substring(substrate.length-6, substrate.length)
            const stoichiometry = reaction.stochiometryProductsString[id]
            compoundSet.add(substrate)
            reaction.metabolites.push({
                id: substrate,
                stoichiometry: `${-stoichiometry}`
            })
            return(
                {
                    id: substrate,
                    stoichiometry: stoichiometry
                }
            )
        })
        const reactionProductLinks = graphState.data.links.filter(link => link.source.includes(reaction.reactionId))
        const reactionProducts = reactionProductLinks.map(link => link.target && !link.isReversibleLink)
        reaction.reactionProducts = reactionProducts.map(product => {
            const id = product.substring(product.length-6, product.length)
            const stoichiometry = reaction.stochiometrySubstratesString[id]
            compoundSet.add(product)
            reaction.metabolites.push({
                id: product,
                stoichiometry: stoichiometry
            })
            return(
                {
                    id: product,
                    stoichiometry: stoichiometry
                }
            )
        })
        reactionObjects.push(reaction)
        return reaction
    })

    return reactionObjects
}
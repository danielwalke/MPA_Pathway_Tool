import {requestGenerator} from "../../Request Generator/RequestGenerator";

const reactionUrl = "http://127.0.0.1/keggcreator/getreaction"

const getSpeciesIds = (speciesList) =>{
    const speciesRefs = speciesList.getElementsByTagName("speciesReference")
    const speciesIds = []
    for (const speciesRef of speciesRefs) {
        const speciesId = speciesRef.attributes.species
        speciesIds.push(speciesId)
    }
    return speciesIds
}

const getKeggReactions = (reactions,reaction, annotatedRefLinks) =>{
    for (const annotatedRefLink of annotatedRefLinks) {
        const link = annotatedRefLink.attributes[`rdf:resource`]
        if (link.includes("kegg")) {
            const reactionObject = {}
            reactionObject.id = `${reaction.attributes.id} ${link.substring(link.length - 6, link.length)}`
            const listOfReactants = reaction.getElementsByTagName("listOfReactants")[0]
            const listofProducts = reaction.getElementsByTagName("listOfProducts")[0]
            reactionObject.substrates = getSpeciesIds(listOfReactants)
            reactionObject.products = getSpeciesIds(listofProducts)
            reactions.push(reactionObject)
        }
    }
}

export const getReactionsFromSbml = (sbmlObject) => {
    const reactions = []
    const listOfReactions = sbmlObject.getElementsByTagName("listOfReactions")[0]
    for (const reaction of listOfReactions.children) {
        const annotatedRefLinks = reaction.getElementsByTagName("rdf:li")
        getKeggReactions(reactions, reaction, annotatedRefLinks)
    }
    return reactions
}

const getKeggIds = (reactionCompounds, listOfSpecies) => {
    const compoundsKegg = []
    for (const compoundId of reactionCompounds) {
        const compound = {}
        compound.id = compoundId
        for (const species of listOfSpecies.children) {
            const speciesID = species.attributes.id
            if (speciesID === compoundId) {
                const refs = species.getElementsByTagName("rdf:li")
                for (const ref of refs) {
                    const rdfResource = ref.attributes[`rdf:resource`]
                    if (rdfResource.includes("kegg.compound")) {
                        compoundsKegg.push({
                            id: compoundId,
                            compoundId: rdfResource.substring(rdfResource.length - 6, rdfResource.length)
                        })
                    }
                }
            }
        }
    }
    return compoundsKegg
}

export const getSpeciesInformation = (reactions, sbmlObject) => {
    const listOfSpecies = sbmlObject.getElementsByTagName("listOfSpecies")[0]
    for (const reaction of reactions) {
        reaction.substrateObjects = getKeggIds(reaction.substrates, listOfSpecies)
        reaction.productObjects = getKeggIds(reaction.products, listOfSpecies)
    }
    return reactions
}

export const drawGraphFromSbml = (reactions) => {
    const data = {nodes: [], links: []}
    reactions.map(reaction => {
        const reactionNode = {
            id: reaction.id,
            opacity: 1,
            x: 0,
            y: 0,
            symbolType: "diamond",
            color: "black"
        }
        for (const substrate of reaction.substrateObjects) {
            const substrateNode = {
                id: `${substrate.id} ${substrate.compoundId}`,
                opacity: 1,
                x: 0,
                y: 0,
                symbolType: "circle",
                color: "darkgreen"
            }
            data.nodes.push(substrateNode)
            data.links.push({
                source: substrateNode.id,
                target: reactionNode.id,
                opacity: 1
            })
        }
        for (const product of reaction.productObjects) {
            const productNode = {
                id: `${product.id} ${product.compoundId}`,
                opacity: 1,
                x: 0,
                y: 0,
                symbolType: "circle",
                color: "darkgreen"
            }
            data.nodes.push(productNode)
            data.links.push({
                source: reactionNode.id,
                target: productNode.id,
                opacity: 1
            })
        }
        data.nodes.push(reactionNode)
    })
    return data
}

export const setReactionListfromSbml = (reactions, dispatch) => {
    let reqPromise
    const reactionsFromRequest = []
    for (const reaction of reactions) {
        const id = reaction.id.substring(reaction.id.length - 6, reaction.id.length)
        reqPromise = requestGenerator("POST", reactionUrl, {reactionId: id}, "", "")
            .then(response => {
                response.data.reactionName = reaction.id //TODO add ec numbers and ko numbers from sbml files itself
                reactionsFromRequest.push(response.data)
            })
    }
    reqPromise.then(() => {
        dispatch({type: "ADDREACTIONSTOARRAY", payload: reactionsFromRequest})
    })

}

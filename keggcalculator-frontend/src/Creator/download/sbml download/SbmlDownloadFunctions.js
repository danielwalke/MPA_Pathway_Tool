import {requestGenerator} from "../../../Request Generator/RequestGenerator";
import {getUserReactionId} from "../../specReaction/functions/SpecReactionFunctions";
import {endpoint_getReactionUrl} from "../../../App Configurations/RequestURLCollection";

const reactionUrl = endpoint_getReactionUrl

const getSpecies = (speciesList) => {
    const speciesRefs = speciesList.getElementsByTagName("speciesReference")
    const speciesIds = []
    for (const speciesRef of speciesRefs) {
        const speciesId = speciesRef.attributes.species
        const speciesStoichiometry = speciesRef.attributes.stoichiometry
        const speciesObject = {
            id: speciesId,
            stoichiometry: speciesStoichiometry,
            compoundId: speciesId,
            name: speciesId,
        }
        speciesIds.push(speciesObject)
    }
    return speciesIds
}

const getKeggReactions = (reactions, reaction, annotatedRefLinks, unAnnotatedReactions) => {
    const keggReactionLinks = annotatedRefLinks.filter(link => link.attributes["rdf:resource"].includes("kegg.reaction"))
    const ecLinks = annotatedRefLinks.filter(link => link.attributes["rdf:resource"].includes("ec-code"))
    const ecLinksString = ecLinks.map(link => link.attributes["rdf:resource"])
    const koLinks = annotatedRefLinks.filter(link => link.attributes["rdf:resource"].includes("kegg.orthology"))
    const koLinksString = koLinks.map(link => link.attributes["rdf:resource"])
    const ecNumbers = ecLinksString.map(link => {
        const linkItems = link.split("/")
        return linkItems[linkItems.length - 1]
    })
    const koNumbers = koLinksString.map(link => {
        const linkItems = link.split("/")
        return linkItems[linkItems.length - 1]
    })

    if (keggReactionLinks.length === 0) {
        const unAnnotatedReaction = {}
        unAnnotatedReaction.id = reaction.attributes.id
        unAnnotatedReaction.name = reaction.attributes.name.length > 0 ? reaction.attributes.name : reaction.attributes.id
        const listOfReactants = typeof reaction.getElementsByTagName("listOfReactants")[0] === "undefined" ? {} : reaction.getElementsByTagName("listOfReactants")[0]
        const listOfProducts = typeof reaction.getElementsByTagName("listOfProducts")[0] === "undefined" ? {} : reaction.getElementsByTagName("listOfProducts")[0]
        unAnnotatedReaction.substrates = Object.keys(listOfReactants).length === 0 ? [] : getSpecies(listOfReactants)
        unAnnotatedReaction.products = Object.keys(listOfProducts).length === 0 ? [] : getSpecies(listOfProducts)
        unAnnotatedReaction.koNumbers = koNumbers
        unAnnotatedReaction.ecNumbers = ecNumbers
        unAnnotatedReactions.push(unAnnotatedReaction)
    } else {
        keggReactionLinks.map(annotatedLink => {
            const link = annotatedLink.attributes[`rdf:resource`]
            if (link.includes("kegg")) {
                const reactionObject = {}
                reactionObject.id = `${reaction.attributes.id} ${link.substring(link.length - 6, link.length)}`
                reactionObject.name = reaction.attributes.name.length > 0 ? reaction.attributes.name : reaction.attributes.id
                const listOfReactants = reaction.getElementsByTagName("listOfReactants")[0]
                const listofProducts = reaction.getElementsByTagName("listOfProducts")[0]
                // console.log(listOfReactants)
                reactionObject.substrates = getSpecies(listOfReactants)
                reactionObject.products = getSpecies(listofProducts)
                reactionObject.koNumbers = koNumbers
                reactionObject.ecNumbers = ecNumbers
                reactions.push(reactionObject)
            }
        })
    }
    // for (const annotatedRefLink of annotatedRefLinks) {
    //
    // }
}

export const getReactionsFromSbml = (sbmlObject) => {
    const reactions = []
    const unAnnotatedReactions = []
    const listOfReactions = sbmlObject.getElementsByTagName("listOfReactions")[0]
    for (const reaction of listOfReactions.children) {
        const annotatedRefLinks = reaction.getElementsByTagName("rdf:li")
        getKeggReactions(reactions, reaction, annotatedRefLinks, unAnnotatedReactions)
    }
    return {reactions, unAnnotatedReactions}
}

//TODO handle edge cases for not found rdf:li
const getKeggIds = (reactionCompounds, listOfSpecies) => {
    const compoundsKegg = []
    for (const compound of reactionCompounds) {
        const species = listOfSpecies.children.filter(species => species.attributes.id === compound.id)[0]
        const keggRefs = species.getElementsByTagName("rdf:li").filter(ref => ref.attributes[`rdf:resource`].includes("kegg.compound"))
        keggRefs.map(refObject => {
            const ref = refObject.attributes[`rdf:resource`]
            compoundsKegg.push({
                id: compound.id,
                name: species.attributes.name.length > 0 ? species.attributes.name : species.attributes.id,
                stoichiometry: compound.stoichiometry,
                compoundId: ref.substring(ref.length - 6, ref.length)
            })
        })
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

const nodeInData = (nodes, newNode) => {
    let isInData = false
    const foundNodes = nodes.filter(node => node.id === newNode.id)
    if (foundNodes.length > 0) {
        isInData = true
    }
    return isInData
}

const linkInData = (links, newLink) => {
    let isInData = false
    const foundLinks = links.filter(link => link.source === newLink.source && link.target === newLink.target)
    if (foundLinks.length > 0) {
        isInData = true
    }
    return isInData
}

export const drawGraphFromSbml = (reactions, data, graphState) => {
    const reactionList = graphState.data.nodes.filter(node => node.symbolType === "diamond")
    const compoundList = graphState.data.nodes.filter(node => node.symbolType === "circle")
    reactions.map((reaction, reactionIndex) => {
        const reactionNode = {
            id: `${reaction.name} ${reaction.id}`,
            opacity: 1,
            x: 0,
            y: 0,
            symbolType: "diamond",
            color: "black"
        }
        const substrates = reaction.substrateObjects.length > 0 ? reaction.substrateObjects : reaction.substrates
        substrates.map((substrate, index) => {
            const substrateNode = {
                id: `${substrate.name} ${substrate.id}`,
                opacity: 1,
                x: 0,
                y: 0,
                symbolType: "circle",
                color: "darkgreen"
            }
            if (!nodeInData(data.nodes, substrateNode)) {
                data.nodes.push(substrateNode)
            }
            const substrateLink = {
                source: substrateNode.id,
                target: reactionNode.id,
                opacity: 1
            }
            if (!linkInData(data.links, substrateLink)) {
                data.links.push(substrateLink)
            }
        })
        const products = reaction.productObjects.length > 0 ? reaction.productObjects : reaction.products
        products.map((product, index) => {
            const productNode = {
                id: `${product.name} ${product.id}`,
                opacity: 1,
                x: 0,
                y: 0,
                symbolType: "circle",
                color: "darkgreen"
            }
            if (!nodeInData(data.nodes, productNode)) {
                data.nodes.push(productNode)
            }
            const productLink = {
                source: reactionNode.id,
                target: productNode.id,
                opacity: 1
            }
            if (!linkInData(data.links, productLink)) {
                data.links.push(productLink)
            }

        })
        if (!nodeInData(data.nodes, reactionNode)) {
            data.nodes.push(reactionNode)
        }

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
                response.data.reactionName = reaction.id
                reactionsFromRequest.push(response.data)
            })
    }
    reqPromise.then(() => {
        dispatch({type: "ADDREACTIONSTOARRAY", payload: reactionsFromRequest})
    })

}


export const getSpeciesFromSbml = (sbmlObject) => {
    console.log(sbmlObject)
    const listOfSpecies = sbmlObject.getElementsByTagName("listOfSpecies")[0]
    const list = []
    listOfSpecies.children.map((species, index) => {
        const name = typeof species.attributes.name === "string" ? species.attributes.name : species.attributes.id
        const id = species.attributes.id
        const annotations = species.getElementsByTagName("rdf:li").map(link => link.attributes["rdf:resource"])
        const keggAnnotations = annotations.filter(link => link.includes("kegg.compound"))
        const rawId = keggAnnotations.length > 0 ? keggAnnotations[0].substring(keggAnnotations[0].length - 6, keggAnnotations[0].length) : id
        const compoundId = getCompoundId(rawId, index)
        list.push({name: id.concat(name), id: compoundId, keggAnnotations: keggAnnotations})
    })
    console.log(list)
    return list
}

const getCompoundId = (id, length) => {
    if (id.match(/[C,G][0-9][0-9][0-9][0-9][0-9]/)) {
        return id;
    } else {
        return `K${getUserReactionId(length)}`;
    }

}

//TODO: fill
export const setReactionList = (reactions, dispatch, generalState) => {
    const reactionObjects = reactions.map((reaction, index) => {
        const reactionCount = generalState.reactionsInSelectArray.length + index
        reaction.id = getReactionId(reaction.id, reactionCount)
        const substrates = {}
        reaction.substrateObjects.map(substrateObject => {
            substrates[`${substrateObject.compoundId}`] = substrateObject.stoichiometry
        })
        const products = {}
        reaction.productObjects.map(productObject => {
            products[`${productObject.compoundId}`] = productObject.stoichiometry
        })
        return {
            ecNumbersString: reaction.ecNumbers,
            koNumbersString: reaction.koNumbers,
            isForwardReaction: true,
            reactionId: getReactionId(reaction.id, reactionCount),
            reactionName: reaction.name.concat(";" + reaction.id),
            stochiometrySubstratesString: substrates,
            stochiometryProductsString: products,
            taxa: {}
        }
    })
    console.log(reactionObjects)
    dispatch({type: "ADDREACTIONSTOARRAY", payload: reactionObjects})
}

const getReactionId = (id, length) => {
    if (id.match(/[R][0-9][0-9][0-9][0-9][0-9]/)) {
        return id.substring(id.length - 6, id.length);
    } else {
        return `U${getUserReactionId(length)}`;
    }
}

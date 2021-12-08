import React from 'react';
import xmlParser from "react-xml-parser/xmlParser";
import {getUserReactionId} from "../../../specReaction/functions/SpecReactionFunctions";
import {addCompoundsToReactions} from "../ReactionCompoundsAdder";
import {readListOfReactionGlyphs} from "../nodePositionsAndOpacity/SbmlNodePositionsAndOpacity";
import {readListOfSpeciesGlyphs} from "../nodePositionsAndOpacity/SpeciesGlyphReader"
import {getLastItemOfList} from "../../../usefulFunctions/Arrays";
import clonedeep from "lodash/cloneDeep"
import {requestGenerator} from "../../../request/RequestGenerator";
import {endpoint_TaxonomyById} from "../../../../App Configurations/RequestURLCollection";
import {getNLastChars} from "../../../usefulFunctions/Strings";
//get specific compound id in the appropriate format
export const getCompoundId = (index) => {
    if (index < 10) {
        return "K0000".concat(index.toString());
    } else if (index >= 10 && index < 100) {
        return "K000".concat(index.toString());
    } else if (index >= 100 && index < 1000) {
        return "K00".concat(index.toString())
    } else if (index >= 1000 && index < 10000) {
        return "K0".concat(index.toString())
    } else if (index >= 10000 && index < 100000) {
        return "K".concat(index.toString())
    } else {
        console.log("ERROR: reaction out of range")
    }
}

//read compounds from reactions, i.e. from ListOfReactants and ListOfProducts
const getSpeciesFromReaction = (speciesRefsElement) => {
    const compounds = speciesRefsElement.map((speciesReference, index) => {
        const sbmlId = speciesReference.attributes.species
        const stoichiometry = typeof speciesReference.attributes.stoichiometry === "undefined" ? "1" : speciesReference.attributes.stoichiometry
        return (
            {
                sbmlId: sbmlId,
                stoichiometry: stoichiometry
            }
        )
    })
    return compounds
}

const replaceXmlCharacters = (string) => string.replaceAll("&lt;", "<").replaceAll("&gt;", ">")

const replaceStringBounds = (value, bound, reversible) => {
    let returnValue
    switch (bound) {
        case "upperBound":
            returnValue = parseFloat(value) ? parseFloat(value) : 1000.0
            break
        case "lowerBound":
            returnValue = parseFloat(value) ?
                parseFloat(value) : reversible ?
                    -1000.0 : 0.0
            break
    }
    return returnValue
}

const readCompartments = (dispatch, sbml) => {
    const listOfCompartmentsElement = sbml.getElementsByTagName("listOfCompartments")[0]
    const compartments = []

    if (listOfCompartmentsElement) {
        for (const compartment of listOfCompartmentsElement.children) {
            compartments.push(compartment.attributes["id"])
        }
    }

    if (compartments.length > 2) {
        throw "More than two compartments."
    }

    return compartments
}

//read species from sbml file

function getCompartment(listOfCompartments) {
    const sbmlToMpaCompartments = new Map()
    let unknownCompartments = false

    listOfCompartments.forEach(comp => {
        if (/^Internal_Species$/.test(comp) || /^c$/.test(comp) || /^internal$/.test(comp) || /^cytosol$/.test(comp)) {
            sbmlToMpaCompartments.set(comp, 'cytosol')
        } else if (/^External_Species$/.test(comp) || /^e$/.test(comp) || /^external$/.test(comp)) {
            sbmlToMpaCompartments.set(comp, 'external')
        } else {
            if (!unknownCompartments) {unknownCompartments = true}
            sbmlToMpaCompartments.set(comp, 'cytosol')
        }
    })

    if (unknownCompartments) {
        window.alert("Your model contains unknown compartment names. All compartment names were set to 'internal'." +
            " Please assign exchange compounds to be 'external' if you would like to perform FBA.")
    }

    return sbmlToMpaCompartments
}

const readSpecies = (dispatch, sbml, listOfCompartments) => {
    const listOfSpeciesElement = sbml.getElementsByTagName("listOfSpecies")[0]
    const compartmentMapping = getCompartment(listOfCompartments)

    const listOfSpecies = listOfSpeciesElement.children.map((species, index) => {

        const sbmlName = typeof species.attributes.name === "string" ? replaceXmlCharacters(species.attributes.name) : replaceXmlCharacters(species.attributes.id)

        const sbmlId = replaceXmlCharacters(species.attributes.id)

        const annotations = species.getElementsByTagName("rdf:li").map(link => link.attributes["rdf:resource"])
        const keggAnnotations = annotations.filter(link => link.includes("kegg.compound")) //returns one link like "http://identifiers.org/kegg.compound/C00031", i.e. last 6 chars are respective kegg annotation

        const keggId = keggAnnotations.length > 0 ? keggAnnotations[0].substring(keggAnnotations[0].length - 6, keggAnnotations[0].length) : getCompoundId(index);

        const biggMetabolite = annotations.find(link => link.includes("bigg.metabolite"))
        const biggMetaboliteSplitArray = biggMetabolite ? biggMetabolite.split("/") : [""]

        const compartment = species.attributes["compartment"]
        if (!listOfCompartments.includes(compartment)) {throw 'compartment not contained in listOfCompartments!'}

        return (
            {
                sbmlId: sbmlId,
                sbmlName: sbmlName,
                keggId: keggId,
                biggId: biggMetaboliteSplitArray[biggMetaboliteSplitArray.length - 1],
                compartment: compartmentMapping.get(compartment),
                index: index,
            }
        )
    })
    // console.log(listOfSpecies)
    return listOfSpecies
}

const readListOfObjectives = (dispatchh, sbml) => {
    const objectives = []
    const listOfObjectivesElement = sbml.getElementsByTagName("fbc:listOfObjectives")[0]

    if (listOfObjectivesElement) {
        const activeObjective = listOfObjectivesElement.attributes["fbc:activeObjective"]

        for (const objective of listOfObjectivesElement.children) {
            if (objective.attributes["fbc:id"] === activeObjective) {
                objective.getElementsByTagName("fbc:listOfFluxObjectives")[0].children.forEach(
                    reaction => {
                        objectives.push({
                            reactionId: reaction.attributes["fbc:reaction"],
                            objectiveCoefficient: reaction.attributes["fbc:coefficient"]
                        })
                    }
                )
                break
            }
        }
    }

    return objectives
}

const readListOfParameters = (dispatch, sbml) => {
    if (sbml.getElementsByTagName("listOfParameters")[0]) {
        const listOfParametersChildren = sbml.getElementsByTagName("listOfParameters")[0].children

        return listOfParametersChildren.map(parameter => {
            return {
                id: parameter.attributes.id,
                value: parameter.attributes.value
            }
        })
    } else {
        return []
    }

}

function checkforUserReaction(id) {
    return id.match(/^U\d{5}$/)
}

export function generateUserKeggId(newIndex) {
    if(newIndex.toString().length <= 5) {
        const n = newIndex.toString().length
        let newKeggId = 'U'
        for (let i = 0; i < 5-n; i++) {newKeggId += '0'}
        return newKeggId + newIndex.toString()
    } else {
        window.alert(
            "Reaction out of range! Can't add this reaction.")
        return undefined
    }
}

function findNewKeggId(usedIndices) {
    let newIndex = 0
    while(usedIndices.has(newIndex)) {
        newIndex++
    }

    return {newKeggId: generateUserKeggId(newIndex), index: newIndex}
}

function mergeReactionLists(listOfUserReations, listOfNewUserReactions, listOfReactions, usedIndices) {
    for (const reaction of listOfNewUserReactions) {
        const indexFromReaction = parseInt(getNLastChars(reaction.keggId, 5))
        if (usedIndices.has(indexFromReaction)) {
            const {newKeggId, index} = findNewKeggId(usedIndices)
            reaction.keggId = newKeggId
            usedIndices.add(index)
        } else {
            usedIndices.add(indexFromReaction)
        }
    }

    for (const reaction of listOfUserReations) {
        reaction.keggId = reaction.sbmlId
    }

    return [...listOfReactions, ...listOfUserReations, ...listOfNewUserReactions]
}

//read reactions from sbml file
const readReactions = (dispatch, sbml, globalTaxa, listOfObjectives, listOfParameters) => {
    const listOfReactionsElement = sbml.getElementsByTagName("listOfReactions")[0]
    const listOfUserReations = [] // sbml reactions that are not annotated and have sbmlIds beginning with U
    const usedIndices = new Set() // indices used in sbml ids of user reactions from sbml
    const listOfNewUserReactions = [] // sbml reactions that are not annotated and dont possess sbmlIds beginning with U
    const listOfReactions = [] // reactions with kegg id
    listOfReactionsElement.children.forEach((reaction, index) => {
        const sbmlId = replaceXmlCharacters(reaction.attributes.id);
        const isUserReaction = checkforUserReaction(sbmlId)
        const sbmlName = typeof reaction.attributes.name === "string" ? replaceXmlCharacters(reaction.attributes.name) : replaceXmlCharacters(reaction.attributes.id);
        const reversible = reaction.attributes["reversible"] === "true"
        const annotations = reaction.getElementsByTagName("rdf:li").map(link => link.attributes["rdf:resource"])

        let lowerBoundParam = listOfParameters.find(param => param.id === reaction.attributes["fbc:lowerFluxBound"])
        let upperBoundParam = listOfParameters.find(param => param.id === reaction.attributes["fbc:upperFluxBound"])

        lowerBoundParam = lowerBoundParam ? lowerBoundParam : {id: undefined, value: undefined}
        upperBoundParam = upperBoundParam ? upperBoundParam : {id: undefined, value: undefined}

        lowerBoundParam.value = replaceStringBounds(lowerBoundParam.value, "lowerBound", reversible)
        upperBoundParam.value = replaceStringBounds(upperBoundParam.value, "upperBound", reversible)

        const lowerBound = lowerBoundParam.value
        const upperBound = upperBoundParam.value

        const objectiveCoefficient = listOfObjectives.some(reaction => reaction.reactionId === sbmlId) ?
            parseFloat(listOfObjectives.find(reaction => reaction.reactionId === sbmlId).objectiveCoefficient) : 0.0

        const biggReactionAnnotation = annotations.find(link => link.includes("bigg.reaction"))
        const biggReactionSplitArray = biggReactionAnnotation ? biggReactionAnnotation.split("/") : [""]

        const keggAnnotations = annotations.filter(link => link.includes("kegg.reaction")) //returns one link like "http://identifiers.org/kegg.reaction/R00212", i.e. last 6 chars are respective kegg annotation
        //possibly more than one reaction annotations in one reaction
        const keggId = keggAnnotations.length === 1 ? getNLastChars(keggAnnotations[0], 6) : `U${getUserReactionId(index)}`;
        const ecAnnotations = annotations.filter(link => link.includes("ec-code")) //"http://identifiers.org/ec-code/2.3.1.54"
        const ecNumbers = ecAnnotations.map(ecAnnotation => {
            const ecAnnotationItems = ecAnnotation.split("/")
            const len = ecAnnotationItems.length
            return ecAnnotationItems[len - 1] //returns last item of each annotation, i.e. the respective ec number
        });
        const koAnnotations = annotations.filter(link => link.includes("kegg.jp/entry/K")) //"http://identifiers.org/kegg.orthology/K00001"
        const koNumbers = koAnnotations.map(koAnnotation => {
            const koAnnotationItems = koAnnotation.split("/")
            const len = koAnnotationItems.length
            return koAnnotationItems[len - 1] //returns last item of each annotation, i.e. the respective KO- number
        });

        const listOfReactantsElement = !reaction.getElementsByTagName("listOfReactants")[0] ?
            {} : reaction.getElementsByTagName("listOfReactants")[0]
        const speciesRefsElementSubstrates = !reaction.getElementsByTagName("listOfReactants")[0] ?
            [] : listOfReactantsElement.getElementsByTagName("speciesReference")
        const substrates = getSpeciesFromReaction(speciesRefsElementSubstrates)

        const listOfProductsElement = !reaction.getElementsByTagName("listOfProducts")[0] ? {} : reaction.getElementsByTagName("listOfProducts")[0] //I think in the {} should be speciesReference:[]?
        const speciesRefsElementProducts = !reaction.getElementsByTagName("listOfProducts")[0] ? [] : listOfProductsElement.getElementsByTagName("speciesReference")
        const products = getSpeciesFromReaction(speciesRefsElementProducts);

        const newReaction = {
            sbmlId: sbmlId,
            sbmlName: sbmlName,
            keggId: keggId,
            ecNumbers: ecNumbers,
            koNumbers: koNumbers,
            substrates: substrates,
            products: products,
            reversible: reversible,
            taxonomy: getTaxonomyFromSbml(annotations, globalTaxa),
            biggReaction: biggReactionSplitArray[biggReactionSplitArray.length - 1],
            upperBound: upperBound,
            lowerBound: lowerBound,
            objectiveCoefficient: objectiveCoefficient,
            index: index,
        };

        if (isUserReaction) {
            // user reaction from sbml
            listOfUserReations.push(newReaction)
            usedIndices.add(parseInt(getNLastChars(sbmlId,5)))
        } else if (checkforUserReaction(keggId)) {
            // new user reaction
            listOfNewUserReactions.push(newReaction)
        } else {
            listOfReactions.push(newReaction)
        }
    })
    return mergeReactionLists(listOfUserReations, listOfNewUserReactions, listOfReactions, usedIndices)
}

const getTaxonomyNumber = (annotations) => {
    const taxonomyLinks = annotations.filter(link => link.includes("taxonomy"))
    return taxonomyLinks.map(link => {
        const items = link.split("/")
        return items[items.length - 1]
    })
}

const getTaxonomyObject = (taxonomyNumbers, taxonomyObject) => {
    for (const taxonomyNumber of taxonomyNumbers) {
        requestGenerator("POST", endpoint_TaxonomyById, {id: taxonomyNumber}, "").then(
            resp => {
                return resp.data
            }
        ).then(taxonomy => {
            taxonomyObject[taxonomy.taxonomicName] = taxonomy.taxonomicRank
        })
    }
    return taxonomyObject
}

const getTaxonomyFromSbml = (annotations, taxa) => {
    const globalTaxa = clonedeep(taxa)
    const taxonomyNumbers = getTaxonomyNumber(annotations)
    return getTaxonomyObject(taxonomyNumbers, globalTaxa)
}

//checks if ListOfSpecies contains missing compound annotaations
const checkMissingAnnotations = (listOfSpecies) => {
    const unAnnotatedIds = listOfSpecies.filter(species => species.keggId.match(/[K][0-9][0-9][0-9][0-9][0-9]/));
    const isMissingAnnotations = unAnnotatedIds.length > 0;
    return isMissingAnnotations
}

const passChildrenTillAnnotationTag = (children, annotation) => {
    for (const child of children) {
        if (child.name === "annotation") {
            annotation.push(child)
            break;
        } else if (child.name === "listOfSpecies") {
            break;
        } else if (child.name === "listOfReactions") {
            break;
        } else {
            passChildrenTillAnnotationTag(child.children, annotation)
        }
    }
}

const getGlobalTaxa = (annotation) => {
    const rdfLiList = annotation.getElementsByTagName("rdf:li")
    const filteredRdfLiList = rdfLiList.filter(rdfLi => typeof rdfLi.attributes["rdf:resource"] !== "undefined")
    const taxonomyTags = filteredRdfLiList.filter(rdfLi => rdfLi.attributes["rdf:resource"].includes("taxonomy"))
    const taxonomyNumbers = taxonomyTags.map(taxonomyTag => getLastItemOfList(taxonomyTag.attributes["rdf:resource"].split("/")))
    const taxonomyObject = {}
    return getTaxonomyObject(taxonomyNumbers, taxonomyObject)
}

const findGlobalTaxa = (sbml) => {
    const annotation = []
    passChildrenTillAnnotationTag(sbml.children, annotation)
    const annotationGlobalTaxa = annotation.length > 0 ? annotation[0] : null
    return annotationGlobalTaxa !== null ? getGlobalTaxa(annotationGlobalTaxa) : null
}

//input complete state -> all states from index
export const onSBMLModuleFileChange = async (event, dispatch, state) => {
    let file = await event.target.files[0];
    let reader = new FileReader()
    reader.readAsText(file)
    reader.onload = e => {
        // try {
            const result = e.target.result.trim()
            const parser = new xmlParser()
            const sbml = parser.parseFromString(result)

            const globalTaxa = findGlobalTaxa(sbml) !== null ? findGlobalTaxa(sbml) : {}
            const listOfSpeciesGlyphs = sbml.getElementsByTagName("layout:listOfSpeciesGlyphs").length > 0 ?
                readListOfSpeciesGlyphs(sbml) : []
            const listOfReactionGlyphs = sbml.getElementsByTagName("layout:listOfReactionGlyphs").length > 0 ?
                readListOfReactionGlyphs(sbml) : []

            const listOfCompartments = readCompartments(dispatch, sbml)
            const listOfSpecies = readSpecies(dispatch, sbml, listOfCompartments)
            const listOfObjectives = readListOfObjectives(dispatch, sbml)
            const listOfParameters = readListOfParameters(dispatch, sbml)
            const listOfReactions = readReactions(dispatch, sbml, globalTaxa, listOfObjectives, listOfParameters)

            const isMissingAnnotations = checkMissingAnnotations(listOfSpecies, dispatch)

            dispatch({type: "SETMODULEFILENAMESBML", payload: file.name})
            dispatch({type: "SET_LIST_OF_REACTION_GLYPHS", payload: listOfReactionGlyphs})
            dispatch({type: "SET_LIST_OF_SPECIES_GLYPHS", payload: listOfSpeciesGlyphs})

            dispatch({type: "SETLISTOFSPECIES", payload: listOfSpecies})
            dispatch({type: "SETLISTOFREACTIONS", payload: listOfReactions})

            dispatch({type: "ADD_PATHWAY_TO_AUDIT_TRAIL", payload: file.name})
            dispatch({type: "SET_PATHWAY_FILE", payload: file})

            dispatch({type: "SETISMISSINGANNOTATIONS", payload: isMissingAnnotations}) //if true, annotationWarningModal will show up

            if (!isMissingAnnotations) {
                //all compounds are perfectly annotated :)
                //add additional information to each reaction
                const newListOfReactions = addCompoundsToReactions(state, listOfReactions, listOfSpecies)
                // dispatch({type: "SETISSHOWINGREACTIONTABLE", payload: true})
                dispatch({type: "SETLISTOFREACTIONS", payload: newListOfReactions})
                dispatch({type: "SETLOADING", payload: false})
            }
            dispatch({type: "SHOW_ANNOTATION_WARNING", payload: true})
        // } catch (err) {
        //     console.error(err)
        //     window.alert("Can't read this file.")
        // }
    }
}

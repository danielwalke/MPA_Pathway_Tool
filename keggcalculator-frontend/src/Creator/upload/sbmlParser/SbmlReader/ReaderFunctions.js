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
const getSpeciesFromReaction = (speciesRefsElement) =>{
    const compounds = speciesRefsElement.map((speciesReference, index)=>{
        const sbmlId = speciesReference.attributes.species
        const stoichiometry = typeof speciesReference.attributes.stoichiometry === "undefined" ? "1" : speciesReference.attributes.stoichiometry
        return(
            {
                sbmlId: sbmlId,
                stoichiometry: stoichiometry
            }
        )
    })
    return compounds
}

const replaceXmlCharacters = (string) => string.replaceAll("&lt;", "<").replaceAll("&gt;",">")


//read species from sbml file
const readSpecies =(dispatch, sbml, state)=> {
    const listOfSpeciesElement = sbml.getElementsByTagName("listOfSpecies")[0]
    const listOfSpecies = listOfSpeciesElement.children.map((species, index)=>{
        const sbmlName = typeof species.attributes.name === "string" ? replaceXmlCharacters(species.attributes.name) : replaceXmlCharacters(species.attributes.id)
        const sbmlId = replaceXmlCharacters(species.attributes.id)
        const annotations = species.getElementsByTagName("rdf:li").map(link => link.attributes["rdf:resource"])
        const keggAnnotations = annotations.filter(link => link.includes("kegg.compound")) //returns one link like "http://identifiers.org/kegg.compound/C00031", i.e. last 6 chars are respective kegg annotation
        const keggId = keggAnnotations.length>0? keggAnnotations[0].substring(keggAnnotations[0].length-6, keggAnnotations[0].length) : getCompoundId(index);
        const keggName = typeof state.general.compoundId2Name[`${keggId}`] !== "undefined"? state.general.compoundId2Name[`${keggId}`] : keggId
        return(
            {
                sbmlId: sbmlId,
                sbmlName: sbmlName,
                keggId: keggId,
                keggName: keggName
            }
        )
    })
    console.log(listOfSpecies)
    return listOfSpecies
}

//read reactions from sbml file
const readReactions = (dispatch, sbml,globalTaxa) => {
    const listOfReactionsElement = sbml.getElementsByTagName("listOfReactions")[0]
    const listOfReactions = listOfReactionsElement.children.map((reaction, index) =>{
        const sbmlId = replaceXmlCharacters(reaction.attributes.id);
        const sbmlName = typeof reaction.attributes.name === "string" ? replaceXmlCharacters(reaction.attributes.name) : replaceXmlCharacters(reaction.attributes.id);
        const reversible = typeof reaction.attributes.reversible === "string" ? reaction.attributes.reversible : "true"
        const annotations = reaction.getElementsByTagName("rdf:li").map(link => link.attributes["rdf:resource"])
        const keggAnnotations = annotations.filter(link => link.includes("kegg.reaction")) //returns one link like "http://identifiers.org/kegg.reaction/R00212", i.e. last 6 chars are respective kegg annotation
        //possibly more than one reaction annotations in one reaction
        const keggId = keggAnnotations.length === 1? keggAnnotations[0].substring(keggAnnotations[0].length-6, keggAnnotations[0].length) : `U${getUserReactionId(index)}`;
        const ecAnnotations = annotations.filter(link => link.includes("ec-code")) //"http://identifiers.org/ec-code/2.3.1.54"
        const ecNumbers = ecAnnotations.map(ecAnnotation => {
            const ecAnnotationItems = ecAnnotation.split("/")
            const len = ecAnnotationItems.length
            return ecAnnotationItems[len-1] //returns last item of each annotation, i.e. the respective ec number
        });
        const koAnnotations = annotations.filter(link => link.includes("kegg.jp/entry/K")) //"http://identifiers.org/kegg.orthology/K00001"
        const koNumbers = koAnnotations.map(koAnnotation => {
            const koAnnotationItems = koAnnotation.split("/")
            const len = koAnnotationItems.length
            return koAnnotationItems[len-1] //returns last item of each annotation, i.e. the respective KO- number
        });
        const listOfReactantsElement = typeof reaction.getElementsByTagName("listOfReactants")[0] === "undefined" ? {} : reaction.getElementsByTagName("listOfReactants")[0]
        const speciesRefsElementSubstrates = typeof reaction.getElementsByTagName("listOfReactants")[0] === "undefined" ? [] : listOfReactantsElement.getElementsByTagName("speciesReference")
        const substrates = getSpeciesFromReaction(speciesRefsElementSubstrates)
        const listOfProductsElement = typeof reaction.getElementsByTagName("listOfProducts")[0] === "undefined" ? {} : reaction.getElementsByTagName("listOfProducts")[0] //I think in the {} should be speciesReference:[]?
        const speciesRefsElementProducts = typeof reaction.getElementsByTagName("listOfProducts")[0] === "undefined" ? [] : listOfProductsElement.getElementsByTagName("speciesReference")
        const products = getSpeciesFromReaction(speciesRefsElementProducts);
        return  {
            sbmlId: sbmlId,
            sbmlName: sbmlName,
            keggId: keggId,
            ecNumbers: ecNumbers,
            koNumbers:koNumbers,
            substrates: substrates,
            products: products,
            reversible: reversible === "reversible",
            taxonomy: getTaxonomyFromSbml(annotations,globalTaxa)
        };


    })
    return listOfReactions
}

const getTaxonomyNumber = (annotations) =>{
    const taxonomyLinks = annotations.filter(link => link.includes("taxonomy"))
    return taxonomyLinks.map(link => {
        const items = link.split("/")
        return items[items.length-1]
    })
}

const getTaxonomyObject = (taxonomyNumbers,taxonomyObject) =>{
    for(const taxonomyNumber of taxonomyNumbers){
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

const getTaxonomyFromSbml = (annotations,taxa) =>{
    const globalTaxa = clonedeep(taxa)
    const taxonomyNumbers = getTaxonomyNumber(annotations)
    return getTaxonomyObject(taxonomyNumbers,globalTaxa)
}

//checks if ListOfSpecies contains missing compound annotaations
const checkMissingAnnotations = (listOfSpecies, dispatch) =>{
    const unAnnotatedIds = listOfSpecies.filter(species => species.keggId.match(/[K][0-9][0-9][0-9][0-9][0-9]/));
    const isMissingAnnotations = unAnnotatedIds.length > 0;
    return isMissingAnnotations
}

const passChildrenTillAnnotationTag = (children,annotation) =>{
    for(const child of children){
        if(child.name==="annotation"){
            annotation.push(child)
            break;
        }
        else if(child.name === "listOfSpecies"){
            break;
        }
        else if(child.name === "listOfReactions"){
            break;
        }else{
            passChildrenTillAnnotationTag(child.children,annotation)
        }
    }
}

const getGlobalTaxa = (annotation) =>{
    const rdfLiList = annotation.getElementsByTagName("rdf:li")
    const filteredRdfLiList = rdfLiList.filter(rdfLi=> typeof rdfLi.attributes["rdf:resource"] !== "undefined")
    const taxonomyTags = filteredRdfLiList.filter(rdfLi=> rdfLi.attributes["rdf:resource"].includes("taxonomy"))
    const taxonomyNumbers = taxonomyTags.map(taxonomyTag=>getLastItemOfList(taxonomyTag.attributes["rdf:resource"].split("/")))
    const taxonomyObject = {}
    return getTaxonomyObject(taxonomyNumbers, taxonomyObject)
}

const findGlobalTaxa = (sbml) => {
    const annotation = []
    passChildrenTillAnnotationTag(sbml.children,annotation)
    const annotationGlobalTaxa = annotation.length>0 ? annotation[0] : null
    return annotationGlobalTaxa !== null ? getGlobalTaxa(annotationGlobalTaxa) : null
}

//input complete state -> all states from index
export const onSBMLModuleFileChange = async (event, dispatch, state) => {
    let file = await event.target.files[0];
    let reader = new FileReader()
    reader.readAsText(file)
    reader.onload = e => {
        try {
            const result = e.target.result.trim()
            const parser = new xmlParser()
            const sbml = parser.parseFromString(result)
            const globalTaxa = findGlobalTaxa(sbml) !== null? findGlobalTaxa(sbml) : {}
            const listOfSpeciesGlyphs = sbml.getElementsByTagName("layout:listOfSpeciesGlyphs").length>0 ? readListOfSpeciesGlyphs(sbml) : []
            const listOfReactionGlyphs = sbml.getElementsByTagName("layout:listOfReactionGlyphs").length>0 ? readListOfReactionGlyphs(sbml,listOfSpeciesGlyphs) : []
            const listOfSpecies = readSpecies(dispatch, sbml, state)
            const listOfReactions = readReactions(dispatch, sbml,globalTaxa)
            const isMissingAnnotations = checkMissingAnnotations(listOfSpecies, dispatch)
            dispatch({type: "SETMODULEFILENAMESBML", payload: file.name})
            dispatch({type:"SET_LIST_OF_REACTION_GLYPHS", payload: listOfReactionGlyphs})
            dispatch({type:"SETLISTOFSPECIES", payload: listOfSpecies})
            dispatch({type:"SETLISTOFREACTIONS", payload: listOfReactions})
            dispatch({type:"SETISMISSINGANNOTATIONS", payload: isMissingAnnotations}) //if true, annotationWarningModal will show up
            if(!isMissingAnnotations){ //all compounds are perfectly annotated :)
                //add additional information to each reaction
                const newListOfReactions = addCompoundsToReactions(state, listOfReactions, listOfSpecies)
                //set reactions
                // const reactions = setReactionsInStore(state, newListOfReactions)
                //set data for the Graph
                // const data=  setReactionsAndCompoundsInStore(state, newListOfReactions, dispatch, listOfReactionGlyphs)
                dispatch({type:"SETISSHOWINGREACTIONTABLE", payload: true})
                dispatch({type:"SETLISTOFREACTIONS", payload: newListOfReactions})
                // dispatch({type:"SETREACTIONSINARRAY", payload: reactions})
                // dispatch({type: "SETDATA", payload: data})
                dispatch({type:"SETLOADING", payload: false})
            }
        }catch(e){
            console.error(e)
            window.alert("can't read the file")
        }
    }
}

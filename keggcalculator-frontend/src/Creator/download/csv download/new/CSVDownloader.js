import React from 'react';
import {useSelector} from "react-redux";
import clonedeep from "lodash/cloneDeep";
import {Reaction} from "../../../upload/model/Reaction";
import {Compound} from "../../../upload/model/Compound";

const CsvDownloader = () => {
    const graphState = clonedeep(useSelector(state => state.graph))
    const generalState = clonedeep(useSelector(state => state.general))

    const getReactionNodes = () => graphState.data.nodes.filter(node => node.symbolType === "diamond")

    const getLinksSource = (reactionNode) => graphState.data.links.filter(link => link.source === reactionNode.id)

    const getLinksTarget = (reactionNode) => graphState.data.links.filter(link => link.target === reactionNode.id)

    const getIsCompoundNode = (id) => {
        const node = graphState.data.nodes.find(node => node.id === id)
        return node.symbolType === "circle"
    }

    const getCompoundLinks = (links) => links.filter(link => getIsCompoundNode(link.source) || getIsCompoundNode(link.target))

    const getReactionLinks = (links) => links.filter(link => !getIsCompoundNode(link.source) && !getIsCompoundNode(link.target))

    const getId = (nodeId) => nodeId.substring(nodeId.length - 6, nodeId.length)

    const getReaction = (reactions, reactionNode) => {
        return reactions.find(reaction => reaction.reactionId === getId(reactionNode.id))
    }

    const getStoichiometrySubstrates = (reactionNode, reactions) => getReaction(reactions, reactionNode).stochiometrySubstratesString

    const getStoichiometryProducts = (reactionNode, reactions) => getReaction(reactions, reactionNode).stochiometryProductsString

    const getIsForwardReaction = (reactionNode, reactions) => {
        return getReaction(reactions, reactionNode).isForwardReaction
    }

    const getStoichiometry = (isForwardReaction, reactionNode) => {
        const stoichiometrySubstrates = isForwardReaction ? getStoichiometrySubstrates(reactionNode, generalState.reactionsInSelectArray) :
            getStoichiometryProducts(reactionNode, generalState.reactionsInSelectArray)
        const stoichiometryProducts = isForwardReaction ? getStoichiometryProducts(reactionNode, generalState.reactionsInSelectArray) :
            getStoichiometrySubstrates(reactionNode, generalState.reactionsInSelectArray)
        return {substrates: stoichiometrySubstrates, products: stoichiometryProducts}
    }

    const getReactionAbbreviation = (reactionNode) => {
        const reaction = getReaction(generalState.reactionsInSelectArray, reactionNode)
        return typeof graphState.abbreviationsObject[`${reaction.reactionName}`] === "undefined" ? reaction.reactionName : graphState.abbreviationsObject[`${reaction.reactionName}`]
    }

    const addTaxonomy = (taxa, reaction) => {
        for (const [rank, taxon] of Object.entries(taxa)) {
            reaction.addTaxonomy(rank.concat(":" + taxon))
        }
    }

    const createNewReaction = (reactionNode) => {
        const reaction = new Reaction(reactionNode.id)
        reaction._x = reactionNode.x
        reaction._y = reactionNode.y
        reaction._abbreviation = getReactionAbbreviation(reactionNode)
        reaction._reversible = getReaction(generalState.reactionsInSelectArray, reactionNode).reversible
        reaction._ecList = getReaction(generalState.reactionsInSelectArray, reactionNode).ecNumbersString
        reaction._koList = getReaction(generalState.reactionsInSelectArray, reactionNode).koNumbersString
        addTaxonomy(getReaction(generalState.reactionsInSelectArray, reactionNode).taxa, reaction)
        return reaction
    }

    const addReactionLinks = (reaction, reactionSourceLinks, reactionTargetLinks) => {
        reactionSourceLinks.forEach(link => reaction.addLinkToReaction(link.target))
        if (reaction.reversible) {
            reactionTargetLinks.forEach(link => reaction.addLinkToReaction(link.source))
        }

    }

    const getCompoundNode = (id) => {
        return graphState.data.nodes.find(node => node.id === id)
    }

    const getCompoundAbbreviation = (id) => {
        return typeof graphState.abbreviationsObject[`${id}`] === "undefined" ? id : graphState.abbreviationsObject[`${id}`]
    }

    const getStoichiometricCoefficient = (id, stoichiometry) => {
        return stoichiometry[id]
    }

    const addSubstrates = (reaction, compoundTargetLinks, stoichiometrySubstrates) => {
        compoundTargetLinks.forEach(link => {
            const substrate = new Compound(link.source)
            substrate._x = getCompoundNode(substrate.name).x
            substrate._y = getCompoundNode(substrate.name).y
            substrate._typeOfCompound = "substrate"
            substrate._opacity = getCompoundNode(substrate.name).opacity
            substrate._abbreviation = getCompoundAbbreviation(substrate.name)
            const stoichiometricCoefficient = getStoichiometricCoefficient(getId(substrate.name), stoichiometrySubstrates)
            reaction.addSubstrateObject(substrate, stoichiometricCoefficient)
        })
    }

    const addProducts = (reaction, compoundSourceLinks, stoichiometryProducts) => {
        compoundSourceLinks.forEach(link => {
            const product = new Compound(link.target)
            product._x = getCompoundNode(product.name).x
            product._y = getCompoundNode(product.name).y
            product._typeOfCompound = "product"
            product._opacity = getCompoundNode(product.name).opacity
            product._abbreviation = getCompoundAbbreviation(product.name)
            const stoichiometricCoefficient = getStoichiometricCoefficient(getId(product.name), stoichiometryProducts)
            reaction.addProductObject(product, stoichiometricCoefficient)
        })
    }


    const addCompounds = (reaction, compoundSourceLinks, compoundTargetLinks, stoichiometry) => {
        addSubstrates(reaction, compoundTargetLinks, stoichiometry.substrates)
        addProducts(reaction, compoundSourceLinks, stoichiometry.products)
    }

    const getReactions = () => {
        const reactionNodes = getReactionNodes()
        const reactions = reactionNodes.map(reactionNode => {
            const sourceLinks = getLinksSource(reactionNode)
            const targetLinks = getLinksTarget(reactionNode)
            const compoundSourceLinks = getCompoundLinks(sourceLinks)
            const compoundTargetLinks = getCompoundLinks(targetLinks)
            const reactionSourceLinks = getReactionLinks(sourceLinks)
            const reactionTargetLinks = getReactionLinks(targetLinks)
            const isForwardReaction = getIsForwardReaction(reactionNode, generalState.reactionsInSelectArray)
            const stoichiometry = getStoichiometry(isForwardReaction, reactionNode)
            const reaction = createNewReaction(reactionNode)
            addReactionLinks(reaction, reactionSourceLinks, reactionTargetLinks)
            addCompounds(reaction, compoundSourceLinks, compoundTargetLinks, stoichiometry)
            return reaction
        })
        return reactions
    }

    const writeKo = (output, koList) => {
        koList.forEach(ko => output += ko.concat(","))
        output = output.substring(0, output.length - 1) //delete last comma
        output += ";"
        return output
    }
    const writeEc = (output, ecList) => {
        ecList.forEach(ec => output += ec.concat(","))
        output = output.substring(0, output.length - 1) //delete last comma
        output += ";"
        return output
    }

    const writeCsv = (reactions) => {
        let output = "stepId;ReactionNumberId;koNumberIds;ecNumberIds;stochCoeff;compoundId;typeOfCompound;reversibility;taxonomy;reactionX;reactionY;CompoundX;CompoundY;reactionAbbr;compoundAbbr;keyComp;linkedTo\n"
        reactions.forEach((reaction, index) => {
            output += index.toString().concat(";")
            output += reaction.name.concat(";")
            output = writeKo(output, reaction.koList)
            output = writeEc(output, reaction.ecList)
            output += ";;;".concat(reaction.reversible ? "reversible" : "irreversible" + ";")
        })
        return output
    }

    const download = () => {
        const reactions = getReactions()
        console.log(reactions)
        // const output = writeCsv(reactions)
        //downloadCsv(output)
    }

    return (
        <div>
            <button disabled={graphState.data.nodes.length < 1} className={"download-button"}
                    onClick={download}>Download ral Csv
            </button>
        </div>
    );
};

export default CsvDownloader;

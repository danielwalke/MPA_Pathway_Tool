/*
this component is responsible for drawing all components from all read/annotated sbml reactions/compounds into the Graph (adding them to the redux-store graph -> data)
data:{
nodes:[{id:"", color,:"", symbolType:"", opacity:1}], links:[{
source:"", target:"", opacity:1}]}
 */

//checks whether a specific node "newNode" is in the existent nodes
const nodeInData = (nodes, newNode) =>{
    let isInData = false
    const foundNodes = nodes.filter(node => node.id === newNode.id)
    if(foundNodes.length>0){
        isInData = true
    }
    return isInData
}

//checks whether a specific link "newLink" is in the existent links
const linkInData = (links, newLink) =>{
    let isInData = false
    const foundLinks = links.filter(link => link.source === newLink.source && link.target === newLink.target)
    if(foundLinks.length>0){
        isInData= true
    }
    return isInData
}

// return a node object
const createNode = (id, color, symbolType, x, y, opacity) =>{
    return(
        {
            id: id,
            color: color,
            symbolType: symbolType,
            x: x,
            y: y,
            opacity: opacity
        }
    )
}

//return a link object
const createLink = (source, target, opacity) =>{
    return(
        {
            source: source,
            target: target,
            opacity: opacity
        }
    )
}

export const setReactionsAndCompoundsInStore = (state, listOfReactions) =>{
   const data = {nodes:[], links:[]}
    listOfReactions.map(reaction => {
        const reactionId = reaction.sbmlId.concat(";" + reaction.sbmlName + " " + reaction.keggId); //retruns name like "R_PFK;Phosphofructokinase UXXXXX"
        const reactionOpacity = 1;
        const reactionX = 0;
        const reactionY = 0;
        const reactionSymbolType ="diamond";
        const reactionColor= "black";
        const reactionNode = createNode(reactionId, reactionColor, reactionSymbolType, reactionX, reactionY, reactionOpacity);
        const substrateNodes = reaction.substrates.map(substrate =>{
            const substrateId = substrate.sbmlId.concat(";" + substrate.sbmlName + " " + substrate.keggId); //retruns name like "M_pep_c;Phosphoenolpyruvate K/G/CXXXXX"
            return createNode(substrateId, "green", "circle", 0, 0,1);
        })
        const productNodes = reaction.products.map(product =>{
            const productId = product.sbmlId.concat(";" + product.sbmlName + " " + product.keggId); //retruns name like "M_pep_c;Phosphoenolpyruvate K/G/CXXXXX"
            return createNode(productId, "green", "circle", 0, 0,1);
        })
        //push reaction nodes in data
        if(!nodeInData(data.nodes, reactionNode)){
            data.nodes.push(reactionNode);
        }
        //push substrate nodes in data
        substrateNodes.map(node =>{
            if(!nodeInData(data.nodes, node)){
                data.nodes.push(node)
            }
            return null;
        })
        //push product nodes in data
        productNodes.map(node =>{
            if(!nodeInData(data.nodes, node)){
                data.nodes.push(node)
            }
            return null;
        })
        //push substrate links in data
        substrateNodes.map(substrate => {
            const substrateLink = createLink(substrate.id, reactionNode.id, 1)
            if(!linkInData(data.links, substrateLink)){
                data.links.push(substrateLink)
            }
            return null;
        })
        //push product links in data
        productNodes.map(product => {
            const productLink = createLink(reactionNode.id, product.id, 1)
            if(!linkInData(data.links, productLink)){
                data.links.push(productLink)
            }
            return null;
        })
    })
  return data
}
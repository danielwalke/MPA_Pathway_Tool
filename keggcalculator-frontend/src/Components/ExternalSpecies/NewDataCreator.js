import React from 'react';

export const handleChangeInput = (fbaState, counter, nodePrev) =>{
    const nodes = []
    const links = []

    var theta = [0, Math.PI / 6, Math.PI / 4, Math.PI / 3, Math.PI / 2, 2 * (Math.PI / 3), 3 * (Math.PI / 4), 5 * (Math.PI / 6), Math.PI, 7 * (Math.PI / 6), 5 * (Math.PI / 4), 4 * (Math.PI / 3), 3 * (Math.PI / 2), 5 * (Math.PI / 3), 7 * (Math.PI / 4), 11 * (Math.PI / 6)];
    const nodeSpec = createNode(counter, theta)
    if(fbaState.data_circular.nodes.length < 1) {
        createInitialNode(nodes, nodePrev)
        addNode(nodes, nodeSpec)
        const linkspec = createLink(nodes[0], nodeSpec)
        addLink(links, linkspec)
    }
    else{
        const sourceNode = fbaState.data_circular.nodes[0]
        console.log(sourceNode)
        addNode(nodes, sourceNode)
        addNode(nodes, nodeSpec)
        const linkspec = createLink(nodes[0], nodeSpec)
        addLink(links, linkspec)
    }





    return {nodes, links}

}

const createInitialNode = (nodes, nodePrev) =>{
    nodes.push(nodePrev)
}

const createNode = (counter, theta) =>{
    var counter1 = counter - counter/2;
    var counterst = counter1.toString()
    console.log(counterst)


    var x = 0;
    var y = 0;
    var radian = 0;
    var inc = 50/360
    var radius = 100;
    var maxRadians = 2 * Math.PI;
    var angle = counter1 * 20 + 180;
    var distance = 2


    x = 500 + radius * Math.cos(angle*Math.PI/180) * distance;
    y = 250 + radius * Math.sin(angle*Math.PI/180) * distance;

    
    return(
        {
            id: counterst,
            color: '#FFF5EE',
            symbolType: 'square',
            size: 2000,
            x : x,
            y : y,
            renderLabel: false,
        }
    )
}

const createLink = (source, target) =>{
    return(
        {
            source: source.id,
            target: target.id,
            size: 1,
            color: 'black',
            strokeWidth: 1,

        }
    )
}

const addNode = (nodes, nodeSpec) =>{
    nodes.push(nodeSpec)
}

const addLink = (links, linkspec) =>{
    links.push(linkspec)
}
const getX = (angle, radius) =>{
    return Math.cos(angle) * radius
}

const getY = (angle, radius) =>{
    return Math.sin(angle) * radius
}

const getNextAngle = (currentAngle, angleDiff) => {
    return currentAngle+angleDiff
}

export const getNodes = (radius, numberOfNodes, exclusionNodeList) =>{
    const nodes = []
    const links = []
    let currentAngle = 0
    nodes.push({
        id: -1,
        x: +400,
        y: +400,
        size: 250*Math.pow(0.7, Math.floor(numberOfNodes/15)),
        color: "red"
    })

    for(let nodeIndex = 0; nodeIndex< numberOfNodes; nodeIndex++){
        const nodeWasDeleted= exclusionNodeList.includes(nodeIndex)
        console.log(nodeWasDeleted)
        if(!nodeWasDeleted){
            nodes.push({
                id: nodeIndex,
                x: getX(currentAngle, radius)+400,
                y: getY(currentAngle, radius)+400,
                size: 200*Math.pow(0.7, Math.floor(numberOfNodes/15)), //20with diff labelpos
                color: "red"
            })
            links.push({
                source: -1,
                target: nodeIndex
            })
        }
        currentAngle = getNextAngle(currentAngle, 2*Math.PI/numberOfNodes)

    }
    return {nodes,links}
}

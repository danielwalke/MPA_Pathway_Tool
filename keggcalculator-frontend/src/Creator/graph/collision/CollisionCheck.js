export const isColliding = (targetNode, otherNodes) => {
    const {x, y} = targetNode
    otherNodes.forEach(node => {
        if ((node.labelPosition === "right" || !node.labelPosition) && isInXRangeRight(node, x) && isInYRange(node, y)) {
            node.labelPosition = "left"
        } else if (node.labelPosition === "left" && isInXRangeLeft(node, x) && isInYRange(node, y)) {
            node.labelPosition = "right"
        }
    })
    otherNodes.push(targetNode)
    return otherNodes
}


const isInXRangeRight = (node, x) => {
    return (node.x <= x && node.x + 150 >= x)
}

const isInXRangeLeft = (node, x) => {
    return (node.x >= x && node.x - 150 <= x)
}

const isInYRange = (node, y) => {
    return (node.y - 2 <= y && node.y + 2 >= y)
}

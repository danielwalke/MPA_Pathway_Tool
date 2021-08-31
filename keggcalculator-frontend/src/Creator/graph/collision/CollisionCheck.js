export const isColliding = (nodeTarget, nodes) => {
    const {x, y} = nodeTarget
    nodes.forEach(node => {
        if ((node.labelPosition === "right" || typeof node.labelPosition === "undefined") && isInXRangeRight(node, x) && isInYRange(node, y)) {
            node.labelPosition = "left"
        } else if (node.labelPosition ==="left" && isInXRangeLeft(node, x) && isInYRange(node, y)) {
            node.labelPosition = "right"
        }
    })
    nodes.push(nodeTarget)
    return nodes
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

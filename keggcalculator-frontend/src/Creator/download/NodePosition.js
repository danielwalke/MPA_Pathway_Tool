import * as d3 from "d3";


// returns node position of selected compound or reaction
export const getNodePosition = (compound) => {
    const nodeList = d3.selectAll("g")._groups[0]
    const graphObjects = nodeList[0].children
    let x = ""
    let y = ""
    for (let i = 0; i < graphObjects.length; i++) {
        if (graphObjects[i].getAttribute("class") === "node") {
            const nodeId = graphObjects[i].getAttribute("id")
            if (compound === nodeId) {
                x = graphObjects[i].getAttribute("cx")
                y = graphObjects[i].getAttribute("cy")
            }
        }
    }
    return ({x: x, y: y})
}

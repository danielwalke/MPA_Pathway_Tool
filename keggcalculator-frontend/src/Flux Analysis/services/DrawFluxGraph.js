
export function drawFluxGraph(prevGraphData, changedReactionObj, fluxData) {
    // handle graph reset on options change
    // handle arrow direction on bound change
    // handle arrow direction when data is received

    const newGraphData = {nodes: [...prevGraphData.nodes], links: []}

    newGraphData.links = prevGraphData.links.map(link => {
        if (prevGraphData) {
            // if reaction settings are changed, link Strokewidth and color are reset
            link.strokeWidth = undefined
            link.color = undefined
        }
    })



    return(graphData)
}

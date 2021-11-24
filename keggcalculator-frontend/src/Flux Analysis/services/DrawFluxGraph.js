
export function drawFluxGraph(prevGraphData, changedReactionObj, fluxData) {

    const newGraphData = {nodes: [...prevGraphData.nodes], links: []}

    newGraphData.links = prevGraphData.links.map(link => {
        if (prevGraphData && changedReactionObj && !fluxData) {
            // if reaction settings are changed, link Strokewidth and color are reset
            link.strokeWidth = undefined
            link.color = undefined
            if (link.source === changedReactionObj.reactionName || link.target === changedReactionObj.reactionName) {

            } else {
                return link
            }
        }

        if (prevGraphData && !changedReactionObj && fluxData) {
            // if flux data are provided, update link directions, strokeWidth and color
        }
    })



    return(graphData)
}
